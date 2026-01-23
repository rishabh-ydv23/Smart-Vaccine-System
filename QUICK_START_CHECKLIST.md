# ⚡ QUICK START - Credential Rotation Checklist

## 🔴 DO THIS NOW (Critical Security Fix)

### Step 1: Rotate MongoDB Password (5 min)
```
[ ] Go to: https://cloud.mongodb.com
[ ] Click: Database Access → Users
[ ] Find: smartvaccineuser
[ ] Click: EDIT → Change Password
[ ] Copy: New password
[ ] Update server/.env: MONGO_URI=...NEW_PASSWORD...
[ ] If on Render: Update MONGO_URI in dashboard
[ ] Test: npm run check-db (from server folder)
```

### Step 2: Rotate SendGrid API Key (5 min)
```
[ ] Go to: https://app.sendgrid.com/settings/api_keys
[ ] Delete: Old exposed key (if visible)
[ ] Click: Create API Key
[ ] Set Name: "SmartVaccine"
[ ] Set Permissions: Mail Send
[ ] Copy: New API key
[ ] Update server/.env: SENDGRID_API_KEY=SG.xxx
[ ] If on Render: Update SENDGRID_API_KEY in dashboard
[ ] Test: npm run test-sendgrid (from server folder)
```

### Step 3: Generate New JWT Secret (2 min)
```
[ ] Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
[ ] Copy: Generated 64-character string
[ ] Update server/.env: JWT_SECRET=<copied_value>
[ ] If on Render: Update JWT_SECRET in dashboard
```

### Step 4: Create New Admin Account (2 min)
```
[ ] Open terminal in server folder
[ ] Run: ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=strong_password node createAdmin.js
[ ] Update server/.env if needed
[ ] If on Render: Update ADMIN_EMAIL & ADMIN_PASSWORD
```

### Step 5: Test Locally (5 min)
```
[ ] cd server && npm start
[ ] cd ../client && npm run dev
[ ] Try login with new admin credentials
[ ] Check all features work
```

### Step 6: Push Cleaned Git History (3 min)
```
[ ] cd c:\Users\ASUS\smart-vaccine-system
[ ] Run: git push origin main --force-with-lease
[ ] Go to GitHub and verify commits are cleaned
```

### Step 7: Deploy to Render (5 min)
```
[ ] Go to: https://dashboard.render.com
[ ] Select: Your Smart Vaccine App
[ ] Click: Environment
[ ] Update all variables with new values
[ ] Click: Save & Redeploy
[ ] Check logs to ensure it deploys successfully
```

---

## ✅ Verification (2 min)

Run these commands to verify everything is secure:

```bash
# Check .env is clean
cat server/.env | grep "CHANGE_ME"
# Expected: Should show CHANGE_ME_* placeholders

# Check git history is clean  
git log --all --source -S "MONGODB_PASSWORD_REMOVED"
# Expected: Should show nothing (no results)

# Check .env is in gitignore
git check-ignore -v server/.env
# Expected: Should return the .env path
```

---

## 📊 Total Time Required

- MongoDB rotation: 5 min
- SendGrid rotation: 5 min  
- JWT generation: 2 min
- New admin account: 2 min
- Local testing: 5 min
- Git push: 3 min
- Render deployment: 5 min
- Verification: 2 min

**TOTAL: ~30 minutes**

---

## 🆘 If Something Breaks

### MongoDB connection fails
```
1. Check password has no special characters
2. Or URL-encode special chars (@ = %40)
3. Test in: mongosh "mongodb+srv://user:pass@host/db"
4. Update .env and try again
```

### SendGrid emails still fail
```
1. Check API key copied correctly (no spaces)
2. Check API key has Mail Send permission
3. Test: npm run test-sendgrid
4. Check Render logs if deployed
```

### Git push fails
```
1. Disable branch protection on GitHub temporarily
2. Run: git push origin main --force-with-lease
3. Re-enable branch protection
```

### Admin login fails
```
1. Verify email and password are correct
2. Check MongoDB is running
3. Run: node createAdmin.js with correct credentials again
4. Check logs for errors
```

---

## 📋 Files You Modified

✅ `server/.env` - All credentials → placeholders  
✅ `server/.env.example` - Updated with security guidance  
✅ Git history - All secrets removed from commits  

## 📚 Documentation Files Created

📖 `SECURITY_AUDIT_REPORT.md` - Complete audit findings  
📖 `SECURITY_FIX_CREDENTIALS.md` - Detailed remediation guide  
📖 `CREDENTIALS_ROTATION_PLAN.md` - Step-by-step action plan  

---

## 🎯 Success Criteria

- [x] Local .env has only placeholders
- [x] .env is in .gitignore
- [ ] All credentials rotated
- [ ] Local environment tested with new credentials
- [ ] Git history cleaned and pushed
- [ ] Render variables updated
- [ ] Render deployment successful
- [ ] Production verified working

---

**Status:** ✅ Code cleanup complete | ⏳ Awaiting credential rotation

**Next Action:** Start with Step 1 (MongoDB rotation) above
