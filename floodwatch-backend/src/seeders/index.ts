import { connectDB } from '../config/db';
import Admin from '../models/admin.model';

const SEED_ADMIN = {
  username: 'floodwatch_admin',
  email: 'admin@floodwatch.dev',
  password: 'Admin@Pass123',
};

const seed = async () => {
  await connectDB();

  const existing = await Admin.findOne({ email: SEED_ADMIN.email });
  if (existing) {
    console.log('Admin already exists. Skipping seed.');
    process.exit(0);
  }

  await Admin.create(SEED_ADMIN);
  console.log(`Admin seeded: ${SEED_ADMIN.email} / ${SEED_ADMIN.password}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeder error:', err);
  process.exit(1);
});
