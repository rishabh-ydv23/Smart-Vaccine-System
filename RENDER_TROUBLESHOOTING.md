# Render Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. "Error: ENOENT: no such file or directory, stat '/opt/render/project/src/client/dist/index.html'"

**Problem**: The backend service is trying to serve frontend files that don't exist in the Render deployment.

**Solution**: 
- This has been fixed in the latest code by adding a check for Render deployment
- The backend now checks for the `RENDER` environment variable and skips serving frontend files when it's present
- Make sure your `render.yaml` includes the `RENDER=true` environment variable

### 2. CORS Errors

**Problem**: Browser shows CORS errors when trying to access the API.

**Solution**:
1. Make sure `CLIENT_URL` is set correctly in your backend environment variables
   - It should be set to your frontend URL (e.g., `https://your-frontend.onrender.com`)
2. Check that the frontend `VITE_API_URL` points to your backend service
   - It should be set to your backend URL (e.g., `https://your-backend.onrender.com`)

### 3. Database Connection Issues

**Problem**: "Service temporarily unavailable. Database connection error."

**Solution**:
1. Verify that `MONGO_URI` is correctly set in your Render environment variables
2. Make sure your MongoDB Atlas cluster allows connections from Render's IP addresses:
   - Add `0.0.0.0/0` to your IP whitelist in MongoDB Atlas (allows all IPs)
   - Or add Render's specific IP addresses to your whitelist
3. Check that your MongoDB cluster is running and accessible

### 4. Admin Login Not Working

**Problem**: "Invalid email or password" when trying to log in as admin.

**Solution**:
1. Make sure you've created an admin user:
   - Use the Render console to run `npm run create-admin`
   - Or use the API endpoint: `POST /create-deployed-admin/YOUR_SECRET_KEY`
2. Verify you're using the correct credentials:
   - Default deployed admin email: `admin@deployed.com`
   - Default deployed admin password: `deployedadmin123`
3. Check server logs for authentication errors

### 5. Environment Variables Not Loading

**Problem**: Application behaves as if environment variables are missing.

**Solution**:
1. Double-check that all required variables are set in the Render dashboard:
   - Go to your service → Settings → Environment Variables
2. Make sure there are no typos in the variable names
3. Restart your services after adding new environment variables
4. Check that sensitive variables are not synced if they contain secrets

### 6. Build Failures

**Problem**: Deployment fails during the build phase.

**Solution**:
1. Check the build logs in your Render dashboard for specific error messages
2. Make sure all dependencies are properly listed in `package.json`
3. Verify that your build commands are correct:
   - Backend: `npm install`
   - Frontend: `npm install && npm run build`

### 7. Application Not Starting

**Problem**: Deployment succeeds but the application doesn't start or keeps restarting.

**Solution**:
1. Check the application logs for error messages
2. Verify that the start command is correct:
   - Backend: `node index.js`
3. Make sure the PORT environment variable is being used correctly
4. Check that all required environment variables are set

### 8. Frontend Not Loading

**Problem**: Frontend builds successfully but doesn't load in the browser.

**Solution**:
1. Check that your `VITE_API_URL` in the frontend `.env` file is correct
2. Verify that the backend service is running and accessible
3. Make sure the static site is configured correctly in Render:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## Debugging Steps

### 1. Check Logs
Always start by checking the logs in your Render dashboard:
1. Go to your service
2. Click on "Logs" tab
3. Look for error messages or warnings

### 2. Verify Environment Variables
1. Go to your service → Settings → Environment Variables
2. Make sure all required variables are set
3. Check that sensitive variables are properly configured

### 3. Test Endpoints
1. Test the health endpoint: `GET /health`
2. Test API endpoints with tools like Postman or curl
3. Check browser developer tools for network errors

### 4. Restart Services
Sometimes a simple restart can resolve issues:
1. Go to your service
2. Click "Manual Deploy" → "Clear build cache & deploy"

## Need More Help?

If you continue to experience issues:

1. Check the server logs in your Render dashboard
2. Verify all environment variables are correctly set
3. Ensure your MongoDB connection string is correct and accessible
4. Contact the project maintainers for assistance