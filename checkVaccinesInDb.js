require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

const checkVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    // Count vaccines
    const count = await Vaccine.countDocuments();
    console.log(`Total vaccines in database: ${count}`);
    
    // Get all vaccines
    const vaccines = await Vaccine.find();
    console.log('Vaccines:');
    console.log(JSON.stringify(vaccines, null, 2));
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

checkVaccines();