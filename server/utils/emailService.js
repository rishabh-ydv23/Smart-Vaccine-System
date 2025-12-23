const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Validate that email credentials are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  Email credentials not set. Email functionality will be disabled.');
  console.warn('Set EMAIL_USER and EMAIL_PASS environment variables to enable email notifications.');
}


const sendReminderEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Reminder sent to', to);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendReminderEmail };
