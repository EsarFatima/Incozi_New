const mongoose = require('mongoose');
const { User } = require('../backend/infrastructure/models');

async function showData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/incozi');
    
    console.log('\n📋 Users Collection Details:\n');
    const users = await User.find().limit(5);
    
    users.forEach((user, i) => {
      console.log(`User ${i+1}:`);
      console.log(`  ✓ Email: ${user.email}`);
      console.log(`  ✓ Name: ${user.firstName} ${user.lastName}`);
      console.log(`  ✓ Role: ${user.role}`);
      console.log(`  ✓ Verified: ${user.verification?.isVerified || false}`);
      console.log(`  ✓ Created: ${user.createdAt}`);
      console.log();
    });
    
    console.log('\n✅ All Collections Status:\n');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      const status = count > 0 ? '📊' : '⭕';
      console.log(`  ${status} ${coll.name}: ${count} documents`);
    }
    
    console.log('\n✅ MongoDB Data Verification Complete\n');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

showData();
