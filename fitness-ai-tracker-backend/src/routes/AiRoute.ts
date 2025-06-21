import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { extractFieldsAdaptive } from '../services/aiPipeline';
import { AIEntry } from '../models/AIEntry';
import { LifeLog } from '../models/LifeLog';
import LearningSession from '../models/LearningSeason';
import FoodLog from '../models/FoodLog';
import CompoundInjection from '../models/CompoundInjection';

dotenv.config();
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = Router();
router.use(authMiddleware);

function buildSuggestionPrompt(parsed: Record<string, any>): string {
  // Turn each value into a natural-language fragment
  const parts = Object.entries(parsed)
    .map(([key, val]) => {
      if (val == null) return null;
      // For simple primitives:
      if (typeof val === 'string' || typeof val === 'number') {
        // e.g. "studyMinutes: 45m..."
        return `${key.replace(/([A-Z])/g, ' $1')}: ${val}`;
      }
      // For objects (e.g. workout, gaming):
      return `${key.replace(/([A-Z])/g, ' $1')}: ${JSON.stringify(val)}`;
    })
    .filter(Boolean);

  return (
    `You are an upbeat personal coach. The user just logged: ` +
    parts!.join(', ') +
    `. Give one concise, motivational tip that references at least one of these items.`
  );
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawText = (req.body.text || '').trim();
    if (!rawText) {
      res.status(400).json({ error: '`text` field is required.' });
      return;
    }

    // 1) Extract structured fields
    const { parsed, usage, raw } = await extractFieldsAdaptive(rawText, { verbose: false });

    // 2) Save the raw + parsed to AIEntry Schema!
    const aiEntry = await AIEntry.create({
      userId,
      rawText,
      ...parsed,
      usage,
      responseLength: raw.length,
      verbose: false,
    });

    const today = new Date();

    if (parsed.workout) {
      await LifeLog.updateOne(
        { userId, date: today },
        { $set: { training: parsed.workout } },
        { upsert: true }
      );
    }
    if (parsed.studyMinutes != null) {
      const session = await LearningSession.create({
        userId,
        minutes: parsed.studyMinutes,
        date: today,
      });
      await LifeLog.updateOne(
        { userId, date: today },
        { $push: { studySessions: session._id } },
        { upsert: true }
      );
    }
    if (parsed.foodPlan) {
      await FoodLog.create({ userId, planText: parsed.foodPlan, date: today });
    }
    if (parsed.gaming) {
      await LifeLog.updateOne(
        { userId, date: today },
        { $push: { gamingSessions: parsed.gaming } },
        { upsert: true }
      );
    }
    if (parsed.injection) {
      const inj = await CompoundInjection.create({
        userId,
        ...parsed.injection,
      });
      await LifeLog.updateOne(
        { userId, date: today },
        { $push: { injectionRecords: inj._id } },
        { upsert: true }
      );
    }

    // Build the generic "loaded"
    const loaded = Object.entries(parsed) // [key, value]
      .filter(([_, v]) => v != null) // keep only present fields
      .map(([k]) => k); // extract the key names
    const logsPayload = parsed;

    // answers
    const answers: Array<{ type: string; payload: any }> = [];

    // Acknowledgement
    const ackMsg = loaded.length ? `Logged: ${loaded.join(', ')}` : 'Nothing to log.';
    answers.push({ type: 'ack', payload: ackMsg });

    //  Logs front-end can render each value from logsPayload
    answers.push({ type: 'logs', payload: { loaded, logs: logsPayload } });

    // Optional chat reply if question
    if (loaded.length === 0) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Jarvis, a friendly personal assistant.' },
          { role: 'user', content: rawText },
        ],
        max_tokens: 50,
      });
      const chatMsg = chat.choices?.[0]?.message?.content?.trim() || '';
      answers.push({ type: 'chat', payload: chatMsg });
    } else if (rawText.endsWith('?')) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an professional successful coach.' },
          { role: 'user', content: rawText },
        ],
        max_tokens: 50,
      });
      const chatMsg = chat.choices?.[0]?.message?.content?.trim() || '';
      answers.push({ type: 'chat', payload: chatMsg });
        }
    //coaching
    const prompt = buildSuggestionPrompt(parsed);
    const coach = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are an professional successful coach.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
    });
    const suggestion = coach.choices?.[0]?.message?.content?.trim() || '';
    answers.push({ type: 'suggestion', payload: suggestion });

    // Return the unified answers array
    console.log(aiEntry._id, answers, 'AI answers');
    res.status(201).json({ aiEntryId: aiEntry._id, answers });
    return;
  } catch (err) {
    console.error('Error in POST /api/ai/intake:', err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;
