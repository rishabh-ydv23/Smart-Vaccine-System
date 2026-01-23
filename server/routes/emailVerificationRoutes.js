const express = require('express');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otpService');
const { sendOTPEmail } = require('../utils/emailService');

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📧 Request to send OTP for email:', email);
    
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User with this email does not exist' 
      });
    }
    
    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        message: 'Email is already verified' 
      });
    }
    
    // Generate and send OTP
    const otp = generateOTP();
    console.log(`Generated OTP for ${email}:`, otp);
    
    const otpDoc = await storeOTP(email, otp);
    
    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      // Clean up the stored OTP if email couldn't be sent
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(500).json({ 
        message: 'Failed to send OTP email. Please try again later.' 
      });
    }
    
    res.status(200).json({ 
      message: 'OTP sent successfully to your email',
      email: email
    });
    
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({ 
      message: 'Server error while sending OTP',
      suggestion: 'Please try again later'
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('🔍 Request to verify OTP for email:', email);
    
    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Email and OTP are required' 
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if there's a temporary registration for this email
    const TempRegistration = require('../models/TempRegistration');
    const tempReg = await TempRegistration.findOne({ email: normalizedEmail });
    
    if (!tempReg) {
      return res.status(404).json({ 
        message: 'No pending registration found for this email. Please register first.' 
      });
    }
    
    // Check if OTP is expired
    if (tempReg.otpExpires < new Date()) {
      await TempRegistration.deleteOne({ _id: tempReg._id });
      console.log('⏰ OTP expired for:', normalizedEmail);
      return res.status(400).json({ 
        message: 'OTP has expired. Please register again.' 
      });
    }
    
    // Verify the OTP (case-sensitive comparison)
    if (tempReg.otp.toString() !== otp.toString()) {
      console.log('❌ Invalid OTP attempt for:', normalizedEmail);
      return res.status(400).json({ 
        message: 'Invalid OTP. Please check and try again.' 
      });
    }
    
    // Check if user already exists (shouldn't happen, but be safe)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await TempRegistration.deleteOne({ _id: tempReg._id });
      console.log('⚠️  User already exists for:', normalizedEmail);
      return res.status(400).json({ 
        message: 'User with this email already exists. Please try logging in.' 
      });
    }
    
    // Create the actual user account
    const user = await User.create({ 
      name: tempReg.name,
      email: normalizedEmail,
      password: tempReg.password,
      governmentId: tempReg.governmentId,
      role: tempReg.role,
      isEmailVerified: true
    });
    
    console.log('✅ User account created successfully for:', normalizedEmail);
    
    // Clean up temporary registration
    await TempRegistration.deleteOne({ _id: tempReg._id });
    
    // Generate JWT token for auto-login after verification
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      message: 'Email verified successfully! Account created.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        governmentId: user.governmentId,
        role: user.role,
        isEmailVerified: true
      },
      token: token
    });
    
  } catch (err) {
    console.error('❌ Error verifying OTP:', err.message);
    
    // Handle specific errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email or government ID already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while verifying OTP',
      suggestion: 'Please try again later'
    });
  }
});

// Resend OTP endpoint (works with temporary registrations)
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('🔄 Request to resend OTP for email:', email);
    
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }
    
    // Check if there's a temporary registration for this email
    const TempRegistration = require('../models/TempRegistration');
    const tempReg = await TempRegistration.findOne({ email });
    
    if (!tempReg) {
      return res.status(404).json({ 
        message: 'No pending registration found for this email' 
      });
    }
    
    // Check if OTP is expired
    if (tempReg.otpExpires < new Date()) {
      await TempRegistration.deleteOne({ _id: tempReg._id });
      return res.status(400).json({ 
        message: 'Registration has expired. Please register again.' 
      });
    }
    
    // Generate new OTP
    const { generateOTP } = require('../utils/otpService');
    const { sendOTPEmail } = require('../utils/emailService');
    
    const newOtp = generateOTP();
    console.log(`Generated new OTP for ${email}:`, newOtp);
    
    // Update temporary registration with new OTP
    tempReg.otp = newOtp;
    tempReg.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await tempReg.save();
    
    // Send new OTP via email
    const emailSent = await sendOTPEmail(email, newOtp);
    
    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send OTP email. Please try again later.' 
      });
    }
    
    res.status(200).json({ 
      message: 'OTP resent successfully to your email',
      email: email
    });
    
  } catch (err) {
    console.error('❌ Error resending OTP:', err);
    res.status(500).json({ 
      message: 'Server error while resending OTP',
      suggestion: 'Please try again later'
    });
  }
});

// GET /api/auth/check-email-verification/:email
router.get('/check-email-verification/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }
    
    // First check if there's a temporary registration (pending verification)
    const TempRegistration = require('../models/TempRegistration');
    const tempReg = await TempRegistration.findOne({ email });
    
    if (tempReg) {
      return res.status(200).json({ 
        email: tempReg.email,
        isEmailVerified: false,
        registrationPending: true,
        message: 'Registration is pending. Please verify your email with the OTP.'
      });
    }
    
    // Check if user exists and is verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User with this email does not exist' 
      });
    }
    
    res.status(200).json({ 
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      userId: user._id
    });
    
  } catch (err) {
    console.error('❌ Error checking email verification status:', err);
    res.status(500).json({ 
      message: 'Server error while checking email verification status',
      suggestion: 'Please try again later'
    });
  }
});

module.exports = router;