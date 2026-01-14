const nodemailer = require('nodemailer');

// Load environment variables
require('dotenv').config({ path: './server/.env' });

// Create transporter with the same configuration as in emailService.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email delivery function
const testEmailDelivery = async () => {
  console.log('📧 Testing Email Delivery Functionality...\n');
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER) {
    console.error('❌ EMAIL_USER environment variable is not set');
    return;
  }
  
  if (!process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_PASS environment variable is not set');
    return;
  }
  
  console.log(`✅ EMAIL_USER is set: ${process.env.EMAIL_USER}`);
  console.log('✅ EMAIL_PASS is set (value hidden for security)\n');
  
  // Test email recipient (use your own email for testing)
  const testRecipient = process.env.TEST_EMAIL || 'test@example.com';
  console.log(`📤 Attempting to send test email to: ${testRecipient}\n`);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: testRecipient,
    subject: 'Test Email - Smart Vaccine System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Email Delivery Test</h2>
        <p>Hello,</p>
        <p>This is a test email to verify that the email delivery system is working properly.</p>
        <p>If you received this email, your email configuration is correct!</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Environment Variables Check:</strong><br>
          EMAIL_USER: ${process.env.EMAIL_USER}<br>
          Server Time: ${new Date().toISOString()}
        </div>
        <p>Best regards,<br>Smart Vaccine System</p>
      </div>
    `
  };

  try {
    console.log('⏳ Sending test email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Response:', JSON.stringify({
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response
    }, null, 2));
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // Provide specific troubleshooting tips based on error
    if (error.message.includes('ETIMEDOUT') || error.message.includes('ESOCKET')) {
      console.log('\n🔧 Possible solutions:');
      console.log('   - Check your internet connection');
      console.log('   - Gmail servers might be temporarily unavailable');
    } else if (error.message.includes('EAUTH') || error.message.includes('Authentication')) {
      console.log('\n🔧 Authentication issues:');
      console.log('   - Verify your EMAIL_USER and EMAIL_PASS in .env file');
      console.log('   - Make sure you\'re using an App Password, not your regular Gmail password');
      console.log('   - Go to Google Account settings > Security > 2-Step Verification > App passwords');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Connection issues:');
      console.log('   - Firewall might be blocking the connection');
      console.log('   - Antivirus software might be interfering');
    }
  }
};

// Also test the actual email service function
const testActualEmailService = async () => {
  console.log('\n🧪 Testing Actual Email Service Function (OTP Email)...');
  
  try {
    // Dynamically require the email service to test OTP functionality
    const { sendOTPEmail } = require('./server/utils/emailService');
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testOTP = '123456';
    
    console.log(`📤 Attempting to send OTP email to: ${testEmail}`);
    const result = await sendOTPEmail(testEmail, testOTP);
    
    if (result) {
      console.log('✅ OTP email sent successfully through service function!');
    } else {
      console.log('❌ OTP email failed to send through service function');
    }
  } catch (error) {
    console.error('❌ Error calling email service function:', error.message);
  }
};

// Run tests
const runTests = async () => {
  await testEmailDelivery();
  await testActualEmailService();
  
  console.log('\n📋 Testing Complete');
  console.log('\nIf emails are not being delivered:');
  console.log('1. Verify your Gmail App Password is correct');
  console.log('2. Make sure "Less secure app access" is turned ON (not recommended) OR');
  console.log('3. Use App Passwords (recommended)');
  console.log('4. Check if your IP is whitelisted by Gmail');
  console.log('5. Consider using alternative email services like SendGrid or Mailgun');
};

runTests().catch(console.error);