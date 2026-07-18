import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/nydl',
  JWT_SECRET: process.env.JWT_SECRET || 'nydev-learning-master-secret-key-2026',
  CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:5173').split(','),

  // Verify.ET Payment Verification (from TrustPay)
  VERIFY_ET_BASE_URL: process.env.VERIFY_ET_BASE_URL || 'https://api.verify.et',
  VERIFY_ET_API_KEY: process.env.VERIFY_ET_API_KEY || '',

  // Email (Brevo SMTP via nodemailer)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SENDER_EMAIL: process.env.SENDER_EMAIL || '',
  // Fallback recipient for admin alerts when no admin users are found in the DB.
  ADMIN_NOTIFY_EMAIL: process.env.ADMIN_NOTIFY_EMAIL || 'nydevofficial@gmail.com',
};
