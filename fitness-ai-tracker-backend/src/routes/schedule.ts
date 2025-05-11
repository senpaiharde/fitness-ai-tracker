
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import ScheduleEntry, { IScheduleEntry } from '../models/ScheduleEntry';
import { z } from 'zod';
import { validate } from '../utils/validate';
const router = Router();
router.use(authMiddleware);

/**
 * GET /schedule?date=YYYY-MM-DD
 * → List all entries for that date
 */
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const dateParam = req.query.date as string;
    if (!dateParam) {
      return res.status(400).json({ error: 'Missing ?date=YYYY-MM-DD' });
    }
    const date = new Date(dateParam);
    const entries = await ScheduleEntry.find({
      userId: req.user!.id,
      date,
    })
      .sort({ plannedStart: 1 })
      .lean();
    res.json(entries);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch schedule' });
  }
});

export const createSchedule = z
  .object({
    date: z.coerce.date(),
    taskTitle: z.string().min(1).max(120),
    taskType: z.string().max(40).optional(),
    hour: z.number(),
    plannedStart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    plannedEnd: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    recurrenceRule: z.string().max(200).optional(),
    goalId: z.string().length(24).optional(),
  })
  .strict();
function deriveHour(req: Request, res: Response, next: NextFunction) {
  if (req.body.plannedStart) {
    const hour = parseInt(req.body.plannedStart.split(':')[0], 10);
    req.body.hour = hour;
  }
  next();
}
/**
 * POST /schedule
 * { date, taskTitle, taskType?, plannedStart?, plannedEnd?, priority?, recurrenceRule?, goalId? }
 */

router.post(
  '/',
  deriveHour, // ← compute req.body.hour
  validate(createSchedule.extend({ hour: z.number().int().min(0).max(23) })),
  async (req: Request, res: Response) => {
    try {
      const entry = await ScheduleEntry.create({
        userId: req.user!.id,
        ...req.body,
      });
      res.status(201).json(entry);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Could not create entry' });
    }
  }
);

export const updateSchedule = z
  .object({
    
    date: z.coerce.date().optional(),
    taskTitle: z.string().min(1).max(120).optional(),
    taskType: z.string().max(40).optional(),
    plannedStart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    plannedEnd: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    recurrenceRule: z.string().max(200).optional(),
    goalId: z.string().length(24).optional(),
    actualStart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    actualEnd: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    status: z.enum(['planned', 'done', 'skipped']).optional(),
    // now allow and strip out *any* other keys without error:
  })
  .passthrough();
/**
 * PUT /schedule/:id
 * Body can include any updatable fields: taskTitle, actualStart, status, etc.
 */
router.put('/:id',  deriveHour,                       
    validate(updateSchedule), async (req: Request, res: Response): Promise<any> => {
  try {
    const updates: any = { ...req.body };

    if (updates.plannedStart) {
      const [h] = updates.plannedStart.split(':');
      updates.hour = parseInt(h, 10);
    }
    const updated = await ScheduleEntry.findOneAndUpdate(
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

/**
 * DELETE /schedule/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await ScheduleEntry.deleteOne({
      _id: req.params.id,
      userId: req.user!.id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.sendStatus(204);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete entry' });
  }
});

export default router;
