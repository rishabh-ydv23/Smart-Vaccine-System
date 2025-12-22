require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Delete existing admin if it exists
    const existingAdmin = await User.findOne({ email: 'admin@vaccine.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: 'admin@vaccine.com' });
      console.log('🗑️  Old admin user deleted');
    }

    // Also delete any existing user with the new email
    const existingNewAdmin = await User.findOne({ email: 'rishabh@admin@gmail.com' });
    if (existingNewAdmin) {
      await User.deleteOne({ email: 'rishabh@admin@gmail.com' });
      console.log('🗑️  Existing user with new email deleted');
    }

    // Create new admin user
    const admin = await User.create({
      name: 'Rishabh',
      email: 'rishabhAdmin@gmail.com',
      password: 'rishabhProject',
      governmentId: 'ADMIN001',
      role: 'admin'
    });

    console.log('✅ Admin user reset successfully!');
    console.log('📧 Email: rishabhAdmin@gmail.com');
    console.log('🔑 Password: [Check script for password]');
    console.log('\nYou can now login and access /admin route');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

resetAdmin();