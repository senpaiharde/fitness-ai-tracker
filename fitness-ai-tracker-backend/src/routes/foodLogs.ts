import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodLog, { IFoodLog } from '../models/FoodLog';
import { z } from 'zod';
import { validate } from '../utils/validate';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const dataParam = req.query.date as string | undefined;
    const filter: any = { userId: req.user!.id };
    if (dataParam) {
      const dayStart = new Date(dataParam);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.timestamp = { $gte: dayStart, $lt: dayEnd };
    }
    const logs = await FoodLog.find(filter)
      .populate('foodItemId', 'name')
      .sort({ timestamp: 1 })
      .lean<IFoodLog>();
    res.json(logs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not fetch food logs' });
  }
});

export const foodLogSchema = z
  .object({
    /* ISO timestamp; default = now if omitted */
    timestamp: z.coerce.date().optional(),
    date:      z.coerce.date().optional(),

    /* new: allow hour on updates */
    hour:      z.number().int().min(0).max(23).optional(),

    /* Either reference a catalog item … */
    foodItemId: z.string().length(24).optional(),

    /* …or free-text entry           */
    manualText: z.string().max(200).optional(),

    grams:      z.number().positive().optional(),
    calories:   z.number().nonnegative().optional(),
    foodLog:    z.enum(['morning', 'evening', 'night']).optional(),
    macros:     z
      .object({
        totalCalories: z.number().nonnegative().optional(),
        protein:       z.number().nonnegative().optional(),
        carbs:         z.number().nonnegative().optional(),
        fat:           z.number().nonnegative().optional(),
      })
      .strict()
      .optional(),
    notes:      z.string().max(200).optional(),
  })
  .strict()
  /* Require at least foodItemId OR manualText */
  .refine(d => d.foodItemId || d.manualText, {
    message: 'Provide either foodItemId or manualText',
  });

router.post('/', validate(foodLogSchema), async (req, res): Promise<any> => {
  try {
    const ts = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    const hour = ts.getHours();  
    const log = await FoodLog.create({
      userId: req.user!.id,
      hour,
      ...req.body,
      timestamp: req.body.timestamp || new Date(),
    });
    res.status(201).json(log);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not create food log' });
  }
});
router.put('/:id', validate(foodLogSchema), async (req: Request, res: Response): Promise<any> => {
  try {
    const updates: any = { ...req.body };

    if (updates.plannedStart) {
      const [h] = updates.plannedStart.split(':');
      updates.hour = parseInt(h, 10);
    }
    const updated = await FoodLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not update entry' });
  }
});

router.delete('/:id', async (req, res): Promise<any> => {
  try {
    const result = await FoodLog.deleteOne({ 
        _id: req.params.id,
         userId: req.user?.id });
    if (result.deletedCount === 0) return res.status(404).json({ err: 'not found' });
    res.status(204);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not delete foo log' });
  }
});

// src/routes/foodLogs.ts  (add below existing routes)
router.get("/summary",
  async (req: Request, res: Response): Promise<any> => {
    try {
        
      const date = new Date(req.query.date as string);
      if (isNaN(date as any)) {
        return res.status(400).json({ error: 'date query required' });
      }
      const next = new Date(date);
      next.setDate(next.getDate() + 1);

      const pipeline = [
        { $match: { userId: req.user!.id, timestamp: { $gte: date, $lt: next } } },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: '$calories' },
            protein: { $sum: '$macros.protein' },
            carbs: { $sum: '$macros.carbs' },
            fat: { $sum: '$macros.fat' },
            entries: { $push: '$$ROOT' },
          },
        },
        { $project: { _id: 0 } },
      ];
      
      const [summary] = await FoodLog.aggregate(pipeline);
      res.json(summary ?? { totalCalories: 0, protein: 0, carbs: 0, fat: 0, entries: [] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not build summary' });
    }
  }
);

export default router;
