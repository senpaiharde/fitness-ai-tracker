import  express  from "express";
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();
const allowedOrigins = ['http://localhost:3000',];

const app = express();


app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/user',userRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

export default app