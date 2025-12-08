const express = require('express');
const Appointment = require('../models/Appointment');
const Vaccine = require('../models/Vaccine');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/appointments - user books
router.post('/', protect, async (req, res) => {
  try {
    const { vaccineId, date } = req.body;

    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });

    if (vaccine.availableQuantity <= 0) {
      return res.status(400).json({ message: 'Vaccine out of stock' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      vaccineId,
      date,
      status: 'pending'
    });

    // reduce stock immediately (or after approval, depending on your logic)
    vaccine.availableQuantity -= 1;
    await vaccine.save();

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/appointments/my - user history
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('vaccineId', 'name')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/appointments - admin: view all
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .populate('vaccineId', 'name');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/appointments/:id/status - admin change status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // pending/approved/completed/rejected
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
