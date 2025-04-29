import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import User from '../models/User';
import ScheduleEntry from '../models/ScheduleEntry';

const router = Router();

/* ---------- helpers ---------- */
const uid = () => Date.now(); // simple unique id

/* ---------- 1. get all logs ---------- */
router.get('/log', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id, 'profile.enchancementLog').lean();
  if (!user) {
    res.status(404).json({ error: 'user not found' });
    return;
  }
  res.json({ logs: user.profile.enchancementLog ?? [] });
});

/* ---------- 2. create log ---------- */
router.post('/log', authMiddleware, async (req: Request, res: Response) => {
  const newLog = { id: uid(), ...req.body };
  await User.updateOne({ _id: req.user!.id }, { $push: { 'profile.enchancementLog': newLog } });
  res.status(201).json({ success: true, log: newLog });
});

/* ---------- 3. update log ---------- */
router.put(
  '/log/:id',
  authMiddleware,
  async (req: Request<{ id: string }, {}, Partial<any>>, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const updates = req.body;

    const result = await User.updateOne(
      { _id: req.user!.id, 'profile.enchancementLog.id': id },
      {
        $set: Object.fromEntries(
          Object.entries(updates).map(([k, v]) => [`profile.enchancementLog.$.${k}`, v])
        ),
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'log entry not found' });
      return;
    }

    res.json({ success: true });
  }
);

/* ---------- 4. delete log ---------- */
router.delete(
  '/log/:id',
  authMiddleware,
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    const result = await User.updateOne(
      { _id: req.user!.id },
      { $pull: { 'profile.enchancementLog': { id } } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: 'log entry not found' });
      return;
    }

    res.json({ success: true });
  }
);

/* ---------- 5. update profile fields ---------- */
// in the same src/routes/user.ts, below your GET:

// PATCH /user/me — updates profile fields
router.patch('/me', authMiddleware, async (req, res): Promise<any>=> {
    console.log('[route] PATCH /user/me', req.body);
  
    // map body keys to profile.* paths
    const updates = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [`profile.${k}`, v])
    );
  
    const updated = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: updates },
      { new: true }
    )
      .select('-passwordHash')
      .exec();
  
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    return res.json(updated);
  });
  

export default router;
