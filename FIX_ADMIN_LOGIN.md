# How to Fix "Invalid email or password" Error

## Problem
You're getting a 401 authentication error because the admin user doesn't exist in your database yet.

## Solution Options

### Option 1: For Local Development (Recommended First)

If you're testing locally, follow these steps:

1. **Start your backend server:**
   ```bash
   cd server
   npm start
   ```

2. **In a new terminal, run the admin creation script:**
   ```bash
   cd server
   node createDeployedAdmin.js
   ```

3. **Login with the created credentials:**
   - Email: `admin@deployed.com`
   - Password: `deployedadmin123`

### Option 2: For Deployed Production System (Render)

If you're getting this error on your deployed application:

#### Method A: Using Render Console (Easiest)

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Click on the "Shell" tab
4. Run the command:
   ```bash
   npm run create-admin
   ```
5. This will create an admin user with credentials from your environment variables:
   - Email: Value of `DEPLOYED_ADMIN_EMAIL` (default: `admin@deployed.com`)
   - Password: Value of `DEPLOYED_ADMIN_PASSWORD` (default: `deployedadmin123`)

#### Method B: Using the API Endpoint

1. Make sure these environment variables are set in your Render dashboard:
   - `ADMIN_CREATION_SECRET` (set a secure secret key)
   - `DEPLOYED_ADMIN_EMAIL` (optional, defaults to `admin@deployed.com`)
   - `DEPLOYED_ADMIN_PASSWORD` (optional, defaults to `deployedadmin123`)

2. Use Postman, curl, or any HTTP client to send a POST request:
   ```
   POST https://your-backend-url.onrender.com/create-deployed-admin/YOUR_SECRET_KEY
   ```
   Replace `YOUR_SECRET_KEY` with the value of `ADMIN_CREATION_SECRET`

3. You should receive a response with the admin credentials

### Option 3: Direct Database Method (Advanced)

If the above methods don't work, you can create the admin directly in MongoDB:

1. Connect to your MongoDB Atlas cluster
2. Navigate to your database → `users` collection
3. Insert a new document with these fields:
   ```json
   {
     "name": "Administrator",
     "email": "admin@deployed.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "governmentId": "ADMIN001",
     "role": "admin",
     "isEmailVerified": true
   }
   ```
   
   Note: The password must be hashed using bcrypt. You can generate one using:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = bcrypt.hashSync('deployedadmin123', 10);
   console.log(hash);
   ```

## Verification

After creating the admin user, test the login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@deployed.com",
    "password": "deployedadmin123"
  }'
```

You should receive a response with a user object and JWT token.

## Common Issues

### Issue: "Service temporarily unavailable"
- **Solution**: Your backend server might not be running. Start it with `npm start` in the server directory.

### Issue: "Forbidden: Invalid secret key"
- **Solution**: Make sure the `ADMIN_CREATION_SECRET` in your .env file matches what you're using in the API call.

### Issue: Still getting 401 after creating admin
- **Solution**: 
  1. Check that the email matches exactly (case-sensitive)
  2. Verify the password is correct
  3. Check server logs for any errors
  4. Try restarting your backend server

## Default Credentials Summary

**Local Development:**
- Email: `admin@vaccine.com`
- Password: `rishabhVaccine12`

**Deployed/Production:**
- Email: `admin@deployed.com`
- Password: `deployedadmin123`

*Note: These can be overridden by setting environment variables in your .env file or Render dashboard.*
