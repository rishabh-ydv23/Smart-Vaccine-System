require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

const checkAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check users collection for admin
    const usersCollection = mongoose.connection.db.collection('users');
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();
    
    console.log(`\n🛡️ Found ${adminUsers.length} admin users:`);
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - ${user.name}`);
    });

    // If no admin users found, check all users
    if (adminUsers.length === 0) {
      console.log('\n📋 All users:');
      const allUsers = await usersCollection.find().toArray();
      allUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} - Role: ${user.role} - ${user.name || 'No name'}`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
};

checkAdminUser();