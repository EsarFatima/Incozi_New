// backend/infrastructure/database/mongoClient.js
// MongoDB Connection Configuration - Adapter Layer

require('dotenv').config();
const mongoose = require('mongoose');

// In production (Render), always use MONGODB_URI. In development, prefer DEV_URI.
const MONGODB_URI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI 
  : (process.env.MONGODB_DEV_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/incozi');

const mongoClient = {
  connect: async () => {
    try {
      // Set a timeout for the connection attempt
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connected successfully');
      return mongoose.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('⚠️ Continuing without MongoDB (Limited functionality)...');
      // Return a dummy connection object or null to prevent crash
      return null;
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
