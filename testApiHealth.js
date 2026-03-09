/**
 * Test API Health - Checks if the API endpoints are accessible
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

const testApiHealth = async () => {
  console.log('🔍 Testing API Health...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  console.log('\n2. Testing vaccines endpoint (public)...');
  try {
    const vaccinesResponse = await axios.get(`${API_BASE_URL}/api/vaccines`);
    console.log('✅ Vaccines endpoint status:', vaccinesResponse.status);
    console.log('📦 Vaccines count:', vaccinesResponse.data.length || 'N/A');
  } catch (error) {
    console.log('❌ Vaccines endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
  }

  console.log('\n3. Testing appointments/my endpoint (requires auth)...');
  try {
    // This will fail without auth token
    const appointmentsResponse = await axios.get(`${API_BASE_URL}/api/appointments/my`, {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    console.log('✅ Appointments endpoint accessible:', appointmentsResponse.status);
  } catch (error) {
    console.log('Expected - Appointments endpoint failed (needs valid auth):', error.response?.status, error.response?.data?.message || error.message);
  }

  console.log('\n📋 API Health Check Complete');
};

testApiHealth();