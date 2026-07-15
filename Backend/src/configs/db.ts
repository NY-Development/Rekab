import mongoose from 'mongoose';
import { seedCourses } from '@/database/seeders/courseSeeder';

export let isMongoConnected = false;

// Cached across invocations so serverless cold starts reuse one connection
// attempt instead of racing multiple mongoose.connect() calls.
let connectionPromise: Promise<void> | null = null;
let listenersAttached = false;

async function establishConnection(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nydl';

  if (!listenersAttached) {
    listenersAttached = true;
    mongoose.connection.on('connected', () => {
      isMongoConnected = true;
    });
    mongoose.connection.on('disconnected', () => {
      isMongoConnected = false;
      console.warn('⚠️ MongoDB disconnected');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });
  }

  await mongoose.connect(mongoUri);
  isMongoConnected = true;
  console.log('✅ MongoDB connected successfully');

  try {
    await seedCourses();
  } catch (seedError) {
    console.error('❌ Course seeding error:', seedError);
  }
}

/**
 * Connects to MongoDB exactly once; concurrent/subsequent calls share the
 * same promise. On failure the cache is cleared so the next request retries
 * instead of being stuck with a rejected promise forever.
 */
export function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return Promise.resolve();
  }
  if (!connectionPromise) {
    connectionPromise = establishConnection().catch((error) => {
      connectionPromise = null;
      isMongoConnected = false;
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }
  return connectionPromise;
}
