import { Router, Request, Response, request } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import UserSettings, { IUserSettings } from '../models/UserSettings';

import { z } from 'zod';
import { validate } from '../utils/validate';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    let settings = await UserSettings.findOne(
      { userId: req.user!.id },
      { $setOnInsert: { userId: req.user!.id } },
      { new: true, upsert: true }
    ).lean<IUserSettings>();
    res.json(settings);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ err: 'could not fetch settings' });
  }
});

const settingsSchema = z
  .object({
    preferredWakeTime: z.string().optional(),
    preferredSleepTime: z.string().optional(),
    learningFocusAreas: z.array(z.string()).optional(),
    supplementProtocols: z.array(z.string().length(24)).optional(), // ObjectIds
    dailyLogReminder: z.boolean().optional(),
    weeklyReviewDay: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).optional(),
  })
  .strict();

router.put('/',validate(settingsSchema), async (req: Request, res: Response): Promise<any> => {
  try {
    
    const settings = await UserSettings.findByIdAndUpdate(
      { userId: req.body!.id },
      { $set: req.body },
      { new: true, upsert: true , runValidators: true}
    ).lean<IUserSettings>();
    res.json(settings);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'could not update settings' });
  }
});

export default router;
