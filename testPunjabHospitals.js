const axios = require('axios');

const testPunjabHospitals = async () => {
  try {
    console.log('Testing search for Punjab hospitals...');
    
    // Test search by city
    console.log('\n1. Searching for hospitals in Amritsar...');
    const amritsarResponse = await axios.get('http://localhost:5000/api/vaccines/search?city=Amritsar');
    console.log('Found', amritsarResponse.data.length, 'hospital(s) in Amritsar');
    if (amritsarResponse.data.length > 0) {
      console.log('Hospital:', amritsarResponse.data[0].name);
    }
    
    console.log('\n2. Searching for hospitals in Ludhiana...');
    const ludhianaResponse = await axios.get('http://localhost:5000/api/vaccines/search?city=Ludhiana');
    console.log('Found', ludhianaResponse.data.length, 'hospital(s) in Ludhiana');
    if (ludhianaResponse.data.length > 0) {
      console.log('Hospital:', ludhianaResponse.data[0].name);
    }
    
    console.log('\n3. Searching for hospitals in Patiala...');
    const patialaResponse = await axios.get('http://localhost:5000/api/vaccines/search?city=Patiala');
    console.log('Found', patialaResponse.data.length, 'hospital(s) in Patiala');
    if (patialaResponse.data.length > 0) {
      console.log('Hospital:', patialaResponse.data[0].name);
    }
    
    console.log('\n4. Searching for hospitals near Punjab (coordinates)...');
    // Coordinates near Amritsar, Punjab
    const nearbyResponse = await axios.get('http://localhost:5000/api/vaccines/nearby?lat=30.9010&lng=75.8572&radius=50');
    console.log('Found', nearbyResponse.data.length, 'hospital(s) near Amritsar (50km radius)');
    
    console.log('\n5. Searching for all hospitals...');
    const allResponse = await axios.get('http://localhost:5000/api/vaccines');
    console.log('Total hospitals in database:', allResponse.data.length);
    
  } catch (error) {
    if (error.response) {
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testPunjabHospitals();