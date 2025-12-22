const mongoose = require('mongoose');

const doctorConsultationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    specialization: { type: String, required: true },
    consultationType: { type: String, enum: ['Chat', 'Video'], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DoctorConsultation', doctorConsultationSchema);