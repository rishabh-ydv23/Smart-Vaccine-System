const axios = require('axios');

const testApiHealth = async () => {
  try {
    console.log('Testing API health...');
    
    // Test basic API endpoint
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('Health check:', healthResponse.data);
    
    // Test main API endpoint
    const mainResponse = await axios.get('http://localhost:5000/');
    console.log('Main endpoint:', mainResponse.data);
    
    console.log('API is running!');
  } catch (error) {
    if (error.response) {
      console.log('API responded with error:', error.response.status, error.response.data);
    } else {
      console.log('API is not accessible:', error.message);
    }
  }
};

testApiHealth();