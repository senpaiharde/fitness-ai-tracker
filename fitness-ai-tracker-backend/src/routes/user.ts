/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';

import User from '../models/USer';
const router = Router();

const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id).lean();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { _id, email, name, profile } = user;
  res.json({
    id: _id,
    email,
    name,
    ...profile
  })
};

router.get('/me', authMiddleware, getUserHandler);

export default router;
