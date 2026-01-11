
 # Smart Vaccine System

A comprehensive vaccine management system with appointment booking, doctor consultations, and certificate generation.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your actual credentials:
   - MongoDB connection string
   - JWT secret (use a strong random string)
   - Email credentials (for sending notifications)

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL if different from default

5. Start the development server:
   ```bash
   npm run dev
   ```

### Admin Access

To create an admin user, run:
```bash
cd server
node createAdmin.js
```

Default admin credentials:
- Email: Value of `ADMIN_EMAIL` environment variable (defaults to `admin@vaccine.com`)
- Password: Value of `ADMIN_PASSWORD` environment variable (defaults to `admin123`)

You can customize these by modifying the `createAdmin.js` script.

## Features

- Vaccine appointment booking
- Doctor consultation scheduling
- Digital certificate generation
- Admin dashboard for managing appointments and vaccines
- Real-time appointment status updates
- Location-based hospital finder

## Security Notes

For production deployment:
1. Use strong, unique passwords
2. Rotate JWT secrets regularly
3. Use environment-specific configuration files
4. Enable HTTPS for all communications
5. Regularly update dependencies

