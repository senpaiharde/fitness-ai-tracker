import { Router, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import  User  from '../models/USer';
import { Request, Response } from 'express';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET not defined');

const signupHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email.toLowerCase().trim(),
    name,
    passwordHash: hashed,
    profile: {
      isEnchaned: false,
      enchancementLog: [],
      createdAt: new Date(),
    },
  });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invaild credentials' });
    return;
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

router.post('/signup', signupHandler);
export default router;
