/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { readUsers } from '../utils/userstore';

const router = Router();

const getUserHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  console.log('User ID:', req.user?.id);
  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({ email: user.email, profile: user.profile });
};

router.get('/me', authMiddleware, getUserHandler);

export default router;
