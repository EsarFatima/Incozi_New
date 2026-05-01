const mongoose = require('mongoose');

async function checkMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/incozi');
    console.log('\n📊 MongoDB Database Status:\n');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`  ✓ ${coll.name}: ${count} documents`);
    }
    
    console.log('\n✅ MongoDB Connection Successful\n');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkMongoDB();
