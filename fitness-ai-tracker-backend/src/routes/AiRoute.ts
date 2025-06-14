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
import { LifeLog }           from '../models/LifeLog.js';
import  LearningSession    from '../models/LearningSeason';
import FoodLog               from '../models/FoodLog.js';
import CompoundInjection     from '../models/CompoundInjection.js';
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
    const userId  = req.user!.id;
    const rawText = String(req.body.text || '').trim();
    if (!rawText) {
      return res.status(400).json({ error: '`text` field is required.' });
    }

      const verbose = req.query.verbose === 'true';


       const { parsed, usage, raw } = await extractFieldsAdaptive(rawText, { verbose });


   


   

   
    return res.status(201).json({  });
  } catch (err) {
    console.error('Error in POST /api/autoBoard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
