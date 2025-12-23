# Security Guidelines for Public Repository

## Environment Variables Configuration

This repository contains a `.env.example` file that provides the template for required environment variables. Before running the application, you must create your own `.env` file with actual values.

### Required Environment Variables

The application requires the following environment variables to be set:

#### Server Configuration
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong secret key for JWT tokens (at least 32 characters)
- `EMAIL_USER` - Email address for sending notifications (optional)
- `EMAIL_PASS` - App password for the email account (optional)
- `PORT` - Port number for the server (default: 5000)

#### Admin Configuration
- `ADMIN_EMAIL` - Email for the initial admin account (required for createAdmin.js)
- `ADMIN_PASSWORD` - Password for the initial admin account (required for createAdmin.js)
- `ADMIN_NAME` - Name for the initial admin account (optional)
- `ADMIN_GOV_ID` - Government ID for the initial admin account (optional)

#### Deployed Admin Configuration
- `DEPLOYED_ADMIN_EMAIL` - Email for deployed admin creation endpoint
- `DEPLOYED_ADMIN_PASSWORD` - Password for deployed admin creation endpoint
- `ADMIN_CREATION_SECRET` - Secret key for admin creation endpoint security

## Security Best Practices

### 1. Strong Passwords
- Use strong, unique passwords for all accounts
- Use a password manager to generate and store complex passwords
- Never reuse passwords across different services

### 2. Database Security
- Use strong database credentials
- Enable database authentication
- Use secure connection strings with authentication
- Regularly update database passwords

### 3. JWT Secret
- Generate a strong JWT secret (at least 32 random characters)
- Never commit JWT secrets to version control
- Rotate JWT secrets periodically

### 4. Email Configuration
- Use app-specific passwords for email services
- Enable 2-factor authentication on email accounts
- Use a dedicated email account for application notifications

### 5. Admin Access
- Change default admin credentials immediately
- Use strong, unique passwords for admin accounts
- Regularly review admin access logs
- Limit the number of admin accounts

## Production Deployment

When deploying to production:

1. **Never commit `.env` files** - they are properly ignored by `.gitignore`
2. **Use environment variables** provided by your hosting platform
3. **Generate strong secrets** for JWT and other sensitive configurations
4. **Use HTTPS** for all production traffic
5. **Implement proper logging** and monitoring
6. **Set up automated backups** for your database

## Default Credentials Warning

This repository may contain default credentials for development purposes. These should never be used in production:

- Default admin email: `admin@vaccine.com` (fallback)
- Default admin password: `admin123` (fallback)
- Default deployed admin: `admin@deployed.com` / `deployedadmin123` (fallback)

**Always change these defaults in your deployed environment.**

## Security Updates

- Regularly update dependencies using `npm audit`
- Monitor for security vulnerabilities in your dependencies
- Apply security patches promptly
- Test applications after applying security updates

## Reporting Security Issues

If you discover a security vulnerability in this project, please contact the maintainers directly. Do not create a public issue.

## Environment Variable Validation

The application includes validation to ensure required environment variables are set. If required variables are missing, the application will display appropriate warnings or errors to guide proper configuration.