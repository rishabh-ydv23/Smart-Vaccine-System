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

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Email Verification OTP - Smart Vaccine System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with Smart Vaccine System. Please use the following OTP to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #3498db; color: white; font-size: 24px; padding: 15px 30px; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>
        <p><strong>Note:</strong> This OTP is valid for 10 minutes only.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p>Best regards,<br>Smart Vaccine System Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 OTP sent to', to);
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
};

module.exports = { sendReminderEmail, sendOTPEmail };
