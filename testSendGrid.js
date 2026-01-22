require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
    console.log('🔍 TESTING SENDGRID EMAIL DELIVERY');
    console.log('='.repeat(40));
    
    const testEmail = 'CHANGE_ME_ADMIN_EMAIL'; // Your email for testing
    
    const msg = {
        to: testEmail,
        from: process.env.SENDER_EMAIL || 'noreply@vaxcare-portal.onrender.com',
        subject: 'Test Email - Smart Vaccine System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">✅ SendGrid Test Successful!</h2>
                <p>Hello,</p>
                <p>This is a test email from your Smart Vaccine System to verify that SendGrid is working correctly.</p>
                <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Status:</strong> ✅ SendGrid is properly configured</p>
                    <p><strong>From:</strong> ${process.env.SENDER_EMAIL || 'noreply@vaxcare-portal.onrender.com'}</p>
                    <p><strong>To:</strong> ${testEmail}</p>
                </div>
                <p>Your email system is ready for sending OTPs and notifications!</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p>Best regards,<br>Smart Vaccine System Debug Tool</p>
            </div>
        `
    };

    try {
        console.log('📤 Sending test email...');
        console.log('📧 From:', msg.from);
        console.log('📧 To:', msg.to);
        console.log('📧 Subject:', msg.subject);
        
        await sgMail.send(msg);
        console.log('\n✅ SUCCESS! Email sent successfully');
        console.log('📋 Please check your inbox (and spam folder) for the test email');
        
    } catch (error) {
        console.log('\n❌ FAILED to send email');
        console.log('Error details:');
        console.log('- Message:', error.message);
        
        if (error.response) {
            console.log('- Status:', error.response.status);
            console.log('- Body:', error.response.body);
            console.log('- Headers:', error.response.headers);
        }
        
        // Common troubleshooting tips
        console.log('\n🔧 TROUBLESHOOTING TIPS:');
        console.log('1. Check if SENDGRID_API_KEY is correct in .env file');
        console.log('2. Verify the sender email is verified in SendGrid dashboard');
        console.log('3. Check if your domain/IP is not blacklisted');
        console.log('4. Make sure you have SendGrid credits available');
    }
}

testSendGrid();