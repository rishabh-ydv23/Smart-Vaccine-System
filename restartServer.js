/**
 * Restart Script for Smart Vaccine System
 * This script will help restart the server with proper error handling
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Restarting Smart Vaccine System...\n');

// Function to kill existing processes on port 5000
function killPortProcess(port) {
  console.log(`📍 Killing process on port ${port}...`);
  
  const command = process.platform === 'win32' 
    ? `netstat -ano | findstr :${port} | findstr LISTENING | awk '{print $5}' | xargs -I {} taskkill /PID {} /F 2>nul`
    : `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null`;
  
  // For Windows, use a more compatible approach
  if (process.platform === 'win32') {
    const netstat = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`]);
    
    let output = '';
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', (code) => {
      if (output) {
        const lines = output.split('\n');
        for (const line of lines) {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1]; // PID is the last column
            if (pid && !isNaN(pid)) {
              console.log(`📍 Killing process ${pid} on port ${port}`);
              const killCmd = spawn('cmd', ['/c', `taskkill /PID ${pid} /F`]);
              killCmd.on('close', (killCode) => {
                if (killCode === 0) {
                  console.log(`✅ Process ${pid} killed successfully`);
                } else {
                  console.log(`ℹ️ Process ${pid} may not have existed or couldn't be killed`);
                }
                startServer();
              });
              return;
            }
          }
        }
        // If no process was found, just start the server
        startServer();
      } else {
        console.log(`ℹ️ No process found on port ${port}, proceeding to start server...`);
        startServer();
      }
    });
  } else {
    // For non-Windows platforms
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`ℹ️ No process found on port ${port} or unable to kill it`);
      } else {
        console.log(`✅ Process(es) on port ${port} killed successfully`);
      }
      startServer();
    });
  }
}

// Function to start the server
function startServer() {
  console.log('\n🚀 Starting the server...');
  
  const serverPath = path.join(__dirname, 'server');
  
  // Change to server directory and start the server
  const serverProcess = spawn('node', ['index.js'], {
    cwd: serverPath,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  serverProcess.on('error', (err) => {
    console.error('❌ Error starting server:', err.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   • Make sure you have installed dependencies: npm install');
    console.log('   • Check that your .env file has correct configuration');
    console.log('   • Verify MongoDB connection string is valid');
  });
  
  serverProcess.on('close', (code) => {
    console.log(`\n🚨 Server process exited with code ${code}`);
    console.log('💡 Restart the server using: cd server && node index.js');
  });
}

// Main execution
console.log('📋 Preparing to restart the Smart Vaccine System...');
console.log('📁 Current directory:', __dirname);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️ Warning: .env file not found in root directory');
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  if (fs.existsSync(serverEnvPath)) {
    console.log('ℹ️ Found .env file in server directory - copying to root...');
    fs.copyFileSync(serverEnvPath, envPath);
    console.log('✅ Copied .env file to root directory');
  } else {
    console.error('❌ Error: No .env file found in server directory either');
    console.log('💡 Please ensure you have a .env file with proper configuration');
    process.exit(1);
  }
}

console.log('✅ Environment check passed');

// Kill existing process and start new one
killPortProcess(5000);

console.log('\n📖 Instructions:');
console.log('   1. Wait for the server to start completely');
console.log('   2. Open your browser and go to http://localhost:5173');
console.log('   3. If you still have authentication issues, clear your browser cache');
console.log('   4. The server should now handle database disconnections gracefully');