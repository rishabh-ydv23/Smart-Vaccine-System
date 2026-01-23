# Admin Credentials for Smart Vaccine System

## Default Admin Account

After running the setup, an admin account is automatically created with the following credentials:

**Email:** `admin@vaccine.com`
**Password:** (Set in environment variable ADMIN_PASSWORD)

## How to Access Admin Panel

1. Navigate to the login page
2. Click "Switch to Admin" button
3. Use the credentials above to log in
4. You will be redirected to the Admin Dashboard

## Changing Admin Credentials

For security reasons, you should change the default admin password after first login:

1. Log in to the admin panel
2. Go to the profile settings
3. Change your password to something more secure

## Troubleshooting

If you're unable to log in as admin:

1. Make sure the server is running
2. Check that MongoDB is properly connected
3. Verify the admin user exists by running:
   ```
   cd server
   npm run create-admin
   ```
4. If there are issues, you can reset the admin account:
   ```
   cd server
   npm run reset-admin
   ```

## Note for Production

Remember to change these default credentials in production environments. You can update them in the `.env` file in the server directory.