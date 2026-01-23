/**
 * Test Analytics Endpoint
 * Verifies vaccine distribution data is returned correctly
 * Usage: node testAnalytics.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAnalytics = async () => {
  try {
    console.log('\n📊 Testing Analytics Endpoint\n');
    console.log('API URL:', API_URL);
    
    // First login as admin
    console.log('\n🔐 Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@vaccine.com',
      password: 'CHANGE_ME_ADMIN_PASSWORD'
    }, {
      validateStatus: () => true
    });

    if (loginResponse.status !== 200) {
      console.error('❌ Login failed:', loginResponse.data);
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Admin logged in successfully');
    console.log('Token:', token.substring(0, 20) + '...');

    // Fetch analytics with token
    console.log('\n📈 Fetching analytics data...');
    const analyticsResponse = await axios.get(`${API_URL}/appointments/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      validateStatus: () => true
    });

    if (analyticsResponse.status !== 200) {
      console.error('❌ Analytics fetch failed:', analyticsResponse.data);
      return;
    }

    const data = analyticsResponse.data;

    console.log('✅ Analytics data received:\n');

    // Display results
    console.log('📊 ANALYTICS SUMMARY:');
    console.log('━'.repeat(50));
    console.log(`📈 Total Users: ${data.totalUsers}`);
    console.log(`📅 Upcoming Appointments: ${data.upcomingAppointments?.length || 0}`);
    console.log(`💉 Total Vaccine Types: ${data.vaccines?.length || 0}`);
    
    const totalAppointments = data.statusCounts?.reduce((sum, s) => sum + s.count, 0) || 0;
    console.log(`📋 Total Appointments: ${totalAppointments}`);

    // Vaccination Distribution
    console.log('\n💉 VACCINATION DISTRIBUTION:');
    console.log('━'.repeat(50));
    if (data.vaccinationStats && data.vaccinationStats.length > 0) {
      console.log('Vaccine | Appointments');
      console.log('--------|---------------');
      data.vaccinationStats.forEach(stat => {
        const bar = '█'.repeat(Math.min(stat.count, 30));
        console.log(`${stat.name.padEnd(8)}| ${stat.count} ${bar}`);
      });
    } else {
      console.log('⚠️  No vaccination data available');
    }

    // Stock Levels
    console.log('\n📦 VACCINE STOCK LEVELS:');
    console.log('━'.repeat(50));
    if (data.vaccines && data.vaccines.length > 0) {
      console.log('Vaccine | Stock | Status');
      console.log('--------|-------|--------');
      data.vaccines.forEach(vaccine => {
        const status = vaccine.availableQuantity > 50 ? '✅ Good' : 
                       vaccine.availableQuantity > 20 ? '⚠️  Low' : 
                       '🔴 Critical';
        console.log(`${vaccine.name.substring(0, 8).padEnd(8)}| ${vaccine.availableQuantity.toString().padEnd(5)} | ${status}`);
      });
    } else {
      console.log('⚠️  No vaccines available');
    }

    // Status Distribution
    console.log('\n📋 APPOINTMENT STATUS DISTRIBUTION:');
    console.log('━'.repeat(50));
    if (data.statusCounts && data.statusCounts.length > 0) {
      console.log('Status | Count');
      console.log('-------|-------');
      data.statusCounts.forEach(status => {
        console.log(`${status._id.padEnd(6)}| ${status.count}`);
      });
    } else {
      console.log('⚠️  No appointment data available');
    }

    // Upcoming Appointments
    console.log('\n📅 UPCOMING APPOINTMENTS (Next 7 Days):');
    console.log('━'.repeat(50));
    if (data.upcomingAppointments && data.upcomingAppointments.length > 0) {
      console.log(`Found ${data.upcomingAppointments.length} upcoming appointments:`);
      data.upcomingAppointments.slice(0, 3).forEach((apt, index) => {
        console.log(`\n${index + 1}. ${apt.userId?.name || 'Unknown'}`);
        console.log(`   📧 Email: ${apt.userId?.email || 'N/A'}`);
        console.log(`   💉 Vaccine: ${apt.vaccineId?.name || 'N/A'}`);
        console.log(`   📅 Date: ${new Date(apt.date).toLocaleString()}`);
        console.log(`   Status: ${apt.status}`);
      });
      if (data.upcomingAppointments.length > 3) {
        console.log(`\n... and ${data.upcomingAppointments.length - 3} more appointments`);
      }
    } else {
      console.log('No upcoming appointments');
    }

    console.log('\n' + '═'.repeat(50));
    console.log('✅ ANALYTICS ENDPOINT TEST PASSED');
    console.log('═'.repeat(50));
    console.log('\nThe vaccine distribution chart should now display correctly in the admin dashboard.');

  } catch (err) {
    console.error('\n❌ Test Error:', err.message);
    if (err.response) {
      console.error('Response:', err.response.data);
    }
  }
};

testAnalytics();
