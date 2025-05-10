import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import LearningSession, { ILearningSession } from '../models/LearningSeason';
import LearningSeason from '../models/LearningSeason';
import { z } from 'zod';
import { validate } from '../utils/validate';
const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const dataParam = req.query.date as string | undefined;
    const filter: any = { userId: req.user!.id };
    if (dataParam) {
      filter.date = new Date(dataParam);
    }
    const sessions = await LearningSession.find(filter)
      .sort({ startTime: 1 })
      .lean<ILearningSession>();
    res.json(sessions);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not fetch learning sessions' });
  }
});

export const createLearning = z
  .object({
    date: z.coerce.date(),
    topic: z.string().min(1).max(120),
    hour: z.number(),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    notes: z.string().max(200).optional(),
    goalId: z.string().length(24).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  })
  .strict();

router.post('/', validate(createLearning), async (req, res) => {
  try {
    const session = await LearningSeason.create({
      userId: req.user!.id,
      ...req.body,
    });
    res.status(201).json(session);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not create learning session' });
  }
});
export const updateLearning = createLearning.partial().extend({
  topic: z.string().min(1).max(120),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
    goalId: z.string().length(24).optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
     status: z.enum(['planned', 'done', 'skipped']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    
});
router.put('/:id', validate(updateLearning), async (req, res): Promise<any> => {
  try {
    const updated = await LearningSession.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user!.id }, // owner check
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean<ILearningSession>();
    if (!updated) return res.status(404).json({ err: 'not found' });
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not update session' });
  }
});

router.delete('/:id', async (req, res): Promise<any> => {
  try {
    const result = await LearningSession.deleteOne({
      _id: req.params.id,
      userId: req.user!.id,
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    res.sendStatus(204);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: ' could not delete session' });
  }
});

export default router;
