import { connectDB } from "../src/config/db";
import User from "../src/models/User";
import { readFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

async function run() {
  await connectDB();

  const jsonPath = path.join(__dirname, "..", "data", "users.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const legacy = JSON.parse(raw);

  let inserted = 0, updated = 0;

  for (const l of legacy) {
    // ensure passwordHash field exists (hash plain-text if needed)
    const hash =
      l.passwordHash ??
      (l.password ? await bcrypt.hash(l.password, 10) : undefined);

    const res = await User.updateOne(
      { _id: l.id },                // reuse old id for continuity
      {
        email: l.email.toLowerCase(),
        name: l.name ?? "unknown",
        passwordHash: hash,
        profile: {
          age: l.profile?.age,
          height: l.profile?.height,
          weight: l.profile?.weight,
          isEnchaned: !!l.profile?.isEnchaned,
          enchancementLog: l.profile?.enchancementLog ?? [],
          createdAt: l.profile?.CreatedAt ?? new Date(),
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    res.upsertedCount ? inserted++ : updated++;
  }

  console.log(`  Migrated: ${inserted} inserted, ${updated} updated`);
  process.exit(0);
}

run().catch((e) => {
  console.error(" Migration failed:", e);
  process.exit(1);
});
