require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

const checkVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    // Get all vaccines
    const vaccines = await Vaccine.find();
    console.log('\n=== Current Vaccines in Database ===');
    vaccines.forEach((vaccine, index) => {
      console.log(`${index + 1}. ${vaccine.name}`);
    });
    console.log(`\nTotal vaccines: ${vaccines.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

checkVaccines();