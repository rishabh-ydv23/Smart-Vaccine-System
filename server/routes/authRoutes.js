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

// Import the improved database connection checker
const dbConnectionMiddleware = require('../middleware/dbConnectionChecker');

// Use the improved middleware instead of the old checkDbConnection
const checkDbConnection = dbConnectionMiddleware;

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

    // Check if there's already a pending registration for this email
    const TempRegistration = require('../models/TempRegistration');
    const existingTempReg = await TempRegistration.findOne({ email: normalizedEmail });
    if (existingTempReg) {
      return res.status(400).json({ 
        message: 'Registration already in progress for this email. Please verify your OTP.',
        suggestion: 'Check your email for the verification code'
      });
    }

    // Generate OTP for email verification
    const { generateOTP } = require('../utils/otpService');
    const { sendOTPEmail } = require('../utils/emailService');
    
    const otp = generateOTP();
    console.log(`Generated OTP for new registration ${sanitizeEmailForLogging(normalizedEmail)}:`, otp);
    
    // Store temporary registration data
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    const tempReg = await TempRegistration.create({
      name,
      email: normalizedEmail,
      password,
      governmentId,
      role: role || 'user',
      otp,
      otpExpires
    });
    
    console.log('✅ Temporary registration created for:', normalizedEmail);
    
    // Send OTP via email
    const emailSent = await sendOTPEmail(normalizedEmail, otp);
    
    if (!emailSent) {
      // Clean up the temporary registration if email couldn't be sent
      await TempRegistration.deleteOne({ _id: tempReg._id });
      console.warn(`Failed to send verification email to ${normalizedEmail}`);
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again later.'
      });
    }

    res.status(201).json({
      message: 'Registration initiated successfully! Please check your email for verification OTP.',
      email: normalizedEmail,
      requiresVerification: true
    });
  } catch (err) {
    console.error('❌ Registration initiation error:', err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'User with this email or government ID already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ 
      message: 'Server error during registration initiation',
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