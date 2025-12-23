require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Delete existing admin if it exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@vaccine.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: process.env.ADMIN_EMAIL || 'admin@vaccine.com' });
      console.log('🗑️  Old admin user deleted');
    }

    // Also delete any existing user with the previous email
    const existingNewAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL_NEW || 'admin@smartvaccine.system' });
    if (existingNewAdmin) {
      await User.deleteOne({ email: process.env.ADMIN_EMAIL_NEW || 'admin@smartvaccine.system' });
      console.log('🗑️  Existing user with previous email deleted');
    }

    if (!process.env.ADMIN_EMAIL_TARGET || !process.env.ADMIN_PASSWORD) {
      console.error('❌ Error: ADMIN_EMAIL_TARGET and ADMIN_PASSWORD environment variables must be set');
      console.error('Example: ADMIN_EMAIL_TARGET=your_admin@example.com ADMIN_PASSWORD=your_secure_password node resetAdmin.js');
      process.exit(1);
    }
    
    // Also delete any existing user with the target email
    const existingTargetAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL_TARGET });
    if (existingTargetAdmin) {
      await User.deleteOne({ email: process.env.ADMIN_EMAIL_TARGET });
      console.log('🗑️  Existing user with target email deleted');
    }

    // Create new admin user with requested credentials
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL_TARGET,
      password: process.env.ADMIN_PASSWORD,
      governmentId: process.env.ADMIN_GOV_ID || 'ADMIN001',
      role: 'admin'
    });

    console.log('✅ Admin user reset successfully!');
    console.log('📧 Email:', process.env.ADMIN_EMAIL_TARGET || 'rishabhAdmin@gmail.com');
    console.log('🔑 Password: [Check your .env file for ADMIN_PASSWORD]');
    console.log('\nYou can now login and access /admin route');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

resetAdmin();