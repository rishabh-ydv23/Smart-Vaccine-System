const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vaccineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine', required: true },
    hospitalId: { type: String, required: true }, // Store hospital identifier
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Store the selected time slot
    status: { type: String, enum: ['pending', 'approved', 'vaccinated', 'completed', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);