const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Reference to db connection status
let dbConnected = false;
const setDbStatus = (status) => {
  dbConnected = status;
};
router.setDbStatus = setDbStatus;

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      message: 'Service temporarily unavailable. Database connection error.',
      suggestion: 'Please try again later or contact system administrator.'
    });
  }
  next();
};

// POST /api/auth/register
router.post('/register', checkDbConnection, async (req, res) => {
  try {
    const { name, email, password, governmentId, role } = req.body;
    console.log('Registration attempt for email:', email);

    // Check if user with email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'User with this email already exists' });
    
    // Check if user with government ID already exists
    const govIdExists = await User.findOne({ governmentId });
    if (govIdExists) return res.status(400).json({ message: 'User with this government ID already exists' });

    const user = await User.create({ name, email, password, governmentId, role: role || 'user' });
    console.log('User created successfully:', email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      governmentId: user.governmentId,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'User with this email or government ID already exists' });
    }
    res.status(500).json({ 
      message: 'Server error during registration',
      suggestion: 'Please try again later'
    });
  }
});

// POST /api/auth/login
router.post('/login', checkDbConnection, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      suggestion: 'Please try again later'
    });
  }
});

module.exports = router;