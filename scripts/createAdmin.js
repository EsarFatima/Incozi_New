const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../backend/infrastructure/models');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/incozi');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@incozi.com' });
    
    if (admin) {
      console.log('❌ Admin already exists. Updating password...');
    } else {
      console.log('Creating new admin user...');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create or update admin
    admin = await User.findOneAndUpdate(
      { email: 'admin@incozi.com' },
      {
        email: 'admin@incozi.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        verification: { isVerified: true }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin account created/updated successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
