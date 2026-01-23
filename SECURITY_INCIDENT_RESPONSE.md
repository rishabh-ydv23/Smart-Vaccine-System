# 🚨 SECURITY INCIDENT - Credentials Exposed in GitHub History

## ⚠️ CRITICAL: DO THIS IMMEDIATELY

### **Exposed Credentials Found:**
- ❌ **SENDGRID_API_KEY**: (Exposed - ROTATED - see action plan below)
- ❌ **MongoDB Password**: In `MONGO_URI` connection string (Exposed - ROTATE)
- ❌ **JWT Secret**: (Exposed - REGENERATE - see action plan below)
- ❌ **Admin Password**: (Exposed - UPDATE - see action plan below)

---

## 🔴 Action Plan (Do in this order):

### **PRIORITY 1: Rotate Credentials (Next 5 minutes)**

#### 1. SendGrid API Key
```bash
# STEP 1: Delete old key from SendGrid
# Go to: https://app.sendgrid.com/settings/api_keys
# Find and DELETE key: SG.0ah2VL2aQMmtbpCMAjYnKQ...
# Action: REVOKE IMMEDIATELY

# STEP 2: Generate new key
# Go to: https://app.sendgrid.com/settings/api_keys
# Click "Create API Key"
# Name it: "SmartVaccine-Production"
# Copy new key

# STEP 3: Update Render Environment
# Go to: https://dashboard.render.com
# Select your backend service
# Go to: Environment
# Update: SENDGRID_API_KEY=<new_key_here>
# Save
```

#### 2. MongoDB Password
```bash
# STEP 1: Change MongoDB password
# Go to: https://cloud.mongodb.com
# Select your cluster: SmartVaccine
# Go to: Database Access
# Find user: smartvaccineuser
# Click: Edit
# Generate new password
# Copy new password

# STEP 2: Update connection string
# MONGO_URI=mongodb+srv://smartvaccineuser:<NEW_PASSWORD>@smartvaccine.uvb3wyh.mongodb.net/?appName=SmartVaccine

# STEP 3: Update Render Environment
# Update MONGO_URI with new password in Render dashboard
```

#### 3. JWT Secret
```bash
# STEP 1: Generate new JWT Secret (use any of these):

# Option A: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option B: Using OpenSSL
openssl rand -hex 32

# Option C: Using PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object {Get-Random -Max 256}))

# STEP 2: Update Render Environment
# Go to Render dashboard
# Update JWT_SECRET=<new_value>
```

#### 4. Admin Password
```bash
# STEP 1: Create new admin account
# On your Render backend, run:
ADMIN_EMAIL=admin@vaccine.com ADMIN_PASSWORD=<new_strong_password> node createAdmin.js

# OR in Render console:
# Set environment variable:
ADMIN_PASSWORD=<new_strong_password>
# Then SSH into backend and run createAdmin.js
```

---

### **PRIORITY 2: Remove from Git History (within 24 hours)**

```bash
# Option A: BFG Repo-Cleaner (Recommended - simpler)
# 1. Download: https://rtyley.github.io/bfg-repo-cleaner/
# 2. Run:
bfg --delete-files server/.env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Option B: Using git filter-branch
git filter-branch --tree-filter 'rm -f server/.env' --prune-empty -f HEAD

# 3. Push changes
git push origin main --force-with-lease
```

**OR** Contact GitHub to purge from history:
- Go to: https://github.com/your-repo/settings
- Under "Security & analysis"
- Report the leaked secret
- GitHub can purge it from all history

---

### **PRIORITY 3: Update .gitignore (Already Done ✅)**

```bash
# Already updated:
# - .env
# - server/.env
# - client/.env
# - .env.local
# - .env.*.local
# - .env.test
# - .env.production
# - .env.development
```

---

## ✅ Verification Checklist

After completing all steps:

- [ ] SendGrid API key rotated
- [ ] Old API key revoked in SendGrid dashboard
- [ ] New API key updated in Render
- [ ] MongoDB password changed
- [ ] New MONGO_URI updated in Render
- [ ] JWT secret regenerated
- [ ] New JWT secret updated in Render
- [ ] New admin password set
- [ ] `.env` file removed from git history
- [ ] .gitignore updated
- [ ] Application tested with new credentials
- [ ] Monitored SendGrid for unauthorized usage

---

## 🔍 How to Check if Credentials Are Compromised

### **SendGrid:**
```bash
# Check for unauthorized emails sent
# Go to: https://app.sendgrid.com/email_activity
# Look for: Unusual sending patterns, strange recipients
# If found: IMMEDIATELY regenerate API key
```

### **MongoDB:**
```bash
# Check for unauthorized access
# Go to: MongoDB Atlas > Clusters > Activity
# Look for: Unusual access times, unknown IPs
# If found: Change password IMMEDIATELY
```

### **GitHub:**
```bash
# Search for exposed credentials
# Command line check:
git log -p -S "SG.0ah2VL2aQMmtbpCMAjYnKQ" -- server/.env

# Or use GitHub's security alerts:
# Go to your repo > Security > Secret scanning alerts
```

---

## 📋 Files Status

| File | Status | Action |
|------|--------|--------|
| `server/.env` | ❌ LEAKED | Already removed from future commits |
| `.gitignore` | ✅ UPDATED | Enhanced protection added |
| `.env.example` | ✅ SAFE | Contains placeholder values only |
| GitHub history | ⚠️ NEEDS CLEANUP | Run `git filter-branch` or BFG |

---

## 🛡️ Prevention Going Forward

### **1. Pre-commit Hook** (Prevents future leaks)

Create ``.git/hooks/pre-commit``:
```bash
#!/bin/bash
if git diff-index --cached HEAD | grep -E '\.(env|config)' | grep -v '.example'; then
  echo "❌ ERROR: Attempting to commit sensitive files!"
  echo "Add these to .gitignore:"
  git diff-index --cached HEAD | grep -E '\.(env|config)'
  exit 1
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### **2. Use Environment Variables in CI/CD**
- Store secrets only in CI/CD platform (Render, GitHub, etc.)
- Never commit `.env` files
- Use `.env.example` for documentation

### **3. Regular Security Audits**
```bash
# Check git history for secrets
git log -p | grep -i "password\|secret\|key\|token"

# Use automated tools
npm install -g detect-secrets
detect-secrets scan
```

---

## 📞 Emergency Contacts

If you discover unauthorized activity:

1. **SendGrid**: support@sendgrid.com
2. **MongoDB**: support@mongodb.com
3. **GitHub**: Report via https://github.com/security
4. **Your ISP**: For infrastructure security

---

## 📚 References

- [GitHub: Removing sensitive data from history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [OWASP: Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**UPDATED**: January 23, 2026
**PRIORITY**: 🔴 CRITICAL
**STATUS**: ⚠️ ACTION REQUIRED
