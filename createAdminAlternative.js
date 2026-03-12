/**
 * Alternative Admin Creation Script with Better Error Handling
 */

const https = require('https');
const { URL } = require('url');

console.log('🚀 Creating admin user (alternative method)...\n');

const url = new URL('https://smart-vaccine-backend.onrender.com/create-deployed-admin/default-secret-key-change-in-production');

const postData = '';

const request = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': 0
  },
  timeout: 30000
}, (response) => {
  let data = '';
  
  console.log(`📊 Response Status: ${response.statusCode}`);
  
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      
      if (response.statusCode === 201) {
        console.log('\n✅ SUCCESS! Admin user created!\n');
        console.log('📧 Email:', jsonData.credentials.email);
        console.log('🔑 Password:', jsonData.credentials.password);
        console.log('👤 Role:', jsonData.credentials.role);
        console.log('\n🎉 Login now at: https://smart-vaccine-system.onrender.com\n');
      } else if (response.statusCode === 200) {
        console.log('\n⚠️  Response:', jsonData.message || 'Admin may already exist');
        console.log('\n📧 Try logging in with:');
        console.log('   Email: admin@deployed.com');
        console.log('   Password: deployedadmin123');
        console.log('\n🌐 Login URL: https://smart-vaccine-system.onrender.com\n');
      } else {
        console.error('\n❌ Failed:', jsonData.message || jsonData.error || 'Unknown error');
        
        if (jsonData.error && jsonData.error.includes('buffering timed out')) {
          console.error('\n💡 Database operation timed out.');
          console.error('   This usually means the database connection is unstable.');
          console.error('   Wait 5 minutes and try again, or check MongoDB Atlas.');
        }
      }
      
      console.log('Raw response:', JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error('\n❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

request.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  console.error('\n💡 The backend might be restarting or unreachable.');
  console.error('   Wait a moment and try again.');
});

request.on('timeout', () => {
  console.error('\n⏱️  Request timed out (30 seconds)');
  console.error('💡 Backend might be processing or sleeping.');
  console.error('   Wait 1 minute and try again.');
  request.destroy();
});

request.end();
