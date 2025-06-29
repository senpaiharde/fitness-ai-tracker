import OpenAI from 'openai';

import { encode } from 'gpt-3-encoder';
import { logUserEntrySchema, logUserEntryZod, LogUserEntry } from '../Lib/Schemas';
import { z } from 'zod';

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
type CreateParams = Parameters<OpenAI['chat']['completions']['create']>[0];
type MessageParam = CreateParams['messages'] extends Array<infer U> ? U : never;

// Configuration constants
const INPUT_TOKEN_LIMIT     = 1000;     // if user text exceeds this, we summarize first
const SUMMARY_MAX_TOKENS    = 256;      // how many tokens the summary call may use
const EXTRACTION_MAX_TOKENS = 256;      // default budget for the function-call extraction
const SHORT_MODEL           = 'gpt-4o-mini';
const LONG_MODEL            = 'gpt-3.5-turbo-1106';

//  Summarize very long inputs down to essentials 
async function prepareText(raw: string): Promise<string> {
  const tokenCount = encode(raw).length;
  
  if (tokenCount <= INPUT_TOKEN_LIMIT) return raw;

  // Summarize using a lightweight 3.5 model
  const summary = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: SUMMARY_MAX_TOKENS,
    messages: [
      {
        role: 'system',
        content:
          'You are a concise summarizer. ' +
          'Extract only the key activities, times, and numbers from the user`s text.'
      },
      { role: 'user', content: raw }
    ]
  });

  const backMsg =  summary.choices[0].message;
  if(!backMsg?.content){
    throw new Error("no content returned");
  }
  return backMsg.content.trim();
}

//  Safely call the function-call API with a retry on truncated JSON -
async function safeExtract(
  //text: string,
  messages: MessageParam[],
  model: string,
  initialMaxTokens: number
): Promise<{
  parsed: LogUserEntry;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  raw: string;
}> {
  let maxTokens = initialMaxTokens;



  for (let attempt = 0; attempt < 2; attempt++) {
    const resp = await openai.chat.completions.create({
      model,
      temperature: 0,
      messages,
      functions: [logUserEntrySchema],
      function_call: { name: logUserEntrySchema.name },
      max_tokens: maxTokens
    });
     
    const usage = resp.usage;
    if (!usage) throw new Error('OpenAI response missing usage info');
    
     const call = resp.choices[0].message?.function_call;



    if (!call || !call.arguments) throw new Error('OpenAI did not return a function_call with arguments');
    const rawArgs = call.arguments;




    try {
      // Parse the JSON string
      const json = JSON.parse(rawArgs);
      const parsed = logUserEntryZod.parse(json);
      return {
        parsed,
        usage: {
          promptTokens:    usage.prompt_tokens,
          completionTokens:usage.completion_tokens,
          totalTokens:     usage.total_tokens
        },
        raw: rawArgs
      };
    } catch {
      // If parsing or validation fails, double the budget once and retry
     maxTokens *= 2;
    }
  }

  throw new Error('Could not parse complete JSON after retry');
}

// Orchestrator: choose model, prepare text, extract 
export async function extractFieldsAdaptive(
  rawText: string,
  opts: { verbose?: boolean } = {}
): Promise<{
  parsed: LogUserEntry;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  raw: string;
}> {
  const { verbose = false } = opts;

  // Decide whether to summarize
  const text = verbose
    ? rawText
    : await prepareText(rawText);

  // Pick model based on length or verbose flag
  const tokenCount = encode(text).length;
  const model      = verbose
    ? 'gpt-4'
    : tokenCount < 300
    ? SHORT_MODEL
    : LONG_MODEL;

  // Build the common messages
  const messages: MessageParam[] = [
    {
      role: 'system',
      content: 'Extract only the present fields; omit everything else.'
    },
    { role: 'user', content: text }
  ];

  // Estimate an initial budget 
  const initialBudget = verbose
    ? 2000
    : Math.min(EXTRACTION_MAX_TOKENS, Math.ceil(tokenCount * 0.5) + 20);

  // Perform safe extraction with retry logic
   return safeExtract(messages, model, initialBudget);
}
