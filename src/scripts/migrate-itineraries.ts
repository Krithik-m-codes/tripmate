/**
 * One-time migration script to convert legacy text itineraries to structured format.
 *
 * Usage:
 *   npx tsx src/scripts/migrate-itineraries.ts
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Finds all itineraries where `itineraryFormat` is not "structured"
 * 3. Sets `itineraryFormat` to "legacy" for backwards compatibility
 * 4. Does NOT attempt to parse text into structured JSON (that would require AI)
 *    — instead, it just marks them so the app knows to render them as text
 *
 * New itineraries generated after this migration will use the "structured" format.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

async function migrate() {
  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected\n");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("❌ Database connection not available");
    process.exit(1);
  }

  const collection = db.collection("userRecentItinerary");

  // Count total documents
  const totalCount = await collection.countDocuments();
  console.log(`📊 Total itineraries in database: ${totalCount}`);

  // Find documents without itineraryFormat field
  const unmarkedCount = await collection.countDocuments({
    itineraryFormat: { $exists: false },
  });
  console.log(`📝 Itineraries without format marker: ${unmarkedCount}`);

  if (unmarkedCount === 0) {
    console.log("\n✅ All itineraries already have format markers. Nothing to migrate.");
    await mongoose.disconnect();
    return;
  }

  // Mark all existing itineraries as "legacy"
  console.log(`\n🔄 Marking ${unmarkedCount} itineraries as "legacy" format...`);

  const result = await collection.updateMany(
    { itineraryFormat: { $exists: false } },
    { $set: { itineraryFormat: "legacy" } }
  );

  console.log(`✅ Updated ${result.modifiedCount} documents`);

  // Verify
  const legacyCount = await collection.countDocuments({ itineraryFormat: "legacy" });
  const structuredCount = await collection.countDocuments({ itineraryFormat: "structured" });

  console.log(`\n📊 Migration Summary:`);
  console.log(`   Legacy itineraries:     ${legacyCount}`);
  console.log(`   Structured itineraries: ${structuredCount}`);
  console.log(`   Total:                  ${totalCount}`);

  await mongoose.disconnect();
  console.log("\n✅ Migration complete. Disconnected from MongoDB.");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
