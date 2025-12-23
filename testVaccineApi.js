const axios = require('axios');

const testVaccineApi = async () => {
  try {
    console.log('Testing vaccine API...');
    
    // Test the vaccines endpoint
    const response = await axios.get('https://smart-vaccine-backend.onrender.com/api/vaccines');
    
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Vaccines count:', response.data.length);
    
    if (response.data.length > 0) {
      console.log('First vaccine:', response.data[0]);
    } else {
      console.log('No vaccines found in the database');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
};

testVaccineApi();