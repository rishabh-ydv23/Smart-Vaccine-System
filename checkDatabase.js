require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📊 Available collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });

    // Check vaccines collection
    const vaccinesCollection = mongoose.connection.db.collection('vaccines');
    const vaccineCount = await vaccinesCollection.countDocuments();
    console.log(`\n💉 Vaccines collection has ${vaccineCount} documents`);

    if (vaccineCount > 0) {
      const sampleVaccines = await vaccinesCollection.find().limit(3).toArray();
      console.log('\n📋 Sample vaccines:');
      sampleVaccines.forEach((vaccine, index) => {
        console.log(`  ${index + 1}. ${vaccine.name} - Qty: ${vaccine.availableQuantity}`);
      });
    }

    // Check users collection
    const usersCollection = mongoose.connection.db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Users collection has ${userCount} documents`);

    if (userCount > 0) {
      const sampleUsers = await usersCollection.find().limit(3).toArray();
      console.log('\n📋 Sample users:');
      sampleUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} - Role: ${user.role}`);
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

checkDatabase();