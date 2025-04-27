import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import profileRoutes from './routes/profile';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import scheduleRouter from "./routes/schedule";
dotenv.config();
const allowedOrigins = ['http://localhost:5173'];

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use('/auth', authRoutes);
console.log('✅ Auth routes loaded');
app.use('/user', userRoutes);
app.use('/user',profileRoutes)

app.use("/api/schedule", scheduleRouter);
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
