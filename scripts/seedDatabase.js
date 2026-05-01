const mongoose = require('mongoose');
const { Service, Consultation, User } = require('../backend/infrastructure/models');

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/incozi');
    console.log('\n🌱 Starting Database Seed...\n');

    // Create a consultant user if not exists
    let consultant = await User.findOne({ email: 'consultant@incozi.com' });
    if (!consultant) {
      consultant = await User.create({
        email: 'consultant@incozi.com',
        firstName: 'Admin',
        lastName: 'Consultant',
        role: 'admin',
        password: 'hashed_password_placeholder',
        verification: { isVerified: true }
      });
      console.log('✅ Created consultant user');
    }

    // Create services
    const services = [
      {
        name: 'Business Incorporation',
        description: 'Get your business legally registered and incorporated',
        consultant: consultant._id,
        pricing: { basePrice: 5000, currency: 'PKR', priceUnit: 'one-time' },
        duration: 300, // 5 hours in minutes
        category: 'incorporation',
        status: 'active'
      },
      {
        name: 'Tax Compliance',
        description: 'Expert guidance on tax planning and compliance',
        consultant: consultant._id,
        pricing: { basePrice: 3000, currency: 'PKR', priceUnit: 'one-time' },
        duration: 240, // 4 hours
        category: 'tax-compliance',
        status: 'active'
      },
      {
        name: 'Bookkeeping Services',
        description: 'Professional bookkeeping and accounting services',
        consultant: consultant._id,
        pricing: { basePrice: 2500, currency: 'PKR', priceUnit: 'monthly' },
        duration: 180, // 3 hours
        category: 'bookkeeping',
        status: 'active'
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);

    console.log('\n📊 Database Summary:');
    const serviceCount = await Service.countDocuments();
    const consultationCount = await Consultation.countDocuments();
    const userCount = await User.countDocuments();

    console.log(`  • Users: ${userCount}`);
    console.log(`  • Services: ${serviceCount}`);
    console.log(`  • Consultation Slots: ${consultationCount}`);

    console.log('\n✅ Seed Complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
