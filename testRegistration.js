const axios = require('axios');

const testRegistration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      governmentId: 'GOV123456789'
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