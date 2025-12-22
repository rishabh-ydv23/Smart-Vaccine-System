# Deployment Guide for Smart Vaccine System

## Deploying to Render

This guide explains how to deploy the Smart Vaccine System to Render and configure it properly.

### Prerequisites

1. A Render account (free or paid)
2. A MongoDB Atlas account or any MongoDB service
3. Email credentials for sending notifications (optional)

### Step-by-Step Deployment

#### 1. Fork or Clone the Repository

First, fork or clone this repository to your GitHub account.

#### 2. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Backend Service Configuration:**
- Name: `smart-vaccine-backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node index.js`
- Root Directory: `server`

**Frontend Service Configuration:**
- Name: `smart-vaccine-frontend`
- Environment: `Static Site`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Root Directory: `client`

#### 3. Configure Environment Variables

You need to set the following environment variables in your Render dashboard:

**Backend Environment Variables:**
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong secret key for JWT tokens
- `EMAIL_USER` - Email address for sending notifications (optional)
- `EMAIL_PASS` - App password for the email account (optional)
- `CLIENT_URL` - The URL of your frontend application (e.g., `https://your-app.onrender.com`)
- `ADMIN_CREATION_SECRET` - A secret key for creating admin users via API (strongly recommended)

**Frontend Environment Variables:**
- `VITE_API_URL` - The URL of your backend API (e.g., `https://your-backend-service.onrender.com`)

You should also create a `.env` file in the `client` directory with the following content:
```
VITE_API_URL=https://your-backend-service.onrender.com/api
```

#### 4. Create the Admin User

After deployment, you need to create an admin user. There are two ways to do this:

**Method 1: Using the Admin Creation Script (Recommended for initial setup)**

1. SSH into your Render service or use the Render console
2. Navigate to the server directory
3. Run:
   ```
   npm run create-admin
   ```

**Method 2: Using the Deployed Admin Creation Endpoint (For remote setup)**

Send a POST request to:
```
POST https://your-backend-url.onrender.com/create-deployed-admin/YOUR_SECRET_KEY
```

Replace `YOUR_SECRET_KEY` with the value you set for `ADMIN_CREATION_SECRET`.

This will create an admin user with:
- Email: `admin@deployed.com`
- Password: `deployedadmin123`

**Important:** Change these default credentials after first login!

### Troubleshooting Common Issues

#### 1. Database Connection Issues

Make sure your MongoDB Atlas cluster allows connections from Render's IP addresses. You may need to:

1. Add `0.0.0.0/0` to your IP whitelist in MongoDB Atlas (allows all IPs)
2. Or add Render's specific IP addresses to your whitelist

#### 2. Admin Login Not Working

If you can't log in as admin:

1. Verify the admin user exists by checking your database
2. Make sure you're using the correct credentials
3. Check the server logs for any authentication errors

#### 3. CORS Errors

If you see CORS errors in the browser console:

1. Make sure `CLIENT_URL` is set correctly in your backend environment variables
2. Verify that the frontend `VITE_API_URL` points to your backend service

#### 4. Environment Variables Not Loading

If environment variables seem to be missing:

1. Double-check that all required variables are set in the Render dashboard
2. Make sure there are no typos in the variable names
3. Restart your services after adding new environment variables

### Security Recommendations

1. **Change Default Credentials**: Always change the default admin credentials after deployment
2. **Strong Secrets**: Use strong, randomly generated secrets for `JWT_SECRET` and `ADMIN_CREATION_SECRET`
3. **IP Whitelisting**: Restrict MongoDB access to specific IP addresses when possible
4. **HTTPS**: Render automatically provides HTTPS, so make sure to use HTTPS URLs
5. **Regular Updates**: Keep your dependencies up to date

### Monitoring and Maintenance

1. Monitor your Render dashboard for any deployment errors
2. Check the application logs regularly
3. Set up uptime monitoring for critical services
4. Regularly backup your MongoDB database

### Custom Domain Setup

To use a custom domain:

1. In your Render dashboard, go to your service settings
2. Under "Custom Domains", add your domain
3. Follow Render's instructions to configure DNS records
4. Update your `CLIENT_URL` environment variable to use your custom domain

### Support

If you encounter issues not covered in this guide:

1. Check the server logs in your Render dashboard
2. Verify all environment variables are correctly set
3. Ensure your MongoDB connection string is correct and accessible
4. Contact the project maintainers for assistance