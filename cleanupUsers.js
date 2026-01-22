const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const User = require('./server/models/User');

const cleanupDuplicateEmails = async () => {
  try {
    console.log('🔍 Searching for accounts with CHANGE_ME_ADMIN_EMAIL...');
    
    // Find all users with the problematic email (case insensitive)
    const users = await User.find({
      email: { $regex: new RegExp('^CHANGE_ME_ADMIN_EMAIL$', 'i') }
    });
    
    console.log('📊 Found users:', users.length);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. User: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Role: ${user.role}`);
        console.log('---');
      });
      
      // Delete all matching users
      const result = await User.deleteMany({
        email: { $regex: new RegExp('^CHANGE_ME_ADMIN_EMAIL$', 'i') }
      });
      
      console.log(`🗑️  Deleted ${result.deletedCount} user(s) successfully!`);
      console.log('✅ You should now be able to register with this email.');
    } else {
      console.log('ℹ️  No accounts found with that email address.');
      console.log('📊 Showing all current users:');
      
      // Show all users for reference
      const allUsers = await User.find({}, { email: 1, name: 1, _id: 1, role: 1 });
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    setTimeout(() => {
      mongoose.connection.close();
      console.log('🔌 Database connection closed.');
    }, 1000);
  }
};

cleanupDuplicateEmails();