import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import waitlistRoutes from '@/modules/waitlist/routes/waitlist.routes';

dotenv.config();

export const app: Application = express();

app.use(helmet());
app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nydl';

// Basic connection logic (Note: serverless environments may need connection pooling)
mongoose.connect(MONGO_URI).catch((err) => console.error('MongoDB connection error:', err));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'NYDL-API' });
});

app.use('/api/v1/waitlist', waitlistRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: 'Internal Server Error' });
});