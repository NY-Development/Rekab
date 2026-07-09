import 'tsconfig-paths/register';
import app from '@/app';

const PORT = process.env.PORT || 3000;

// Only start the server if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`NYDL Server running locally on port ${PORT}`);
  });
}

const server = app.listen(PORT, () => {
  console.log(`NYDL Server running on port ${PORT}`); 
});

// Graceful Shutdown
const shutdown = () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);