const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login functionality...');
    
    // Test login endpoint with correct admin credentials
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vaccine.com',
      password: 'CHANGE_ME_ADMIN_PASSWORD'
    });
    
    console.log('Login successful!');
    console.log('Response:', loginResponse.data);
    
  } catch (error) {
    if (error.response) {
      console.log('Login failed with status:', error.response.status);
      console.log('Error message:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
};

testLogin();