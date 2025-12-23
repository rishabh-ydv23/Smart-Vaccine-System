const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Error code:', err.code);
    console.error('Error name:', err.name);
  }
};

// Load environment variables
require('dotenv').config({ path: './server/.env' });
testConnection();