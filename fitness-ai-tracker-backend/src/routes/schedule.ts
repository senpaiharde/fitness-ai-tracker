// src/routes/schedule.ts
import { Router, Request, Response } from 'express';
import { authMiddleware }          from '../middleware/authmiddleware';
import ScheduleEntry, { IScheduleEntry } from '../models/ScheduleEntry';

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

/**
 * POST /schedule
 * { date, taskTitle, taskType?, plannedStart?, plannedEnd?, priority?, recurrenceRule?, goalId? }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const payload: Partial<IScheduleEntry> = {
      userId:       req.user!.id,
      date:         new Date(req.body.date),
      taskTitle:    req.body.taskTitle,
      taskType:     req.body.taskType,
      plannedStart: req.body.plannedStart,
      plannedEnd:   req.body.plannedEnd,
      priority:     req.body.priority,
      recurrenceRule: req.body.recurrenceRule,
      goalId:       req.body.goalId,
      status:       'planned'
    };
    const entry = await ScheduleEntry.create(payload);
    res.status(201).json(entry);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not create entry' });
  }
});

/**
 * PUT /schedule/:id
 * Body can include any updatable fields: taskTitle, actualStart, status, etc.
 */
router.put('/:id', async (req: Request, res: Response):Promise<any>=> {
  try {
    const updates = { ...req.body };
    if (updates.date) updates.date = new Date(updates.date);

    const updated = await ScheduleEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: updates },
      { new: true }
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
