import 'tsconfig-paths/register';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from '@/configs/db';
import { globalErrorHandler } from '@/middlewares/errorHandler';
import waitlistRoutes from './modules/waitlist/routes/waitlist.routes';
import apiRouter from '@/routes/api';


dotenv.config();

const app: Application = express();

app.use(cookieParser());

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

// CLIENT_URL is a comma-separated origin whitelist; entries are trimmed so
// "a, b" works. A single "*" entry allows every origin (the request origin is
// reflected back, which keeps credentials working — a literal "*" header
// would not).
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://nydev-learning-v1.vercel.app',
  'https://nydl-admin-v1.vercel.app',
];
const allowedOrigins = (process.env.CLIENT_URL?.split(',').map((o) => o.trim()).filter(Boolean)) || DEFAULT_ORIGINS;
const allowAllOrigins = allowedOrigins.includes('*');

app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    // PATCH is required by the registration review endpoints (approve/reject/…).
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 5mb accommodates base64 QR-code images submitted with fast-track registrations.
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Ensure the DB connection is established before any API request is handled.
// Without this, serverless cold starts race the connection: repositories see
// isMongoConnected === false, silently fall back to the in-memory store, and
// logins fail with 401 "Invalid email or password" for real accounts.
app.use('/api/v1', async (_req, _res, next) => {
  try {
    await connectDB();
  } catch {
    // Proceed anyway — route handlers surface their own DB errors, and the
    // in-memory fallback keeps read-only demo behavior working locally.
  }
  next();
});

app.use('/api/v1', apiRouter);

// Kick off the connection eagerly on boot as well (no-op if already connected).
connectDB().catch(() => { /* logged inside connectDB */ });

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
