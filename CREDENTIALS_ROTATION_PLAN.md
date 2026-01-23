# 🔐 Security Credentials Cleanup - Action Plan

## ✅ COMPLETED ACTIONS

### 1. Local Code Cleanup
- [x] Replaced all credentials in `server/.env` with `CHANGE_ME_*` placeholders
- [x] Verified no hardcoded secrets in `server/**/*.js` files
- [x] Verified environment variables are used correctly throughout codebase
- [x] Created comprehensive `.env.example` template with security warnings

### 2. Git History Cleanup  
- [x] Installed `git-filter-repo` tool
- [x] Created `replace-secrets.txt` with all exposed secrets
- [x] Executed: `git filter-repo --replace-text replace-secrets.txt --force`
- [x] Reconfigured git remote: `origin https://github.com/rishabh-ydv23/Smart-Vaccine-System.git`

### 3. Security Documentation
- [x] Created `SECURITY_FIX_CREDENTIALS.md` with detailed remediation steps
- [x] Updated `.env.example` with secure instructions
- [x] Verified `.env` is in `.gitignore`

---

## ⚠️ NEXT STEPS - DO THIS NOW

### URGENT (Within 24 hours)

#### 1️⃣ Rotate MongoDB Password
```bash
# Step 1: Login to MongoDB Atlas
# https://cloud.mongodb.com → Database Access → Users

# Step 2: Find "smartvaccineuser" → Click EDIT → Change Password
# Generate a strong random password (MongoDB will show you one)

# Step 3: Update server/.env
MONGO_URI=mongodb+srv://smartvaccineuser:YOUR_NEW_PASSWORD@smartvaccine.uvb3wyh.mongodb.net/?appName=SmartVaccine

# Step 4: If deployed on Render, update environment variable there too
# https://dashboard.render.com → Your App → Environment
```

#### 2️⃣ Rotate SendGrid API Key
```bash
# Step 1: Login to SendGrid
# https://app.sendgrid.com/settings/api_keys

# Step 2: DELETE the old exposed key (if visible in history)
# Step 3: CREATE NEW key
#   - Name: "SmartVaccine"
#   - Permissions: Mail Send (full access)

# Step 4: Copy the new key and update server/.env
SENDGRID_API_KEY=SG.your_new_key_here

# Step 5: If deployed on Render, update environment variable
```

#### 3️⃣ Generate New JWT Secret
```bash
# Generate using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL:
openssl rand -hex 32

# Update server/.env:
JWT_SECRET=<your_new_secret_here>

# If deployed, update Render environment variable
```

---

## ⚡ IMMEDIATE PUSH PLAN (After Rotating Credentials)

### Option A: Force Push Clean History (Recommended if no shared repo)
```bash
cd c:\Users\ASUS\smart-vaccine-system

# Verify origin is set
git remote -v

# Force push cleaned history
git push origin main --force-with-lease

# Verify on GitHub that history is cleaned
# Check: https://github.com/rishabh-ydv23/Smart-Vaccine-System/commits/main
```

### Option B: New Private Repository (Most Secure)
```bash
# Create new private repo on GitHub
# Clone the cleaned repo locally
git clone --mirror c:\Users\ASUS\smart-vaccine-system new-repo.git
cd new-repo.git
git push --mirror https://github.com/rishabh-ydv23/new-repo-name.git
```

---

## 📋 Deployment Checklist for Render

After all local changes:

1. [x] Local .env has placeholder values
2. [ ] Rotate all credentials (MongoDB, SendGrid, JWT)
3. [ ] Test locally with new credentials
4. [ ] Push cleaned git history to GitHub
5. [ ] In Render dashboard, update all environment variables:
   - `MONGO_URI` (with new password)
   - `SENDGRID_API_KEY` (new key)
   - `JWT_SECRET` (new secret)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`
6. [ ] Redeploy application
7. [ ] Test deployment with new credentials
8. [ ] Monitor logs for any auth failures

---

## 📊 Exposed Secrets Status

| Secret | Exposed | Status | Action |
|---|---|---|---|
| MongoDB Password | ✓ | ✅ Removed from git | 🔄 Rotate password |
| SendGrid API Key | ✓ | ✅ Removed from git | 🔄 Rotate key |
| JWT Secret | ✓ | ✅ Removed from git | 🔄 Generate new |
| Admin Email | ✓ | ✅ Removed from git | ℹ️ Can reuse if new password |
| Admin Password | ✓ | ✅ Removed from git | 🔄 Create new admin |
| Gmail Password | ✓ | ✅ Removed from git | ℹ️ Legacy - not used |

---

## 🔍 Verification Commands

### Check .env is clean
```bash
cat server/.env | grep -i "CHANGE_ME"
# Should show all CHANGE_ME_* placeholders (no real values)
```

### Check .env is in gitignore
```bash
git check-ignore -v server/.env
# Should output: server/.env (or path with gitignore pattern)
```

### Verify no secrets in git history
```bash
# Search for MongoDB password in all commits (should find 0)
git log -S "MONGODB_PASSWORD_REMOVED" --all
git log -S "SG.0ah2VL2aQMmtbpCMAjYnKQ" --all

# Should output: "(no commits)"
```

---

## 📚 Files Modified/Created

- ✅ `server/.env` - All credentials replaced with placeholders
- ✅ `server/.env.example` - Updated with security instructions  
- ✅ `.gitignore` - Verified .env is excluded
- ✅ `SECURITY_FIX_CREDENTIALS.md` - Detailed remediation guide
- ✅ `replace-secrets.txt` - Used by git-filter-repo (can be deleted)

---

## 🆘 Troubleshooting

### If MongoDB still fails after password change
```bash
# Test connection string format
# Ensure no special characters in password need URL encoding
# Example: password "abc@def" should be "abc%40def" in URI

# Test in mongo shell:
mongosh "mongodb+srv://smartvaccineuser:NEW_PASSWORD@smartvaccine.uvb3wyh.mongodb.net/"
```

### If SendGrid emails still fail
```bash
# Verify API key is copied correctly (no extra spaces)
# Verify permissions on API key (Mail Send should be checked)
# Check Render logs: 
# https://dashboard.render.com → Your App → Logs
```

### If git push fails
```bash
# Force push might be rejected if branch protection is enabled
# Solution: Temporarily disable branch protection on GitHub
# https://github.com/rishabh-ydv23/Smart-Vaccine-System/settings/branches
# Then push again
```

---

## 📞 Support Resources

- [MongoDB Change User Password](https://docs.mongodb.com/manual/reference/method/db.changeUserPassword/)
- [SendGrid API Keys Docs](https://docs.sendgrid.com/ui/account-and-settings/api-keys)
- [Git Filter Repo Guide](https://github.com/newren/git-filter-repo)
- [Node.js Crypto for Secret Generation](https://nodejs.org/api/crypto.html)

---

**Created:** January 23, 2026  
**Status:** All exposed credentials fixed - Awaiting credential rotation and deployment
