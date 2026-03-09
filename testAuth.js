const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000';

console.log('Testing authentication endpoints...\n');

// Test login with demo credentials
async function testLogin() {
  try {
    console.log('Testing demo user login...');
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'demo@vaccine.com',
      password: 'demopass'
    });
    console.log('✅ Demo login successful:', response.status);
    console.log('👤 User:', response.data.user.name);
    console.log('🔑 Has token:', !!response.data.token);
  } catch (error) {
    console.log('❌ Demo login failed:', error.response?.status, error.response?.data?.message || error.message);
  }
  
  try {
    console.log('\nTesting demo admin login...');
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'admin@vaccine.com',
      password: 'adminpass'
    });
    console.log('✅ Demo admin login successful:', response.status);
    console.log('👤 User:', response.data.user.name);
    console.log('🔑 Role:', response.data.user.role);
    console.log('🔑 Has token:', !!response.data.token);
  } catch (error) {
    console.log('❌ Demo admin login failed:', error.response?.status, error.response?.data?.message || error.message);
  }
}

testLogin();