const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { normalizeEmail, createEmailQuery, sanitizeEmailForLogging } = require('../utils/emailUtils');

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
const checkDbConnection = async (req, res, next) => {
  try {
    // Test if we can connect to the database
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    next();
  } catch (err) {
    console.error('Database connection test failed:', err.message);
    return res.status(503).json({ 
      message: 'Service temporarily unavailable. Database connection error.',
      suggestion: 'Please try again later or contact system administrator.'
    });
  }
};

// POST /api/auth/register
router.post('/register', checkDbConnection, async (req, res) => {
  try {
    const { name, email, password, governmentId, role } = req.body;
    
    // Normalize and validate email
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        suggestion: 'Please provide a valid email address'
      });
    }
    
    console.log('📥 Registration attempt for email:', sanitizeEmailForLogging(normalizedEmail));

    // Validate required fields
    if (!name || !email || !password || !governmentId) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['name', 'email', 'password', 'governmentId']
      });
    }

    // Check if user with email already exists (case-insensitive)
    try {
      const emailQuery = createEmailQuery(normalizedEmail);
      const emailExists = await User.findOne(emailQuery);
      
      if (emailExists) {
        console.log(`⚠️  Duplicate email attempt: ${sanitizeEmailForLogging(normalizedEmail)} (existing: ${sanitizeEmailForLogging(emailExists.email)})`);
        return res.status(400).json({ 
          message: 'User with this email already exists',
          suggestion: 'Try logging in or use a different email address'
        });
      }
    } catch (queryError) {
      console.error('❌ Email query error:', queryError);
      return res.status(400).json({ 
        message: 'Invalid email format provided',
        suggestion: 'Please check your email address'
      });
    }
    
    // Check if user with government ID already exists
    const govIdExists = await User.findOne({ governmentId });
    if (govIdExists) {
      return res.status(400).json({ message: 'User with this government ID already exists' });
    }

    // Create user with unverified email status (using normalized email)
    const user = await User.create({ 
      name, 
      email: normalizedEmail, 
      password, 
      governmentId, 
      role: role || 'user',
      isEmailVerified: false
    });
    
    console.log('✅ User created successfully:', email);
    
    // Generate and send OTP for email verification
    const OTP = require('../models/OTP');
    const { generateOTP, storeOTP } = require('../utils/otpService');
    const { sendOTPEmail } = require('../utils/emailService');
    
    const otp = generateOTP();
    console.log(`Generated OTP for new user ${sanitizeEmailForLogging(normalizedEmail)}:`, otp);
    
    const otpDoc = await storeOTP(email, otp);
    
    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      console.warn(`Failed to send verification email to ${email}`);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      governmentId: user.governmentId,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      message: emailSent ? 'User registered successfully! Please check your email for verification OTP.' : 'User registered successfully! Email verification is pending.'
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'User with this email or government ID already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
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
    
    // Normalize email for consistent lookup
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        required: ['email', 'password']
      });
    }
    
    console.log('📥 Login attempt for email:', sanitizeEmailForLogging(normalizedEmail));

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        required: ['email', 'password']
      });
    }

    // Find user with case-insensitive email lookup
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });
    
    if (!user) {
      console.log('❌ User not found:', sanitizeEmailForLogging(normalizedEmail));
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User found:', user.email, '- Role:', user.role);
    
    const isMatch = await user.matchPassword(password);
    console.log('🔑 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      });
    }

    const token = generateToken(user._id, user.role);
    console.log('🎉 Token generated for user:', user.email);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      isEmailVerified: user.isEmailVerified,
      token: token
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      suggestion: 'Please try again later'
    });
  }
});

module.exports = router;