/**
 * Script to create admin user on deployed backend
 * This calls the /create-deployed-admin endpoint with the secret key
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration - Update these if you've changed them in your .env file
const BACKEND_URL = process.env.VITE_API_URL || 'http://localhost:5000';
const SECRET_KEY = process.env.ADMIN_CREATION_SECRET || 'default-secret-key-change-in-production';

async function createDeployedAdmin() {
  try {
    console.log('🚀 Creating deployed admin user...');
    console.log(`📡 Backend URL: ${BACKEND_URL}`);
    
    const url = new URL(`${BACKEND_URL}/create-deployed-admin/${SECRET_KEY}`);
    const client = url.protocol === 'https:' ? https : http;
    
    return new Promise((resolve, reject) => {
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
              console.log('\n✅ SUCCESS! Admin user created!\n');
              console.log('📧 Email:', jsonData.credentials.email);
              console.log('🔑 Password:', jsonData.credentials.password);
              console.log('👤 Role:', jsonData.credentials.role);
              console.log('\n⚠️  Warning:', jsonData.warning);
              console.log('\nYou can now login with these credentials!\n');
              resolve();
            } else {
              console.error('\n❌ Failed to create admin user\n');
              console.error('Status:', response.statusCode);
              console.error('Response:', jsonData);
              
              if (response.statusCode === 403) {
                console.error('\n💡 Hint: Make sure your ADMIN_CREATION_SECRET environment variable is set correctly');
                console.error('Current secret key:', SECRET_KEY);
              }
              resolve();
            }
          } catch (error) {
            console.error('\n❌ Error parsing response:', error.message);
            console.error('Raw response:', data);
            resolve();
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('\n❌ Error creating admin user:', error.message);
        console.error('\n💡 Make sure your backend server is running and accessible');
        resolve();
      });
      
      request.end();
    });
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

createDeployedAdmin();
