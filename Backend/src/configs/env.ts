import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/nydl',
  JWT_SECRET: process.env.JWT_SECRET || 'nydev-learning-master-secret-key-2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Verify.ET Payment Verification (from TrustPay)
  VERIFY_ET_BASE_URL: process.env.VERIFY_ET_BASE_URL || 'https://api.verify.et',
  VERIFY_ET_API_KEY: process.env.VERIFY_ET_API_KEY || '',
};
