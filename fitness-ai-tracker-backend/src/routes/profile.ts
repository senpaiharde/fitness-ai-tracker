import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { readUsers, writeUsers } from '../utils/userstore';

type profile = {
  age?: number;
  weight?: number;
  height?: number;
  isEnchanded?: boolean;
  CreatedAt?: number;
  enchancementLog: EnhancementLog[];
};
const router = Router();

const updateProfileHandler = async (
  req: Request<{}, {}, profile>,
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



type EnhancementLog = {
  id: number;
  date: number;
  compound: string;
  dose: number;
  time: string;
  goal?: string;
};

type CreateLogDTO = Omit<EnhancementLog, 'id'>;

const createLogHandler = async (
  req: Request<{}, {}, CreateLogDTO>,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
   res.status(404).json({ error: 'user not found' }) 
   return ;
  }

  // Generate a unique id on the server
  const newLog: EnhancementLog = {
    id: Date.now(),
    ...req.body
  };

  // Ensure the array exists
  user.profile.enchancementLog = user.profile.enchancementLog || [];
  user.profile.enchancementLog.push(newLog);
  writeUsers(users);

  console.log('✅ Log created:', newLog);
  res.status(201).json({ success: true, log: newLog });
};






const updatelog = async (
  req: Request<{ id: string }, {}, Partial<EnhancementLog>>,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: 'user not found' });
    return;
  }
  const idParam = req.params.id;
  const logId = Number(idParam);
  
  const updates = req.body;
  const orignalLogs = user.profile.enchancementLog || [];
  let found = false;

  user.profile.enchancementLog = orignalLogs.map((entry) => {
    if (entry.id === logId) {
      found = true;
      return { ...entry, ...updates };
    }
    return entry;
  });
  if (!found) {
     res.status(404).json({ error: 'log entry not found' })
     return;
  }



  writeUsers(users);
  console.log('✅ Profile updated:', req.body);
  res.status(200).json({ success: true });
};





const deleteLog = async (
    req: Request<{ id: string }>, 
    res: Response): 
    Promise<void> => {

  const userId = req.user?.id;

  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: 'user not found' });
    return;
  }

  const logId = Number(req.params.id);
  if (Number.isNaN(logId)) {
   res.status(400).json({ error: 'Invalid log id' })
   return ;
  }
  const originLength = user.profile.enchancementLog.length;

  user.profile.enchancementLog = user.profile.enchancementLog.filter((log) => log.id !== logId);

  if (user.profile.enchancementLog.length === originLength) {
    res.status(404).json({ error: 'log entry not found' });
    return;
  }
  writeUsers(users);

  console.log('Log removed', logId);
  res.status(200).json({ success: true });
};

const getLogsHandler = async (
    req: Request, 
    res: Response
): 
    Promise<void> => {
    const users = readUsers();
    const user = users.find(u => u.id === req.user!.id);
    if (!user) { res.status(404).json({ error: 'user not found' })
        return;}
    res.json({ logs: user.profile.enchancementLog || [] });
  };

router.post('/log', authMiddleware, createLogHandler);


router.get('/log', authMiddleware, getLogsHandler);
router.put('/me', authMiddleware, updateProfileHandler);
router.put('/log/:id', authMiddleware, updatelog);
router.delete('/log/:id', authMiddleware, deleteLog);
export default router;
