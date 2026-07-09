import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '@/configs/db';
import { globalErrorHandler } from '@/middlewares/errorHandler';
import waitlistRoutes from './modules/waitlist/routes/waitlist.routes';
import apiRouter from '@/routes/api';

dotenv.config();

const app: Application = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"], // Allows Tailwind CDN script
        styleSrc: ["'self'", "'unsafe-inline'"], // Allows Tailwind's injected inline styles
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);

app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', apiRouter);

// Initialize DB Connection
connectDB();

// '/' ROUTE with good html + tailwind style.
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NYDL API | Operational</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 min-h-screen flex items-center justify-center font-sans text-slate-900">
      <div class="max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
        <div class="inline-block bg-blue-600 text-white font-bold text-sm px-4 py-1 rounded-full mb-6">
          NYDL API v1
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Systems Operational</h1>
        <p class="text-slate-500 mb-8 leading-relaxed">
          The core infrastructure for the NYDEV Learning platform is live. 
          Access the documentation or use the waitlist endpoints to get started.
        </p>
        <div class="flex gap-3 justify-center">
          <a href="/health" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition">
            Check Health
          </a>
          <a href="/api/v1/waitlist" class="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition">
            Waitlist API
          </a>
        </div>
        <p class="mt-10 text-xs text-slate-400">© 2026 NYDEV Learning. All rights reserved.</p>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'NYDL-API' });
});

app.use('/api/v1/waitlist', waitlistRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
