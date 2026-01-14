const axios = require('axios');

const testRegistration = async () => {
  try {
    // Generate a unique email for testing
    const timestamp = Date.now();
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User ' + timestamp,
      email: `testuser${timestamp}@example.com`,
      password: 'password123',
      governmentId: 'GOV' + timestamp
    });
    
    console.log('Registration successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Registration failed:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testRegistration();