const axios = require('axios');

const testUserLogin = async () => {
  try {
    console.log('Testing user login functionality...');
    
    // First register a new user
    console.log('Registering new user...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword123',
      governmentId: 'TEST123456789'
    });
    
    console.log('Registration successful!');
    console.log('User created:', registerResponse.data.user);
    
    // Now login as the user
    console.log('Logging in as user...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testuser@example.com',
      password: 'testpassword123'
    });
    
    console.log('User login successful!');
    console.log('Response:', loginResponse.data);
    
  } catch (error) {
    if (error.response) {
      console.log('Request failed with status:', error.response.status);
      console.log('Error message:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
};

testUserLogin();