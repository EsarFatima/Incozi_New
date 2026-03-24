// backend/infrastructure/database/mongoClient.js
// MongoDB Connection Configuration - Adapter Layer

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_DEV_URI || 'mongodb://localhost:27017/incozi';

const mongoClient = {
  connect: async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected successfully');
      return mongoose.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ MongoDB disconnection failed:', error.message);
      process.exit(1);
    }
  },

  getConnection: () => mongoose.connection,

  isConnected: () => mongoose.connection.readyState === 1,
};

module.exports = mongoClient;
