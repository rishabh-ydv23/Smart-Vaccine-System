const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login with admin credentials...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vaccine.com',
      password: 'rishabhVaccine12'
    });
    
    console.log('✅ Login SUCCESS!');
    console.log('Response:', response.data);
    console.log('\nToken:', response.data.token);
  } catch (error) {
    console.log('❌ Login FAILED!');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Error:', error.message);
    if (error.response?.data) {
      console.log('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testLogin();
