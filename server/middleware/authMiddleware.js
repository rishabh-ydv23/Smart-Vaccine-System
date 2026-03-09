const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');

// verify token and attach user
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if DB is connected before attempting to find user
    if (!connectDB.isConnected()) {
      // If DB is not connected, we can't verify the user, so reject the request
      return res.status(503).json({ 
        message: 'Service temporarily unavailable - database connection issue',
        error: 'Database connection failed'
      });
    }
    
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();   // Authentication successful
  } catch (err) {
    console.error('Auth middleware error:', err);
    // Check if it's a database connection error
    if (err.name === 'MongoServerSelectionError' || err.message.includes('ECONNREFUSED') || err.message.includes('failed to connect')) {
      return res.status(503).json({ 
        message: 'Service temporarily unavailable - database connection issue',
        error: 'Database connection failed'
      });
    }
    res.status(401).json({ message: 'Token failed' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access only' });    //User is authenticated
};

module.exports = { protect, adminOnly };
