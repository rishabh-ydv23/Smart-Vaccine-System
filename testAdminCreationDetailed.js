/**
 * Test direct API call to create admin with verbose logging
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🔍 Detailed Admin Creation Test\n');
console.log('=' .repeat(50));

// Configuration
const BACKEND_URL = 'https://smart-vaccine-backend.onrender.com';
const SECRET_KEY = 'default-secret-key-change-in-production';

console.log(`\n📡 Target: ${BACKEND_URL}`);
console.log(`🔑 Secret Key: ${SECRET_KEY}`);
console.log(`📝 Endpoint: /create-deployed-admin/${SECRET_KEY}\n`);

// First, check health
console.log('1️⃣ Checking backend health...\n');

const healthUrl = new URL(`${BACKEND_URL}/health`);

https.get(healthUrl, (res) => {
  let data = '';
  
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      console.log('✅ Health Response:');
      console.log(`   Status: ${health.status}`);
      console.log(`   DB Connected: ${health.dbConnected}`);
      console.log(`   Timestamp: ${health.timestamp}\n`);
      
      if (!health.dbConnected) {
        console.error('❌ MongoDB is NOT connected! Stop here and fix DB connection.\n');
        return;
      }
      
      // Now try to create admin
      console.log('2️⃣ Attempting to create admin user...\n');
      
      const adminUrl = new URL(`${BACKEND_URL}/create-deployed-admin/${SECRET_KEY}`);
      const client = adminUrl.protocol === 'https:' ? https : http;
      
      const startTime = Date.now();
      
      const request = client.request(adminUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }, (response) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('📊 Response Details:');
        console.log(`   Status Code: ${response.statusCode}`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}\n`);
        
        let responseData = '';
        
        response.on('data', (chunk) => {
          responseData += chunk;
        });
        
        response.on('end', () => {
          console.log('📄 Raw Response Body:');
          console.log(responseData);
          console.log('');
          
          try {
            const jsonData = JSON.parse(responseData);
            
            if (response.statusCode === 201) {
              console.log('✅ SUCCESS! Admin created!\n');
              console.log('Credentials:');
              console.log(`   Email: ${jsonData.credentials.email}`);
              console.log(`   Password: ${jsonData.credentials.password}`);
              console.log(`   Role: ${jsonData.credentials.role}\n`);
              console.log('🎉 Login at: https://smart-vaccine-system.onrender.com\n');
            } else if (response.statusCode === 200) {
              console.log('⚠️  Info:', jsonData.message || 'Admin may already exist\n');
            } else {
              console.log('❌ Error Response:');
              console.log(`   Message: ${jsonData.message || 'Unknown error'}`);
              console.log(`   Error: ${jsonData.error || 'None'}\n`);
              
              if (jsonData.error) {
                console.log('💡 This error might indicate:');
                if (jsonData.error.includes('buffering')) {
                  console.log('   - Database operation timeout');
                  console.log('   - Try again in 2-3 minutes\n');
                } else if (jsonData.error.includes('validation')) {
                  console.log('   - Data validation failed');
                  console.log('   - Check environment variables\n');
                } else {
                  console.log('   - Check Render backend logs for details');
                  console.log('   - Visit: https://dashboard.render.com → Logs tab\n');
                }
              }
            }
          } catch (parseError) {
            console.error('❌ Failed to parse JSON response:', parseError.message);
          }
          
          console.log('=' .repeat(50));
          console.log('\n✅ Test complete!\n');
        });
      });
      
      request.on('error', (error) => {
        console.error('❌ Request Error:', error.message);
        console.error('\n💡 Possible causes:');
        console.error('   - Backend service unreachable');
        console.error('   - Network connectivity issues');
        console.error('   - CORS/firewall blocking\n');
      });
      
      request.on('timeout', () => {
        console.error('⏱️  Request timed out after 45 seconds');
        console.error('💡 Backend might be:');
        console.error('   - Processing slowly');
        console.error('   - In sleep mode (free tier)');
        console.error('   - Experiencing database issues\n');
        request.destroy();
      });
      
      request.end();
      
    } catch (error) {
      console.error('❌ Error parsing health response:', error.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Health check failed:', err.message);
});
