# SendGrid Configuration Guide

## Required Environment Variables

For your deployed application, you need to set these environment variables in your Render backend service:

### Production Environment (Render)
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=vaxcareportal@gmail.com

# Application Configuration
CLIENT_URL=https://vaxcare-portal-frontend.onrender.com

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_jwt_secret
```

## How to Update Your Render Environment

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Navigate to your backend service

2. **Update Environment Variables**
   - Go to "Environment" tab
   - Click "Edit" 
   - Add/update these variables:
     - `SENDGRID_API_KEY`: Your SendGrid API key (SG.xxxxxxxxxxxxxxxxxxxxx)
     - `SENDER_EMAIL`: Your sender email (vaxcareportal@gmail.com)
     - `CLIENT_URL`: https://vaxcare-portal-frontend.onrender.com

3. **Remove Old Gmail Variables** (optional but recommended)
   - `EMAIL_USER`: Can be removed
   - `EMAIL_PASS`: Can be removed

4. **Save and Redeploy**
   - Click "Save Changes"
   - Your service will automatically redeploy with the new configuration

## Testing Your Configuration

After updating the environment variables:

1. **Test Registration**
   - Try registering a new user account
   - Check if OTP emails are delivered

2. **Check Server Logs**
   - In Render dashboard, go to your service
   - Click "Logs" to see if SendGrid is initialized successfully
   - Look for "✅ SendGrid initialized successfully" message

## Troubleshooting

If emails still don't work:

1. **Verify API Key**
   - Double-check your SendGrid API key is correct
   - Ensure there are no extra spaces or characters

2. **Sender Verification**
   - Make sure your sender email (vaxcareportal@gmail.com) is verified in SendGrid
   - Go to SendGrid dashboard → Settings → Sender Authentication

3. **Check Logs**
   - Look for error messages in your Render service logs
   - Common issues will be logged there

## Email Templates

Your OTP emails will be sent with:
- From: vaxcareportal@gmail.com (or your SENDER_EMAIL)
- Subject: "Email Verification OTP - Smart Vaccine System"
- Professional HTML template with your branding

Your email verification system is now configured to use SendGrid for reliable delivery!