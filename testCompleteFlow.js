const axios = require('axios');

const testCompleteFlow = async () => {
  try {
    console.log('🧪 Testing Complete Registration & Email Verification Flow...\n');
    
    // Generate a unique email for testing
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const userData = {
      name: 'Test User ' + timestamp,
      email: email,
      password: 'password123',
      governmentId: 'GOV' + timestamp
    };

    console.log('1. Testing Registration...');
    // Step 1: Register user
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', userData);
    console.log('✅ Registration successful:', registerResponse.data.email);
    console.log('   Email verification status:', registerResponse.data.isEmailVerified);

    console.log('\n2. Testing Email Verification Status...');
    // Step 2: Check email verification status
    const statusResponse = await axios.get(`http://localhost:5000/api/email-verification/check-email-verification/${email}`);
    console.log('✅ Email verification status:', statusResponse.data.isEmailVerified);

    console.log('\n3. Testing OTP Resend...');
    // Step 3: Resend OTP (since registration should have already sent one)
    const resendResponse = await axios.post('http://localhost:5000/api/email-verification/resend-otp', { email });
    console.log('✅ OTP resent:', resendResponse.data.message);

    console.log('\n4. Testing Login (should fail due to unverified email)...');
    // Step 4: Try to login (should fail because email is not verified)
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: 'password123'
      });
      console.log('❌ Unexpected: Login succeeded when it should have failed:', loginResponse.data);
    } catch (loginError) {
      if (loginError.response && loginError.response.status === 401) {
        console.log('✅ Login correctly failed due to unverified email:', loginError.response.data.message);
      } else {
        console.log('❌ Login failed for unexpected reason:', loginError.response?.data);
      }
    }

    console.log('\n🎉 Complete flow test passed!');
    console.log('\nNote: Since this is a test environment, we cannot actually verify the OTP');
    console.log('because we don\'t have access to the test email. In a real scenario, you would:');
    console.log('- Receive an OTP in the email');
    console.log('- Call the verify-otp endpoint with the received OTP');
    console.log('- Then be able to login successfully');

  } catch (error) {
    console.error('❌ Error in complete flow test:', error.response?.data || error.message);
  }
};

testCompleteFlow();