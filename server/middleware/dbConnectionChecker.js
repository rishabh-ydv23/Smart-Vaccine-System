const mongoose = require('mongoose');

let lastCheckTime = 0;
let isDbConnected = false;
const CHECK_INTERVAL = 30000; // 30 seconds

const checkDatabaseConnection = async () => {
  const now = Date.now();
  
  // If we checked recently, return cached result
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return isDbConnected;
  }
  
  try {
    // Update check time
    lastCheckTime = now;
    
    // Check connection state
    const state = mongoose.connection.readyState;
    
    if (state === 1) {
      isDbConnected = true;
      return true;
    } else if (state === 0 || state === 3) {
      // Disconnected or disconnecting - try to reconnect
      console.log('🔄 Attempting to reconnect to database...');
      const connectDB = require('../config/db');
      await connectDB();
      
      // Check again after reconnection attempt
      const newState = mongoose.connection.readyState;
      isDbConnected = (newState === 1);
      return isDbConnected;
    } else {
      // Connecting (state 2) - wait a bit and check again
      await new Promise(resolve => setTimeout(resolve, 1000));
      const finalState = mongoose.connection.readyState;
      isDbConnected = (finalState === 1);
      return isDbConnected;
    }
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    isDbConnected = false;
    return false;
  }
};

const dbConnectionMiddleware = async (req, res, next) => {
  try {
    const isConnected = await checkDatabaseConnection();
    
    if (!isConnected) {
      console.error('Database connection test failed: Database not connected');
      return res.status(503).json({ 
        message: 'Service temporarily unavailable. Database connection error.',
        suggestion: 'Please try again later or contact system administrator.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error.message);
    return res.status(503).json({ 
      message: 'Service temporarily unavailable. Database connection error.',
      suggestion: 'Please try again later or contact system administrator.'
    });
  }
};

module.exports = dbConnectionMiddleware;