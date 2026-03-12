/**
 * Create Admin on Deployed Backend (Render)
 * This script calls your deployed backend API to create admin user
 * 
 * IMPORTANT: Run this AFTER fixing MongoDB Atlas credentials
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Your deployed backend URL
const BACKEND_URL = 'https://smart-vaccine-backend.onrender.com';
const SECRET_KEY = process.env.ADMIN_CREATION_SECRET || 'default-secret-key-change-in-production';

console.log('🚀 Creating admin user on deployed backend...\n');
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log(`🔑 Secret Key: ${SECRET_KEY}\n`);

const url = new URL(`${BACKEND_URL}/create-deployed-admin/${SECRET_KEY}`);
const client = url.protocol === 'https:' ? https : http;

const request = client.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (response) => {
  let data = '';
  
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log('✅ SUCCESS! Admin user created on deployed backend!\n');
        console.log('📧 Email:', jsonData.credentials.email);
        console.log('🔑 Password:', jsonData.credentials.password);
        console.log('👤 Role:', jsonData.credentials.role);
        console.log('\n⚠️  Warning:', jsonData.warning);
        console.log('\n🎉 You can now login at your deployed application!\n');
        console.log('📱 Frontend URL: https://smart-vaccine-system.onrender.com\n');
      } else {
        console.error('\n❌ Failed to create admin user\n');
        console.error('Status:', response.statusCode);
        console.error('Response:', jsonData);
        
        if (response.statusCode === 403) {
          console.error('\n💡 Hint: Invalid secret key');
          console.error('   Make sure ADMIN_CREATION_SECRET matches in Render dashboard');
        } else if (response.statusCode === 500) {
          console.error('\n💡 Hint: Server error - likely MongoDB connection issue');
          console.error('   You need to fix MongoDB Atlas credentials first:');
          console.error('   1. Go to https://cloud.mongodb.com/');
          console.error('   2. Reset password for smartvaccineuser');
          console.error('   3. Update MONGO_URI in Render dashboard');
          console.error('   4. Restart Render service');
        }
      }
    } catch (error) {
      console.error('\n❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

request.on('error', (error) => {
  console.error('\n❌ Network error:', error.message);
  console.error('\n💡 Possible causes:');
  console.error('   - Backend service is sleeping (Render free tier sleeps after 15 min inactivity)');
  console.error('   - Network connectivity issues');
  console.error('   - CORS or firewall blocking');
  console.error('\n💡 Try again in a few seconds, or check your Render dashboard\n');
});

request.end();
