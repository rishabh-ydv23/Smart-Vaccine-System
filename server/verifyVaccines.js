require('dotenv').config();
const mongoose = require('mongoose');
const Vaccine = require('./models/Vaccine');

const verifyVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Count vaccines
    const count = await Vaccine.countDocuments();
    console.log(`Total vaccines in database: ${count}`);

    if (count > 0) {
      // Get sample vaccines
      const vaccines = await Vaccine.find().limit(5);
      console.log('\nSample vaccines:');
      vaccines.forEach((vaccine, index) => {
        console.log(`${index + 1}. ${vaccine.name} - Qty: ${vaccine.availableQuantity}`);
      });
    } else {
      console.log('No vaccines found in database');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    mongoose.connection.close();
  }
};

verifyVaccines();