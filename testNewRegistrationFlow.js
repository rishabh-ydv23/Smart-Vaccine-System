const axios = require('axios');

async function testNewRegistrationFlow() {
  console.log('🧪 TESTING NEW REGISTRATION FLOW');
  console.log('='.repeat(40));
  
  const API_BASE = 'http://localhost:5000/api';
  
  // Test user data with unique email
  const testUser = {
    name: 'Test User',
    email: `testuser_${Date.now()}@example.com`,
    password: 'testpassword123',
    governmentId: `TEST${Date.now()}`
  };
  
  try {
    console.log('\n📝 Step 1: Initiate Registration');
    console.log('-'.repeat(30));
    console.log('Using unique email:', testUser.email);
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ Registration initiated successfully');
    console.log('Response:', registerResponse.data);
    
    console.log('\n⏳ Waiting for manual OTP verification...');
    console.log('Please check email for OTP and verify manually');
    console.log('(In real scenario, user would enter OTP in frontend)');
    
    // Simulate OTP verification (you would get this from email)
    const otp = '123456'; // This would be the actual OTP from email
    
    console.log('\n✅ Step 2: Would verify OTP and create account');
    console.log('(This step requires actual OTP from email)');
    
    // In real usage, after getting OTP from email:
    /*
    const verifyResponse = await axios.post(`${API_BASE}/auth/verify-otp`, {
      email: testUser.email,
      otp: receivedOtpFromEmail
    });
    console.log('✅ Account created successfully!');
    console.log('User data:', verifyResponse.data.user);
    */
    
  } catch (error) {
    console.error('❌ Error in registration flow:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('📋 This might be expected if:');
      console.log('- User already exists');
      console.log('- Registration already in progress');
      console.log('- Invalid data provided');
    }
  }
}

testNewRegistrationFlow();