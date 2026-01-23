# Admin Login Credentials

## 📋 Default Admin Account

### **Email**: `admin@vaccine.com`
### **Password**: (See environment variable ADMIN_PASSWORD)

---

## 🔐 How to Login as Admin

### **Step 1: Go to Login Page**
Navigate to: `http://localhost:5174/login` (or your deployed URL)

### **Step 2: Enter Admin Credentials**
- **Email**: `admin@vaccine.com`
- **Password**: (Check environment variables ADMIN_PASSWORD)

### **Step 3: Click Login**
You'll be redirected to the Admin Dashboard

---

## 🛠️ Admin Dashboard Access

After logging in with admin credentials, you can access:

- **Admin Routes**: `/admin` 
- **Vaccine Management**: Add, edit, view vaccines
- **User Management**: View registered users (if available)
- **Analytics & Reports**: System statistics
- **Settings**: Configure system parameters

---

## ⚠️ Important Security Notes

### **For Development:**
✅ You can use these default credentials as they are for local testing

### **For Production/Deployment:**
❌ **DO NOT use default credentials!**

1. Change the admin password immediately after deployment
2. Use strong, unique credentials
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in environment variables
4. Consider using environment-specific credentials

---

## 🔄 Create/Reset Admin Account

### **Create New Admin:**
```bash
cd server
ADMIN_EMAIL=your_email@example.com ADMIN_PASSWORD=your_secure_password node createAdmin.js
```

### **Reset Admin Account:**
```bash
cd server
npm run reset-admin
```

---

## 🔑 Environment Variables

To customize admin credentials, set these in your `.env` file:

```env
ADMIN_EMAIL=admin@vaccine.com
ADMIN_PASSWORD=<YOUR_SECURE_PASSWORD>
ADMIN_NAME=Administrator
ADMIN_GOV_ID=ADMIN001
```

---

## 📱 Testing Admin Features

### **1. Via cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vaccine.com",
    "password": "<YOUR_ADMIN_PASSWORD>"
  }'
```

### **2. Expected Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "Administrator",
    "email": "admin@vaccine.com",
    "role": "admin",
    "isEmailVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isEmailVerified": true
}
```

---

## 🚀 First Login Checklist

After successful admin login:

- [ ] Verify dashboard loads
- [ ] Check vaccine management features
- [ ] Verify user list displays
- [ ] Test analytics/reports
- [ ] **Change default password** (Recommended)

---

## 🆘 Troubleshooting Admin Login

### **Issue: "Invalid credentials"**
- ✅ Verify email is exactly: `admin@vaccine.com`
- ✅ Verify password is exactly: (check your ADMIN_PASSWORD environment variable)
- ✅ Check caps lock is OFF
- ✅ Ensure MongoDB is running

### **Issue: "Admin not found"**
- ✅ Run: `cd server && npm run create-admin`
- ✅ Or manually create with: `node createAdmin.js`

### **Issue: "Email not verified" after login**
- ✅ Admin accounts are auto-verified
- ✅ Try resetting admin: `npm run reset-admin`

### **Issue: Can't access admin dashboard**
- ✅ Verify login was successful (check token)
- ✅ Check browser console for errors
- ✅ Ensure role is "admin" in token
- ✅ Check API connection: `http://localhost:5000`

---

## 📊 Admin Features

Once logged in as admin, you can:

1. **Vaccine Management**
   - View all vaccines
   - Add new vaccines
   - Edit vaccine details
   - Delete vaccines
   - View vaccine statistics

2. **User Management**
   - View registered users
   - User registration statistics
   - User details and activity

3. **Settings**
   - Configure system settings
   - Manage email templates
   - View system logs

4. **Analytics**
   - Dashboard statistics
   - User registration charts
   - Vaccine availability reports

---

## 🔐 Security Best Practices

✅ **DO:**
- Change password after first login
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Keep JWT tokens secure
- Logout when finished
- Enable 2FA if available

❌ **DON'T:**
- Share admin credentials
- Use same password as other accounts
- Store credentials in code/repo
- Use default credentials in production
- Share tokens or credentials in messages

---

## 📞 Support

If you encounter issues:

1. Check server logs: `npm run start`
2. Verify MongoDB connection: `npm run check-db`
3. Check user exists: `npm run verify-admin`
4. Reset admin account: `npm run reset-admin`

---

**Last Updated**: January 23, 2026
**Status**: ✅ Ready to Use
