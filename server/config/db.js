const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Running in offline mode - authentication will not work");
    return false;
  }
};

module.exports = connectDB;
