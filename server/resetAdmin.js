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

    // Also delete any existing user with the previous email
    const existingNewAdmin = await User.findOne({ email: 'admin@smartvaccine.system' });
    if (existingNewAdmin) {
      await User.deleteOne({ email: 'admin@smartvaccine.system' });
      console.log('🗑️  Existing user with previous email deleted');
    }

    // Also delete any existing user with the target email
    const existingTargetAdmin = await User.findOne({ email: 'rishabhAdmin@gmail.com' });
    if (existingTargetAdmin) {
      await User.deleteOne({ email: 'rishabhAdmin@gmail.com' });
      console.log('🗑️  Existing user with target email deleted');
    }

    // Create new admin user with requested credentials
    const admin = await User.create({
      name: 'Rishabh Admin',
      email: 'rishabhAdmin@gmail.com',
      password: 'CHANGE_ME_ADMIN_PASSWORD',
      governmentId: 'ADMIN001',
      role: 'admin'
    });

    console.log('✅ Admin user reset successfully!');
    console.log('📧 Email: rishabhAdmin@gmail.com');
    console.log('🔑 Password: CHANGE_ME_ADMIN_PASSWORD');
    console.log('\nYou can now login and access /admin route');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

resetAdmin();