const express = require('express');
const DoctorConsultation = require('../models/DoctorConsultation');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/doctor-consultations - user books a consultation
router.post('/', protect, async (req, res) => {
  try {
    const { doctorName, specialization, consultationType, date, time, price } = req.body;

    // Validate required fields
    if (!doctorName || !specialization || !consultationType || !date || !time || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if this time slot is already booked
    const existingConsultation = await DoctorConsultation.findOne({
      doctorName,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed', 'completed'] }
    });

    if (existingConsultation) {
      return res.status(400).json({ 
        message: 'This time slot is already booked. Please select a different time.' 
      });
    }

    const consultation = await DoctorConsultation.create({
      userId: req.user._id,
      doctorName,
      specialization,
      consultationType,
      date: new Date(date),
      time,
      price
    });

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/doctor-consultations/my - user history
router.get('/my', protect, async (req, res) => {
  try {
    const consultations = await DoctorConsultation.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/doctor-consultations - admin: view all
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const consultations = await DoctorConsultation.find()
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/doctor-consultations/:id/status - admin updates status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const consultation = await DoctorConsultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/doctor-consultations/:id - user cancels consultation
router.delete('/:id', protect, async (req, res) => {
  try {
    const consultation = await DoctorConsultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check if user owns this consultation
    if (consultation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow cancellation of pending consultations
    if (consultation.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel confirmed or completed consultations' });
    }

    await DoctorConsultation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Consultation cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;