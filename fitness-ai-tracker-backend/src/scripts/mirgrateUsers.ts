import { connectDB } from '../config/db';
import User from '../models/User';
import { readFileSync } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function run() {
  await connectDB();

  /* 1️⃣  always resolve from project root, not __dirname */
  const jsonPath = path.join(process.cwd(), 'data', 'users.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const legacy = JSON.parse(raw);

  let inserted = 0,
    updated = 0;

  for (const l of legacy) {
    /* 2️⃣  ensure passwordHash exists */

    const hash = l.password;
    if (!hash) {
      console.warn(`⚠️  No legacy password for ${l.email}, skipping`);
      continue;
    }

    /* 3️⃣  upsert by email, not _id */
    const res = await User.updateOne(
      { email: l.email.toLowerCase() }, // <-- match on email
      {
        email: l.email.toLowerCase(),
        name: l.name ?? 'unknown',
        passwordHash: hash,
        profile: {
          age: l.profile?.age,
          height: l.profile?.height,
          weight: l.profile?.weight,
          isEnchaned: !!l.profile?.isEnchaned,
          enchancementLog: l.profile?.enchancementLog ?? [],
          createdAt: l.profile?.CreatedAt ?? new Date(),
          legacyId: l.id, // store the old id for reference if you like
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    res.upsertedCount ? inserted++ : updated++;
  }

  console.log(`✅  Migrated: ${inserted} inserted, ${updated} updated`);
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Migration failed:', e);
  process.exit(1);
});
