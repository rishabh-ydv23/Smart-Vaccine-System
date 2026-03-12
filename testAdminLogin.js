/**
 * Test if admin already exists
 */

const https = require('https');
const { URL } = require('url');

console.log('🔍 Testing if admin user already exists...\n');

// First try to login with admin credentials
const loginData = JSON.stringify({
  email: 'admin@deployed.com',
  password: 'deployedadmin123'
});

const loginUrl = new URL('https://smart-vaccine-backend.onrender.com/api/auth/login');

const request = https.request(loginUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  },
  timeout: 30000
}, (response) => {
  let data = '';
  
  console.log(`📊 Login Response Status: ${response.statusCode}\n`);
  
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      
      if (response.statusCode === 200) {
        console.log('✅ SUCCESS! Admin user ALREADY EXISTS!\n');
        console.log('🎉 You can login right now with:\n');
        console.log('   Email: admin@deployed.com');
        console.log('   Password: deployedadmin123\n');
        console.log('🌐 Login URL: https://smart-vaccine-system.onrender.com\n');
        console.log('User details:', JSON.stringify(jsonData.user, null, 2));
      } else {
        console.log('❌ Login failed - Admin does not exist yet\n');
        console.log('Response:', jsonData.msg || jsonData.message || 'Unknown error\n');
        console.log('💡 You still need to create the admin user first.\n');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

request.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.error('\n💡 Backend might be unreachable or sleeping\n');
});

request.on('timeout', () => {
  console.error('⏱️  Request timed out after 30 seconds');
  request.destroy();
});

request.write(loginData);
request.end();
