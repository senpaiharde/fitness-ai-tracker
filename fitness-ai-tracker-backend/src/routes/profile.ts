import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { readUsers, writeUsers } from '../utils/userstore';

type ProfileUpdate = {
  age?: number;
  weight?: number;
  height?: number;
  isEnchanded?: boolean;
  CreatedAt?: number,
  enchancementLog: [],
};
const router = Router();

const updateProfileHandler = async (
  req: Request<{}, {}, ProfileUpdate>,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    res.status(404).json({ error: 'user not found' });
    return;
  }
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...req.body,
  };

  writeUsers(users);
  console.log('✅ Profile updated:', req.body);
  res.status(200).json({ success: true });
};

router.put('/me', authMiddleware, updateProfileHandler);




type EnhancementLog = {
    date: number,
    compound: string,
    dose: number,
    time : string,
    goal? : string,
}
const updateLogHandler = async (
    req: Request<{}, {}, EnhancementLog>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    const log: EnhancementLog = req.body;

    const users = readUsers()
    const user = users.find(u => u.id ===userId)

    if(!user) {
         res.status(404).json({error:'user not found'})
         return;
    }


    if (!user.profile.enchancementLog) {
        user.profile.enchancementLog = [];
      }
      
    
      user.profile.enchancementLog.push(log);
      writeUsers(users);
    
      console.log('✅ Log saved:', log);
      res.status(200).json({ success: true, log });
    };

    router.put('/log', authMiddleware, updateLogHandler);
export default router;


