const express = require('express');
const Appointment = require('../models/Appointment');
const Vaccine = require('../models/Vaccine');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/appointments - user books
router.post('/', protect, async (req, res) => {
  try {
    const { vaccineId, hospitalId, date, time } = req.body;

    // Validate required fields
    if (!vaccineId || !hospitalId || !date || !time) {
      return res.status(400).json({ message: 'Vaccine, hospital, date, and time are required' });
    }

    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });

    if (vaccine.availableQuantity <= 0) {
      return res.status(400).json({ message: 'Vaccine out of stock' });
    }

    // Combine date and time for appointment
    const appointmentDateStr = date instanceof Date ? date.toISOString().split('T')[0] : new Date(date).toISOString().split('T')[0];
    const appointmentDateTime = new Date(`${appointmentDateStr}T${time}:00`);
    
    // For 30-minute slots, we need to check if any appointment exists in the same 30-minute window at the same hospital
    const slotStart = new Date(appointmentDateTime);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000); // 30 minutes later

    // Check if this time slot is already booked at the same hospital for the same vaccine
    const existingAppointment = await Appointment.findOne({
      vaccineId,
      hospitalId,
      date: {
        $gte: slotStart,
        $lt: slotEnd
      },
      status: { $in: ['pending', 'approved', 'completed'] } // Don't count rejected appointments
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This time slot is already booked by another user at this hospital. Please select a different time.' 
      });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      vaccineId,
      hospitalId,
      date: appointmentDateTime,
      time,
      status: 'pending'
    });

    // reduce stock immediately (or after approval, depending on your logic)
    vaccine.availableQuantity -= 1;
    await vaccine.save();

    // Return the created appointment with populated vaccine name for client convenience
    const populatedAppointment = await Appointment.findById(appointment._id).populate('vaccineId', 'name');
    res.status(201).json(populatedAppointment);
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
      .populate('vaccineId', 'name')
      .sort({ date: -1 });
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

// GET /api/appointments/analytics - admin analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get upcoming appointments (all future appointments)
    const currentDate = new Date();
    
    const upcomingAppointments = await Appointment.find({
      date: { $gte: currentDate },
      status: { $in: ['pending', 'approved'] }
    }).populate('userId', 'name email').populate('vaccineId', 'name');
    
    // Get vaccination distribution (all appointments grouped by vaccine - comprehensive view)
    // This shows the distribution of all bookings across vaccines
    const vaccinationStats = await Appointment.aggregate([
      { $match: { vaccineId: { $ne: null } } }, // Only include appointments with a vaccine
      { 
        $group: { 
          _id: '$vaccineId', 
          count: { $sum: 1 } 
        } 
      },
      { $lookup: { from: 'vaccines', localField: '_id', foreignField: '_id', as: 'vaccine' } },
      { $unwind: '$vaccine' },
      { $project: { 
        name: '$vaccine.name', 
        count: 1,
        _id: 0
      } },
      { $sort: { count: -1 } }
    ]);
    
    // If no vaccination stats or all are null, get all vaccines with their appointment counts
    let finalVaccinationStats = vaccinationStats && vaccinationStats.length > 0 ? vaccinationStats : null;
    
    if (!finalVaccinationStats || finalVaccinationStats.length === 0) {
      // Get count of appointments for each vaccine
      const vaccineAppointmentCounts = await Appointment.aggregate([
        { $match: { vaccineId: { $ne: null } } },
        { $group: { _id: '$vaccineId', count: { $sum: 1 } } }
      ]);
      
      // Create a map for quick lookup
      const countMap = {};
      vaccineAppointmentCounts.forEach(item => {
        countMap[item._id.toString()] = item.count;
      });
      
      // Get all vaccines and merge with appointment counts
      const allVaccines = await Vaccine.find({}, 'name _id');
      finalVaccinationStats = allVaccines.map(vaccine => ({
        name: vaccine.name,
        count: countMap[vaccine._id.toString()] || 0
      })).filter(v => v.count > 0) // Only show vaccines with appointments
        .sort((a, b) => b.count - a.count); // Sort by count descending
      
      // If still empty, show all vaccines with 0 count
      if (finalVaccinationStats.length === 0) {
        finalVaccinationStats = allVaccines.map(vaccine => ({
          name: vaccine.name,
          count: 0
        }));
      }
    }
    
    // Get stock levels
    const vaccines = await Vaccine.find({}, 'name availableQuantity');
    
    // Get appointments by status
    const statusCounts = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Ensure all status types are represented in the response
    const defaultStatuses = ['pending', 'approved', 'vaccinated', 'completed', 'rejected'];
    const completeStatusCounts = defaultStatuses.map(status => {
      const found = statusCounts.find(s => s._id === status);
      return {
        _id: status,
        count: found ? found.count : 0
      };
    }).filter(s => s.count > 0 || ['pending', 'approved', 'vaccinated'].includes(s._id)); // Show at least these common statuses
    
    console.log('📊 Analytics Data:');
    console.log('   Total Users:', totalUsers);
    console.log('   Upcoming Appointments:', upcomingAppointments.length);
    console.log('   Vaccination Stats:', finalVaccinationStats);
    console.log('   Vaccines Count:', vaccines.length);
    console.log('   Status Counts:', completeStatusCounts);
    
    res.json({
      totalUsers,
      upcomingAppointments,
      vaccinationStats: finalVaccinationStats,
      vaccines,
      statusCounts: completeStatusCounts
    });
  } catch (err) {
    console.error('❌ Analytics Error:', err);
    res.status(500).json({ 
      message: 'Server error while fetching analytics',
      error: err.message 
    });
  }
});

module.exports = router;
