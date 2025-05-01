import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import SupplementIntake, { ISupplementIntake } from '../models/SupplementIntake';


import { z } from 'zod';
import { validate } from '../utils/validate';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const dataParam = req.query.date as string | undefined;
    const filter: any = { userId: req.user?.id };
    if (dataParam) {
      const dayStart = new Date(dataParam);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.timeStamp = { $gte: dayStart, $lt: dayEnd };
    }
    const logs = await SupplementIntake.find(filter)
      .sort({ timeStamp: 1 })
      .lean<ISupplementIntake>();
    res.json(logs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: ' could not fetch supplement intakes' });
  }
});

const intakeSchema = z.object({
  supplementId: z.string().length(24), // Mongo ObjectId
  timestamp: z.string().datetime().optional(), // ISO-string; default = now
  dosageMg: z.number().positive(),
  notes: z.string().max(200).optional(),
});
router.post('/', validate(intakeSchema), async (req: Request, res: Response): Promise<any> => {
  try {
    
    const data = await SupplementIntake.create({
        userId:       req.user!.id,
        ...req.body,                       // already validated & typed
        timestamp: req.body.timestamp || new Date()
      });
    res.status(201).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not record supplements intake' });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await SupplementIntake.deleteOne({
      _id: req.params.id,
      userId: req.user?.id,
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    res.sendStatus(204);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not delete supplement intake' });
  }
});

export default router;
