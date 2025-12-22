const axios = require('axios');

const testNearbySearch = async () => {
  try {
    // Test nearby search with coordinates
    console.log('Testing nearby search with coordinates...');
    const nearbyResponse = await axios.get('http://localhost:5000/api/vaccines/nearby?lat=28.6139&lng=77.2088&radius=20');
    console.log('Nearby search results:', nearbyResponse.data.length, 'centers found');
    
    // Test search by city
    console.log('\nTesting search by city...');
    const cityResponse = await axios.get('http://localhost:5000/api/vaccines/search?city=New Delhi');
    console.log('City search results:', cityResponse.data.length, 'centers found');
    
    // Test search by PIN code
    console.log('\nTesting search by PIN code...');
    const pinResponse = await axios.get('http://localhost:5000/api/vaccines/search?pinCode=110001');
    console.log('PIN code search results:', pinResponse.data.length, 'centers found');
    
  } catch (error) {
    if (error.response) {
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testNearbySearch();