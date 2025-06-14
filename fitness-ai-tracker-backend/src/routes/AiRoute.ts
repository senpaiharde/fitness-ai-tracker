import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';
import { z } from 'zod';
import { validate } from '../utils/validate';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import { extractFieldsAdaptive } from '../services/aiPipeline.js';

import { AIEntry }           from '../models/AIEntry.js';
import { LifeLog } from '../models/LifeLog.js';
import LearningSession from '../models/LearningSeason';
import FoodLog from '../models/FoodLog.js';
import CompoundInjection from '../models/CompoundInjection.js';

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
