const axios = require('axios');

// Test script to verify doctor consultation booking and retrieval
async function testDoctorConsultation() {
  try {
    console.log('Testing Doctor Consultation Booking...');
    
    // First, let's register and login as a user to get a token
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        governmentId: 'TEST123'
      });
      console.log('User registered successfully');
    } catch (error) {
      console.log('User may already exist, proceeding to login');
    }
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('User logged in successfully');
    
    // Book a doctor consultation
    const bookingData = {
      doctorName: 'Dr. Rishabh Yadav',
      specialization: 'General Medicine',
      consultationType: 'Chat',
      date: new Date(),
      time: '10:30',
      price: 500
    };
    
    const bookingResponse = await axios.post(
      'http://localhost:5000/api/doctor-consultations',
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Consultation booked successfully:', bookingResponse.data);
    
    // Now login as admin to check if consultation appears in admin panel
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vaccine.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('Admin logged in successfully');
    
    // Get all consultations as admin
    const consultationsResponse = await axios.get(
      'http://localhost:5000/api/doctor-consultations',
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    
    console.log('Consultations retrieved by admin:');
    console.log(consultationsResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testDoctorConsultation();