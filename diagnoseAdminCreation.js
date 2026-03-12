/**
 * Test all possible issues with admin creation
 */

const https = require('https');
const { URL } = require('url');

console.log('🔬 Comprehensive Admin Creation Diagnostic\n');
console.log('=' .repeat(60));

const tests = [
  { name: 'Health Check', url: 'https://smart-vaccine-backend.onrender.com/health', method: 'GET' },
  { name: 'Endpoint Exists (404 test)', url: 'https://smart-vaccine-backend.onrender.com/create-deployed-admin/test', method: 'POST' },
];

let testIndex = 0;

function runNextTest() {
  if (testIndex >= tests.length) {
    console.log('\n✅ All tests complete!\n');
    console.log('=' .repeat(60));
    console.log('\n📋 Summary & Recommendations:\n');
    console.log('If health check passes but admin creation fails:');
    console.log('1. Check if ADMIN_CREATION_SECRET env var is set in Render');
    console.log('2. Verify MONGO_URI has correct new password');
    console.log('3. Check that DEPLOYED_ADMIN_EMAIL and DEPLOYED_ADMIN_PASSWORD are set');
    console.log('4. View backend logs at: https://dashboard.render.com → Logs tab\n');
    return;
  }
  
  const test = tests[testIndex++];
  console.log(`\n${testIndex}. ${test.name}`);
  console.log('-'.repeat(60));
  console.log(`   Method: ${test.method}`);
  console.log(`   URL: ${test.url}\n`);
  
  const url = new URL(test.url);
  const client = url.protocol === 'https:' ? https : http;
  
  const request = client.request(url, {
    method: test.method,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  }, (response) => {
    let data = '';
    
    response.on('data', chunk => data += chunk);
    
    response.on('end', () => {
      console.log(`   Status: ${response.statusCode}`);
      
      try {
        const jsonData = JSON.parse(data);
        
        if (test.name.includes('Health')) {
          console.log('   ✅ Response:', JSON.stringify(jsonData, null, 2));
          if (jsonData.dbConnected) {
            console.log('   🎉 MongoDB is connected!');
          } else {
            console.log('   ❌ MongoDB NOT connected!');
          }
        } else {
          console.log('   Response:', JSON.stringify(jsonData, null, 2));
        }
      } catch (e) {
        console.log('   Raw response:', data.substring(0, 200));
      }
      
      console.log('');
      runNextTest();
    });
  });
  
  request.on('error', (error) => {
    console.log('   ❌ Error:', error.message);
    console.log('');
    runNextTest();
  });
  
  request.on('timeout', () => {
    console.log('   ⏱️  Timeout after 30s');
    console.log('');
    request.destroy();
    runNextTest();
  });
  
  request.end();
}

runNextTest();
