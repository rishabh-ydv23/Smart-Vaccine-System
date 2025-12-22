# Deployment Verification Guide

## How to Verify Your Smart Vaccine System Deployment

After deploying your application to Render, follow these steps to verify everything is working correctly.

### 1. Check Application Health

Visit your backend health endpoint:
```
GET https://your-backend-url.onrender.com/health
```

You should receive a response like:
```json
{
  "status": "OK",
  "dbConnected": true,
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
}
```

If you get a 404 error, make sure:
1. Your frontend `.env` file is properly configured with the correct `VITE_API_URL`
2. The backend service is running and accessible

### 2. Create Admin User

#### Method 1: Using Render Console
1. Go to your Render dashboard
2. Select your backend service
3. Go to the "Console" tab
4. Run:
   ```
   npm run create-admin
   ```

#### Method 2: Using API Endpoint
Send a POST request to:
```
POST https://your-backend-url.onrender.com/create-deployed-admin/YOUR_SECRET_KEY
```

Expected response:
```json
{
  "message": "Deployed admin user created successfully!",
  "credentials": {
    "email": "admin@deployed.com",
    "password": "deployedadmin123",
    "role": "admin"
  },
  "warning": "These credentials are for testing purposes only. Change them in production."
}
```

### 3. Test User Registration

Try registering a new user:
```
POST https://your-backend-url.onrender.com/api/auth/register
```

Body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "securepassword123",
  "governmentId": "TEST123456"
}
```

Expected response:
```json
{
  "user": {
    "_id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### 4. Test User Login

Try logging in as the newly created user:
```
POST https://your-backend-url.onrender.com/api/auth/login
```

Body:
```json
{
  "email": "test@example.com",
  "password": "securepassword123"
}
```

Expected response:
```json
{
  "user": {
    "_id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### 5. Test Admin Login

Try logging in as admin:
```
POST https://your-backend-url.onrender.com/api/auth/login
```

Body (using default deployed credentials):
```json
{
  "email": "admin@deployed.com",
  "password": "deployedadmin123"
}
```

Expected response:
```json
{
  "user": {
    "_id": "admin_id",
    "name": "Deployed Administrator",
    "email": "admin@deployed.com",
    "role": "admin"
  },
  "token": "jwt_token"
}
```

### 6. Test Frontend Access

Visit your frontend URL:
```
https://your-frontend-url.onrender.com
```

You should see the login page. Try logging in with:
- User login: test@example.com / securepassword123
- Admin login: admin@deployed.com / deployedadmin123

### Common Issues and Solutions

#### Issue: "Service temporarily unavailable. Database connection error."
**Solution:** 
1. Check that `MONGO_URI` is correctly set in your Render environment variables
2. Verify MongoDB Atlas IP whitelist includes Render's IPs (0.0.0.0/0)
3. Check that your MongoDB cluster is running

#### Issue: CORS errors in browser console
**Solution:**
1. Verify `CLIENT_URL` is set correctly in backend environment variables
2. Check that `VITE_API_URL` points to your backend service

#### Issue: "Invalid email or password" for admin login
**Solution:**
1. Make sure you created the admin user using one of the methods above
2. Verify you're using the correct credentials
3. Check server logs for authentication errors

#### Issue: 403 Forbidden when creating admin via API
**Solution:**
1. Make sure `ADMIN_CREATION_SECRET` is set in your environment variables
2. Verify you're using the correct secret key in the URL

### Need Help?

If you continue to experience issues:

1. Check the server logs in your Render dashboard
2. Verify all environment variables are correctly set
3. Ensure your MongoDB connection string is correct and accessible
4. Contact the project maintainers for assistance