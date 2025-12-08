const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Vaccine = require('../models/Vaccine');
const { sendReminderEmail } = require('../utils/emailService');

const startReminderJob = () => {
  // Run every hour: "0 * * * *"
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running reminder job...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const appointments = await Appointment.find({
        status: 'approved',
        date: { $gte: now, $lte: in24Hours }
      });

      for (const appt of appointments) {
        const user = await User.findById(appt.userId);
        const vaccine = await Vaccine.findById(appt.vaccineId);

        if (!user || !vaccine) continue;

        const text = `Dear ${user.name},

This is a reminder for your vaccine appointment:

Vaccine: ${vaccine.name}
Date: ${appt.date}

Please arrive 10–15 minutes early.

- Smart Vaccine System`;

        await sendReminderEmail(user.email, 'Vaccine Appointment Reminder', text);
      }
    } catch (err) {
      console.error('Reminder job error:', err.message);
    }
  });
};

module.exports = { startReminderJob };
