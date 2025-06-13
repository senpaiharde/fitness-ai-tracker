import OpenAI from 'openai';
import { logUserEntrySchema } from '.././Lib/Schemas';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function extractFieldsAdaptive(text: string) {
  
  const model = text.length < 200
    ? 'gpt-4o-mini'
    : 'gpt-3.5-turbo-1106';

  const resp = await openai.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      { role: 'system', content: 'Extract only the present fields, omit all else.' },
      { role: 'user',   content: text }
    ],
    function_call: { name: 'logUserEntry' },
    functions: [logUserEntrySchema],
  });

  const call = resp.choices[0].message.function_call!;
  return JSON.parse(call.arguments);
}
