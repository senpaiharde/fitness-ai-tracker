/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { readUsers, writeUsers } from '../utils/userstore';
import { write } from 'fs';
import { profile } from 'console';

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

  res.status(200).json({ 
    id:user.id,
    email: user.email,
     profile: user.profile,
    name:user.name,
    createdAt : user.id
     });
};






const getUserHandler2 = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
  
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
  
    const logs = user.profile?.enchancementLog || [];
    res.status(200).json({ logs });
  };






router.get('/me', authMiddleware, getUserHandler);
router.get('/logs', authMiddleware, getUserHandler2);

export default router;
