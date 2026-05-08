require("dotenv").config();
const mongoose = require("mongoose");
const models = require("../backend/infrastructure/models");
const mongoClient = require("../backend/infrastructure/database/mongoClient");

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    
    console.log("Initializing collections...");
    for (const modelName in models) {
      if (models[modelName].createCollection) {
        await models[modelName].createCollection();
        console.log(`✅ Created collection for: ${modelName}`);
      }
    }
    
    console.log("✨ Database initialization complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during DB initialization:", err);
    process.exit(1);
  }
}

run();