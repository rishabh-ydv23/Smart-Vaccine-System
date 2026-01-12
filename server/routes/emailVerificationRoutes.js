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
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User with this email does not exist' 
      });
    }
    
    // Verify the OTP
    const isValid = await verifyOTP(email, otp);
    
    if (!isValid) {
      return res.status(400).json({ 
        message: 'Invalid or expired OTP' 
      });
    }
    
    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    console.log('✅ Email verified successfully for user:', email);
    
    res.status(200).json({ 
      message: 'Email verified successfully',
      email: email
    });
    
  } catch (err) {
    console.error('❌ Error verifying OTP:', err);
    res.status(500).json({ 
      message: 'Server error while verifying OTP',
      suggestion: 'Please try again later'
    });
  }
});

// Resend OTP endpoint (same as send-otp, but clearer naming for frontend)
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('🔄 Request to resend OTP for email:', email);
    
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
    
    // Check if user exists
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