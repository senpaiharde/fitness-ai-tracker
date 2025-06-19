import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';
import { z } from 'zod';
import { validate } from '../utils/validate';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import mongoose from 'mongoose';
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;
    const rawText = String(req.body.text || '').trim();
    if (!rawText) {
      return res.status(400).json({ error: '`text` field is required.' });
    }

    const verbose = req.query.verbose === 'true';

    const { parsed, usage, raw } = await extractFieldsAdaptive(rawText, { verbose });

    const aiEntry = await AIEntry.create({
      userId,
      rawText,
      ...parsed,
      usage,
      responseLength: raw.length,
      verbose,
    });

    const today = new Date();

    if (parsed.workout) {
      await LifeLog.updateOne(
        { userId, date: today },
        {
          $set: {
            training: {
              type: parsed.workout.type,
              weightKg: parsed.workout.weightKg,
              reps: parsed.workout.reps,
              time: parsed.workout.time,
            },
          },
        },
        { upsert: true }
      );
    }

    if (parsed.studyMinutes != null) {
      const session = await LearningSession.create({
        userId,
        Minutes: parsed.studyMinutes,
        date: today,
      });
      await LifeLog.updateOne(
        {
          userId,
          date: today,
        },
        { $push: { studySessions: session._id } },
        { upsert: true }
      );
    }

    if (parsed.foodPlan) {
      await FoodLog.create({
        userId,
        planText: parsed.foodPlan,
        date: today,
      });
    }
    if (parsed.gaming) {
      await LifeLog.updateOne(
        { userId, date: today },
        {
          $push: {
            gamingSessions: {
              game: parsed.gaming.game,
              minutes: parsed.gaming.minutes,
              time: parsed.gaming.time,
            },
          },
        },
        { upsert: true }
      );
    }
    if (parsed.injection) {
      const inj = await CompoundInjection.create({
        userId,
        compound: parsed.injection.compound,
        doseMg: parsed.injection.doseMg,
        time: parsed.injection.time,
      });
      await LifeLog.updateOne(
        { userId, date: today },
        { $push: { injectionRecords: inj._id } },
        { upsert: true }
      );
    }

    let message = 'updated boss';
    if (parsed.workout) {
      const w = parsed.workout;
      message =
        `logged your ${w.type}` +
        (w.weightKg ? `at ${w.weightKg}KGX${w.reps}` : '') +
        (w.time ? `${w.time}` : '');
    }

    const loaded: string[] = [];
    const logsPayload: Record<string, any[]> = {};
    if (parsed.workout) {
      loaded.push('workout');
      logsPayload.workout = [
        /* fetch or include summary for UI */
      ];
    }
    if (parsed.workout) {
      loaded.push('studyMinutes');
      logsPayload.studyMinutes = [
        /* fetch or include summary for UI */
      ];
    }
    if (parsed.workout) {
      loaded.push('foodPlan');
      logsPayload.foodPlan = [
        /* fetch or include summary for UI */
      ];
    }

    if (parsed.workout) {
      loaded.push('gaming');
      logsPayload.gaming = [
        /* fetch or include summary for UI */
      ];
    }
    if (parsed.workout) {
      loaded.push('injection');
      logsPayload.injection = [
        /* fetch or include summary for UI */
      ];
    }

    const chatAnswers: { type: 'chat'; payload: string }[] = [];
    if (rawText.endsWith('?')) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful coach.' },
          { role: 'user', content: rawText },
        ],
        max_tokens: 150,
      });
      const aiMsg = chat.choices?.[0]?.message?.content?.trim() || '';
       chatAnswers.push({ type: 'chat', payload: aiMsg });
    }
   
    console.log(aiEntry._id, message, 'ai answer');
    return res.status(201).json({
      aiEntryId: aiEntry._id,
      message,
    });
  } catch (err) {
    console.error('Error in POST /api/autoBoard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
