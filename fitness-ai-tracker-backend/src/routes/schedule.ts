// src/routes/schedule.ts
import { Router, Request, Response } from 'express';
import { authMiddleware }          from '../middleware/authmiddleware';
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
      date
    })
      .sort({ plannedStart: 1 })
      .lean();
    res.json(entries);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch schedule' });
  }
});







export const createSchedule = z.object({
    data: z.coerce.date(),
    taskTitle: z.string().min(1).max(120),
    taskType:      z.string().max(40).optional(),
    plannedStart:  z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    plannedEnd:    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    priority:      z.enum(['low','medium','high']).optional(),
    recurrenceRule:z.string().max(200).optional(),
    goalId:        z.string().length(24).optional()
}).strict()

/**
 * POST /schedule
 * { date, taskTitle, taskType?, plannedStart?, plannedEnd?, priority?, recurrenceRule?, goalId? }
 */

router.post('/',validate(createSchedule), async (req: Request, res: Response) => {
  try {
    
    const entry = await ScheduleEntry.create({
        userId: req.user!.id,
        ...req.body
    });
    res.status(201).json(entry);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not create entry' });
  }
});


export const updateSchedule = createSchedule.partial().extend({
    status:        z.enum(['planned','done','skipped']).optional(),
    actualStart:   z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    actualEnd:     z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()
  });
/**
 * PUT /schedule/:id
 * Body can include any updatable fields: taskTitle, actualStart, status, etc.
 */
router.put('/:id', validate(updateSchedule), async (req: Request, res: Response):Promise<any>=> {
  try {
    

    const updated = await ScheduleEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: req.body },
      { new: true,runValidators: true }
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
router.delete('/:id', async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await ScheduleEntry.deleteOne({
      _id: req.params.id,
      userId: req.user!.id
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
