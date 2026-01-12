const crypto = require('crypto');
const OTP = require('../models/OTP');

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Store OTP in database with expiration time
 * @param {string} email - User's email address
 * @param {string} otp - OTP code to store
 * @returns {Promise<Object>} Created OTP document
 */
const storeOTP = async (email, otp) => {
  // Delete any existing OTP for this email
  await OTP.deleteMany({ email });
  
  // Create new OTP with 10-minute expiration
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  const otpDoc = new OTP({
    email,
    otp,
    expiresAt
  });
  
  return await otpDoc.save();
};

/**
 * Verify OTP for given email
 * @param {string} email - User's email address
 * @param {string} otp - OTP code to verify
 * @returns {Promise<boolean>} True if OTP is valid, false otherwise
 */
const verifyOTP = async (email, otp) => {
  const otpDoc = await OTP.findOne({ 
    email, 
    otp,
    expiresAt: { $gt: new Date() }, // Not expired
    verified: false // Not already used
  });
  
  if (otpDoc) {
    // Mark as verified to prevent reuse
    otpDoc.verified = true;
    await otpDoc.save();
    return true;
  }
  
  return false;
};

/**
 * Delete expired OTPs
 * @returns {Promise<number>} Number of deleted OTPs
 */
const cleanupExpiredOTPs = async () => {
  const result = await OTP.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result.deletedCount;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  cleanupExpiredOTPs
};