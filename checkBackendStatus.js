/**
 * Check if MongoDB connection is working on deployed backend
 */

const https = require('https');
const { URL } = require('url');

console.log('🔍 Checking deployed backend status...\n');

// Test 1: Health endpoint
const healthUrl = new URL('https://smart-vaccine-backend.onrender.com/health');

https.get(healthUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      console.log('✅ Backend Health Check:');
      console.log('   Status:', health.status);
      console.log('   DB Connected:', health.dbConnected);
      console.log('   Timestamp:', health.timestamp);
      console.log('');
      
      if (health.dbConnected) {
        console.log('🎉 MongoDB is connected on the backend!\n');
        console.log('💡 Next steps:');
        console.log('   1. Make sure you updated MONGO_URI in Render dashboard');
        console.log('   2. Wait 2-3 minutes for changes to propagate');
        console.log('   3. Try running createAdminOnRender.js again\n');
      } else {
        console.log('❌ MongoDB is NOT connected!');
        console.log('💡 You need to:');
        console.log('   1. Go to https://dashboard.render.com/');
        console.log('   2. Select smart-vaccine-backend');
        console.log('   3. Click "Environment" tab');
        console.log('   4. Edit MONGO_URI with your NEW password');
        console.log('   5. Click "Manual Deploy" → "Clear build cache & deploy"');
        console.log('   6. Wait 2-3 minutes, then try again\n');
      }
    } catch (error) {
      console.error('❌ Error parsing health response:', error.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Network error:', err.message);
  console.error('💡 The backend might be sleeping or unreachable\n');
});
