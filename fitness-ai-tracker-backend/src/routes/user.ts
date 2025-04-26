/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { readUsers, writeUsers } from '../utils/userstore';

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
    
    createdAt:user.profile.CreatedAt,
    age:user.profile.age,
    enchancementLog:user.profile.enchancementLog || [],
    height:user.profile.height,
    userId:user.profile.id,
    isEnchaned:user.profile.isEnchaned,
    weight:user.profile.weight,
     });
};



router.get('/me', authMiddleware, getUserHandler);


export default router;
