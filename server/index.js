const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - Configures express.json() for JSON parsing and CORS for cross-origin requests
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5176',
      'http://localhost:5177',
      process.env.CLIENT_URL || 'https://smart-vaccine-system.onrender.com'
    ];
    
    // Check if the origin is in our allowed list or if it's undefined (for server-to-server requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/email-verification', require('./routes/emailVerificationRoutes'));
app.use('/api/vaccines', require('./routes/vaccineRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctor-consultations', require('./routes/doctorConsultationRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    dbConnected: true,
    timestamp: new Date().toISOString()
  });
});

// REMOTE ADMIN CREATION ENDPOINT (FOR DEPLOYED APPLICATION)
// This endpoint can only be accessed with a special secret key
app.post('/create-deployed-admin/:secretKey', async (req, res) => {
  try {
    // Check if the secret key matches
    const { secretKey } = req.params;
    const expectedSecret = process.env.ADMIN_CREATION_SECRET || 'default-secret-key-change-in-production';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ 
        message: 'Forbidden: Invalid secret key',
        hint: 'This endpoint requires a valid secret key for security'
      });
    }
    
    // Import User model dynamically
    const User = require('./models/User');
    
    // Admin user details
    const adminUser = {
      name: 'Deployed Administrator',
      email: process.env.DEPLOYED_ADMIN_EMAIL || 'admin@deployed.com',
      password: process.env.DEPLOYED_ADMIN_PASSWORD || 'deployedadmin123',
      governmentId: process.env.DEPLOYED_ADMIN_GOV_ID || 'DEPLOYEDADMIN001',
      role: 'admin'
    };
    
    console.log('🔧 Creating deployed admin user...');
    
    // Delete existing deployed admin if it exists
    const deleted = await User.deleteOne({ email: adminUser.email });
    if (deleted.deletedCount > 0) {
      console.log('🗑️  Removed existing deployed admin user');
    }
    
    // Create new admin user
    const newUser = await User.create(adminUser);
    console.log('🎉 Deployed admin user created successfully!');
    
    res.status(201).json({
      message: 'Deployed admin user created successfully!',
      credentials: {
        email: newUser.email,
        password: adminUser.password,
        role: newUser.role
      },
      warning: 'These credentials are for testing purposes only. Change them in production.'
    });
    
  } catch (err) {
    console.error('❌ Error creating deployed admin user:', err);
    res.status(500).json({ 
      message: 'Server error during admin creation',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Check server logs'
    });
  }
});

// Serve static files in production (only when frontend is bundled with backend)
// Skip this in Render deployment where frontend is a separate service
const IS_RENDER_DEPLOYMENT = process.env.RENDER;

if (process.env.NODE_ENV === 'production' && !IS_RENDER_DEPLOYMENT) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});