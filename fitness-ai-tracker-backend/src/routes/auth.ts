import { Router, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readUsers, writeUsers } from "../utils/userstore";
import { User } from "../types/user";
import { Request, Response } from 'express';
dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");



const signupHandler = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return ;
  }
    

  const users = readUsers();
  if (users.find(u => u.email === email)){
    res.status(409).json({ error: 'User already exists' });
    return
  }
    

  const hashed = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password: hashed,
    profile: {},
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);
  
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
  
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ token });
  });
router.post('/signup', signupHandler);
export default router;
