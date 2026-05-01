// scripts/testMongoConnection.js
// Quick test to verify MongoDB connection works

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    const uri = process.env.MONGODB_DEV_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/incozi';
    console.log(`📍 Connecting to: ${uri}`);

    await mongoose.connect(uri);

    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📦 Collections: ${collections.length}`);
    collections.forEach(col => console.log(`  - ${col.name}`));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
