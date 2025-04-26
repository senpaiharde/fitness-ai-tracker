import { Router, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { readUsers, writeUsers } from '../utils/userstore';
import { User } from '../types/user';
import { Request, Response } from 'express';
dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET not defined');

const signupHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password,name } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password: hashed,
    profile: {
        isEnchaned: false,
        enchancementLog: [],
        id: Date.now().toString()
      },
    
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(' Login route hit');
    console.log('Body:', req.body);

    const users = readUsers();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    const user = users.find((u) => u.email.trim().toLowerCase() === email);

    if (!email || !password) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }
    if (!user) {
        console.log(' User not found for:', email);
  console.log(' Existing users:', users.map(u => u.email));
      res.status(404).json({ error: 'User not found' });
      return;
    }
    console.log(' Stored hash:', user.password);
console.log(' Incoming password:', password);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error(' Login crash:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signup', signupHandler);
export default router;
