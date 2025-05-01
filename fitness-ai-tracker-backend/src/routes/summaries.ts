import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import Summary, { ISummary } from '../models/Summary';
import { z } from 'zod';
import { validate } from '../utils/validate';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { periodType, start, end } = req.query as any;
    const filter: any = { userId: req.user!.id };
    if (periodType) filter.periodType = periodType;
    if (start && end) {
      filter.periodStart = { $gte: new Date(start) };
      filter.periodEnd = { $lte: new Date(end) };
    }
    const list = await Summary.find(filter).sort({ periodStart: -1 }).lean<ISummary>();
    res.json(list);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not fetch summarius' });
  }
});
const summarySchema = z.object({
  /* "weekly" | "monthly" | "custom"   the summary that could be*/
  periodType: z.enum(['weekly', 'monthly', 'custom']),

  /* ISO-8601 strings */
  periodStart: z.coerce.date(),   // ← ISO string → Date automatically
  periodEnd:   z.coerce.date(),

  /* Optional metrics block */
  metrics: z.object({
    totalTasksPlanned:   z.number().int().nonnegative().optional(),
    totalTasksCompleted: z.number().int().nonnegative().optional(),
    totalTrainingHours:  z.number().nonnegative().optional(),
    avgMoodRating:       z.number().min(1).max(10).optional(),
    weightChangeKg:      z.number().optional(),
    newPersonalRecords:  z.array(z.string()).optional()
  }).strict().optional(),
    /* Free-text sections (cap at 500 chars to keep docs sane) */
    biggestWins:    z.string().max(500).optional(),
    mainProblems:   z.string().max(500).optional(),
    adjustmentPlan: z.string().max(500).optional()
});

router.post('/', validate(summarySchema), async (req, res): Promise<any> => {
  try {
   
    const summary = await Summary.create({
        userId : req.user!.id,
        ...req.body
    });
    res.status(201).json(summary);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not create summary' });
  }
});

export default router;
