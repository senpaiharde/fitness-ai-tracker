import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import CompoundInjection, { ICompoundInjection } from '../models/CompoundInjection';

import { z } from 'zod';
import { validate } from '../utils/validate';
const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date as string | undefined;
    const filter: any = { userId: req.user?.id };
    if (dateParam) {
      const dayStart = new Date(dateParam);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.timeStamp = { $gte: dayStart, $lt: dayEnd };
    }
    const logs = await CompoundInjection.find(filter)
      .sort({ timeStamp: 1 })
      .lean<ICompoundInjection>();
    res.json(logs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not fetch compound injections' });
  }
});
const injectionSchema = z.object({
  compoundId: z.string().length(24), // Mongo ObjectId
  timestamp: z.string().datetime().optional(), // ISO-string; default = now
  dosageMg: z.number().positive(),
  injectionSite: z.string().max(200).optional(),
  notes: z.string().max(200).optional(),
});

router.post('/', validate(injectionSchema), async (req: Request, res: Response) => {
  try {
    const log = await CompoundInjection.create({
      userId: req.user!.id,
      ...req.body,
    });
    res.status(201).json(log);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not record injection' });
  }
});

router.put('/:id', validate(injectionSchema.partial()), async (req: Request, res: Response) => {
  try {
    const result = await CompoundInjection.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean<ICompoundInjection>();
    if (!result) {
      res.status(404).json({ err: 'not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'could not update injection record' });
  }
});

router.delete('/:id', async (req, res): Promise<any> => {
  try {
    const result = await CompoundInjection.deleteOne({
      _id: req.params.id,
      userId: req.user!.id,
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete injection record' });
  }
});

export default router;
