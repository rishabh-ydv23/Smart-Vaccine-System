const axios = require('axios');

// First, log in as admin to get a token
const loginAsAdmin = async () => {
  try {
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('https://smart-vaccine-backend.onrender.com/api/auth/login', {
      email: 'admin@deployed.com',
      password: 'deployedadmin123' // Use your actual admin password
    });
    
    console.log('✅ Login successful!');
    return loginResponse.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
};

// Add a vaccine using the admin token
const addVaccine = async (token) => {
  if (!token) {
    console.log('No token provided, skipping vaccine addition');
    return;
  }
  
  try {
    console.log('Adding vaccine...');
    const vaccineData = {
      name: 'COVID-19 Vaccine (Pfizer)',
      doseRequired: 2,
      availableQuantity: 100,
      location: {
        type: 'Point',
        coordinates: [77.2088, 28.6139],
        address: '123 Healthcare Ave',
        city: 'New Delhi',
        pinCode: '110001'
      }
    };
    
    const response = await axios.post('https://smart-vaccine-backend.onrender.com/api/vaccines', vaccineData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Vaccine added successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Failed to add vaccine:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status code:', error.response.status);
    }
  }
};

// Run the test
const runTest = async () => {
  const token = await loginAsAdmin();
  await addVaccine(token);
};

runTest();