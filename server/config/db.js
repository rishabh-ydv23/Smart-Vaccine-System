const mongoose = require("mongoose");

let dbConnected = false;

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect without deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    dbConnected = true;
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("Possible causes:");
    console.log("1. Incorrect MongoDB URI in .env file");
    console.log("2. Network connectivity issues");
    console.log("3. MongoDB Atlas IP whitelist restrictions");
    console.log("4. MongoDB service downtime");
    console.log("⚠️  Running in offline mode - authentication will not work");
    console.log("⚠️  Server will continue running but with limited functionality");
    // Return true to allow the server to start even without DB connection
    dbConnected = false;
    return true;
  }
};

// Function to check if DB is connected
connectDB.isConnected = () => dbConnected;

module.exports = connectDB;