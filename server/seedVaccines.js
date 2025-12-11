require('dotenv').config();
const mongoose = require('mongoose');
const Vaccine = require('./models/Vaccine');

const vaccines = [
  {
    name: 'COVID-19 Vaccine (Pfizer)',
    doseRequired: 2,
    availableQuantity: 100
  },
  {
    name: 'COVID-19 Vaccine (Moderna)',
    doseRequired: 2,
    availableQuantity: 80
  },
  {
    name: 'Hepatitis B Vaccine',
    doseRequired: 3,
    availableQuantity: 50
  },
  {
    name: 'Influenza Vaccine',
    doseRequired: 1,
    availableQuantity: 120
  },
  {
    name: 'MMR Vaccine',
    doseRequired: 2,
    availableQuantity: 60
  },
  {
    name: 'Tetanus Vaccine',
    doseRequired: 1,
    availableQuantity: 90
  }
];

const seedVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing vaccines
    await Vaccine.deleteMany({});
    console.log('🗑️  Cleared existing vaccines');

    // Insert new vaccines
    await Vaccine.insertMany(vaccines);
    console.log('✅ Vaccines added successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedVaccines();
