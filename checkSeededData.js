require('dotenv').config();
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    
    const vaccines = await Vaccine.find({}, 'name ageGroup doses description');
    
    console.log(`\nFound ${vaccines.length} vaccines:`);
    console.log('=' .repeat(50));
    
    vaccines.forEach((vaccine, index) => {
        console.log(`${index + 1}. ${vaccine.name}`);
        console.log(`   Age Group: ${vaccine.ageGroup || 'Not specified'}`);
        console.log(`   Doses: ${vaccine.doses || 'Not specified'}`);
        console.log(`   Description: ${vaccine.description?.substring(0, 50)}...`);
        console.log('');
    });
    
    // Check for specific vaccines
    const bcgVaccine = vaccines.find(v => v.name.toLowerCase().includes('bcg'));
    const pentavalentVaccine = vaccines.find(v => v.name.toLowerCase().includes('pentavalent'));
    
    console.log('SPECIFIC VACCINE CHECK:');
    console.log('='.repeat(30));
    console.log(`BCG Vaccine: ${bcgVaccine ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`Pentavalent Vaccine: ${pentavalentVaccine ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});