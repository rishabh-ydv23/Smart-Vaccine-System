/**
 * Complete OTP Registration Flow Test
 * Tests: Register → Send OTP → Verify OTP → User Created
 * 
 * Usage: node testOTPRegistrationFlow.js
 */

const axios = require('axios');
const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

// Test data
const testEmail = `user_${Date.now()}@test.com`;
const testPassword = 'SecurePassword123';
const testName = 'Test User OTP';
const testGovId = `ID_${Date.now()}`;

let generatedOTP = null;

const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Don't throw on any status
});

const log = {
  info: (msg) => console.log(`\n✅ ${msg}`),
  error: (msg) => console.log(`\n❌ ${msg}`),
  step: (msg) => console.log(`\n📋 ${msg}`),
  data: (label, data) => console.log(`   ${label}:`, JSON.stringify(data, null, 2))
};

async function testCompleteFlow() {
  try {
    log.step('Starting OTP Registration Flow Test');
    log.data('Test Email', testEmail);
    log.data('Test Gov ID', testGovId);

    // Step 1: Register User
    log.step('Step 1: Register User (Initiate Registration)');
    const registerRes = await api.post('/auth/register', {
      name: testName,
      email: testEmail,
      password: testPassword,
      governmentId: testGovId,
      role: 'user'
    });

    if (registerRes.status !== 201) {
      log.error(`Registration failed with status ${registerRes.status}`);
      log.data('Response', registerRes.data);
      return;
    }

    log.info('Registration initiated successfully');
    log.data('Response Message', registerRes.data.message);
    log.data('Requires Verification', registerRes.data.requiresVerification);

    if (!registerRes.data.requiresVerification) {
      log.error('Server did not return requiresVerification: true');
      return;
    }

    // Note: In real scenario, OTP is sent to email
    // For testing, we need to extract OTP from database or check logs
    log.step('Step 2: Extract OTP (Check server logs or database)');
    log.info('OTP should have been sent to: ' + testEmail);
    log.info('For testing, check MongoDB TempRegistration collection for OTP value');

    // For automated testing, we can check the database
    const mongoose = require('mongoose');
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaccine-system');
      const TempRegistration = require('./server/models/TempRegistration');
      
      const tempReg = await TempRegistration.findOne({ email: testEmail });
      if (tempReg && tempReg.otp) {
        generatedOTP = tempReg.otp;
        log.info('Found OTP in database: ' + generatedOTP);
      }
      
      await mongoose.disconnect();
    } catch (dbErr) {
      log.error('Could not connect to database to extract OTP: ' + dbErr.message);
      log.step('Manually provide OTP for testing (or check server logs)');
      generatedOTP = '123456'; // Placeholder for manual testing
    }

    // Step 3: Verify OTP
    log.step('Step 3: Verify OTP');
    if (!generatedOTP) {
      log.error('Could not obtain OTP. Skipping verification test.');
      return;
    }

    const verifyRes = await api.post('/email-verification/verify-otp', {
      email: testEmail,
      otp: generatedOTP
    });

    if (verifyRes.status !== 200) {
      log.error(`OTP verification failed with status ${verifyRes.status}`);
      log.data('Response', verifyRes.data);
      return;
    }

    log.info('OTP verified successfully!');
    log.data('User Created', {
      id: verifyRes.data.user._id,
      name: verifyRes.data.user.name,
      email: verifyRes.data.user.email,
      verified: verifyRes.data.user.isEmailVerified
    });

    if (verifyRes.data.token) {
      log.info('User token received (ready for auto-login)');
    }

    // Step 4: Verify User Login Works
    log.step('Step 4: Verify User Can Login');
    const loginRes = await api.post('/auth/login', {
      email: testEmail,
      password: testPassword
    });

    if (loginRes.status !== 200) {
      log.error(`Login failed with status ${loginRes.status}`);
      log.data('Response', loginRes.data);
      return;
    }

    log.info('User login successful!');
    log.data('Login Response', {
      userId: loginRes.data.user._id,
      role: loginRes.data.user.role,
      emailVerified: loginRes.data.isEmailVerified
    });

    // Success
    log.step('✨ COMPLETE OTP REGISTRATION FLOW TEST PASSED ✨');
    log.data('Summary', {
      'Registration': 'Initiated ✓',
      'OTP Generated': 'Yes ✓',
      'OTP Verified': 'Yes ✓',
      'User Created': 'Yes ✓',
      'Email Verified': loginRes.data.isEmailVerified ? 'Yes ✓' : 'No ✗',
      'User Can Login': 'Yes ✓'
    });

  } catch (err) {
    log.error('Test Error: ' + err.message);
    if (err.response) {
      log.data('API Response', err.response.data);
    }
  }
}

// Run the test
testCompleteFlow().then(() => {
  console.log('\n📊 Test completed!');
  process.exit(0);
}).catch(err => {
  log.error('Fatal Error: ' + err.message);
  process.exit(1);
});
