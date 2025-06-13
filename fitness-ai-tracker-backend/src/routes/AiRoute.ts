import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';
import { z } from 'zod';
import { validate } from '../utils/validate';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import mongoose from 'mongoose';
dotenv.config();




if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const router = Router();
router.use(authMiddleware);



/**
 * If ChatGPT wraps JSON in triple‐backticks, this will remove them.
 */
function stripJSONFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = trimmed.match(fenceRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return trimmed;
}

/**
 * If GPT doesn’t return labels, we generate a set of fallback labels
 * based on words in the board’s title.
 */
function generateTopicLabels(boardTitle: string): Array<{ title: string; color: string; id: string }> {
  const colorPalette = [
    '#1E90FF',
    '#32CD32',
    '#FFD700',
    '#C19A6B',
    '#8A2BE2',
    '#FF8C00',
    '#DC143C',
  ];

  const rawWords = boardTitle
    .split(/[\s\-:,_]+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 2);

  const capitalizedWords = rawWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));

  const labels: string[] = [];
  for (let i = 0; i < capitalizedWords.length && labels.length < 4; i++) {
    const word = capitalizedWords[i];
    if (!labels.includes(word)) {
      labels.push(word);
    }
  }

  const fallback = ['Travel', 'History', 'Sightseeing', 'Logistics', 'Culture', 'Planning', 'MustSee'];
  let idx = 0;
  while (labels.length < 7 && idx < fallback.length) {
    if (!labels.includes(fallback[idx])) {
      labels.push(fallback[idx]);
    }
    idx++;
  }

  return labels.slice(0, 7).map((title, i) => ({
    id:    new mongoose.Types.ObjectId().toString(),
    title,
    color: colorPalette[i % colorPalette.length],
  }));
}

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { prompt } = req.body as { prompt?: string };
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: '`prompt` (string) is required.' });
    }

    // 1) Build the ChatGPT prompt
    //    
    //   
    const systemMessage = {
  role: 'system',
  content: `

`.trim()
};


const userMessage = {
  role: 'user',
  content: `Please create a new schedule payload for: "${prompt.trim()}"`
};

const completion = await openai.chat.completions.create({
  model:       'gpt-4.1-nano',
  messages:    [systemMessage, userMessage] as any[],
  temperature: 0.2,
  max_tokens:  8000,
});


    // 3) Extract raw response
    const rawOutput = completion.choices[0].message?.content || '';
    console.log('⏺ Raw GPT response:\n', rawOutput);

    // 4) Strip any ```json fences```
    const jsonString = stripJSONFences(rawOutput);
    console.log('⏺ Stripped JSON string:\n', jsonString);

    // 5) Attempt to JSON.parse
    let payload: {
      
    };

    try {
      payload = JSON.parse(jsonString);
    } catch {
      console.error('‼️ Failed to parse JSON from ChatGPT:\n', jsonString);
      return res.status(500).json({ error: 'Failed to parse JSON from ChatGPT.' });
    }

   
    return res.status(201).json({  });
  } catch (err) {
    console.error('Error in POST /api/autoBoard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
