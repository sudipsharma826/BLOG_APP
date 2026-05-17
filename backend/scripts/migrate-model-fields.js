import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!uri) {
  console.error('Missing MongoDB connection string. Set MONGO_URI, MONGODB_URI, or DATABASE_URL in environment.');
  process.exit(1);
}

async function migrateModels() {
  try {
    await mongoose.connect(uri);
    console.log('✓ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Migration 1: Post Collection
    console.log('Migrating Post collection...');
    const postRenames = {
      category: 'categories',
      postViews: 'views',
      usersLikeList: 'likedByUsers',
      usersCommentList: 'commentedByUsers',
      usersLoveList: 'lovedByUsers',
      usersSaveList: 'savedByUsers'
    };

    for (const [oldField, newField] of Object.entries(postRenames)) {
      try {
        const result = await db.collection('posts').updateMany(
          { [oldField]: { $exists: true } },
          { $rename: { [oldField]: newField } }
        );
        if (result.modifiedCount > 0) {
          console.log(`  ✓ ${oldField} → ${newField}: ${result.modifiedCount} documents`);
        }
      } catch (err) {
        console.log(`  ⚠ ${oldField} → ${newField}: No changes (field may not exist)`);
      }
    }

    // Migration 2: User Collection
    console.log('\nMigrating User collection...');
    const userRenames = {
      isSignIn: 'isSignedIn',
      iNMaintenance: 'isMaintenance'
    };

    for (const [oldField, newField] of Object.entries(userRenames)) {
      try {
        const result = await db.collection('users').updateMany(
          { [oldField]: { $exists: true } },
          { $rename: { [oldField]: newField } }
        );
        if (result.modifiedCount > 0) {
          console.log(`  ✓ ${oldField} → ${newField}: ${result.modifiedCount} documents`);
        }
      } catch (err) {
        console.log(`  ⚠ ${oldField} → ${newField}: No changes (field may not exist)`);
      }
    }

    // Migration 3: Subscribe Collection (rename from 'subscribe' to 'Subscribe')
    console.log('\nMigrating Subscribe collection...');
    const collections = await db.listCollections().toArray();
    const hasOldCollection = collections.some(col => col.name === 'subscribe');

    if (hasOldCollection) {
      try {
        await db.collection('subscribe').rename('Subscribe');
        console.log('  ✓ Renamed collection: subscribe → Subscribe');
      } catch (err) {
        console.log('  ⚠ Could not rename collection (may already exist)');
      }
    } else {
      console.log('  ℹ Old collection "subscribe" not found; skipped');
    }

    await mongoose.disconnect();
    console.log('\n✓ Migration complete. Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateModels();

// .\BLOG_APP\backend; node .\scripts\migrate-model-fields.js