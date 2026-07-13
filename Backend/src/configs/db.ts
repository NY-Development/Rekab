import mongoose from 'mongoose';
import { seedCourses } from '@/database/seeders/courseSeeder';

export let isMongoConnected = false;

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nydl';

  try {
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully');

    try {
      await seedCourses();
    } catch (seedError) {
      console.error('❌ Course seeding error:', seedError);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isMongoConnected = false;
  }

  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
  });
}
