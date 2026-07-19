/* eslint-disable no-console */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../configs/db';
import { seedCourses } from '../database/seeders/courseSeeder';

async function main() {
  await connectDB();
  const db = mongoose.connection.db!;
  const cohortsColl = db.collection('cohorts');

  console.log('Clearing all existing cohorts...');
  const deleteResult = await cohortsColl.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} cohorts.`);

  console.log('Re-running course and cohort seeders...');
  await seedCourses();

  console.log('Cohort reset complete!');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Reset failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
