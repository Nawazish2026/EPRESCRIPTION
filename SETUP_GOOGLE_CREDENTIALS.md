# 🔧 Step-by-Step: Get Google OAuth Credentials

## The Error You're Seeing

```
Error 401: invalid_client
The OAuth client was not found.
```

**Reason:** The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `backend/.env` file are still set to placeholder values.

---

## ✅ Follow These Steps Exactly

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Sign in with your Google account (afridi.shahid1643@gmail.com)

### Step 2: Create a New Project (or Select Existing)

1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Enter project name: **E-Prescription**
4. Click "CREATE"
5. Wait for project creation (takes ~10 seconds)
6. Make sure the new project is selected

### Step 3: Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen** (left sidebar)
2. Choose **External** user type
3. Click "CREATE"
4. Fill in required fields:
   - **App name**: E-Prescription
   - **User support email**: afridi.shahid1643@gmail.com
   - **Developer contact email**: afridi.shahid1643@gmail.com
5. Click "SAVE AND CONTINUE"
6. Skip "Scopes" (click "SAVE AND CONTINUE")
7. Add test user:
   - Click "ADD USERS"
   - Enter: afridi.shahid1643@gmail.com
   - Click "ADD"
8. Click "SAVE AND CONTINUE"
9. Review and click "BACK TO DASHBOARD"

### Step 4: Create OAuth 2.0 Client ID

1. Go to: **APIs & Services** → **Credentials** (left sidebar)
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure consent screen (already done in Step 3)
4. Choose **Application type**: Web application
5. Enter **Name**: E-Prescription Web Client
6. Under **Authorized JavaScript origins**, click "ADD URI":
   - Add: `http://localhost:5173`
   - Click "ADD URI" again
   - Add: `http://localhost:5001`
7. Under **Authorized redirect URIs**, click "ADD URI":
   - Add: `http://localhost:5001/api/auth/google/callback`
8. Click "CREATE"

### Step 5: Copy Your Credentials

A popup will show your credentials:

```
Your Client ID
123456789-abcdefghijklmnop.apps.googleusercontent.com

Your Client Secret  
GOCSPX-abc123def456ghi789
```

**IMPORTANT:** Keep this window open or copy these values immediately!

### Step 6: Update Your .env File

1. Open `backend/.env` in your code editor
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
```

**Use YOUR actual values from Step 5!**

### Step 7: Restart Your Backend Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm start
```

### Step 8: Test Again

1. Open http://localhost:5173
2. Click "Sign in with Google"
3. You should now see the Google login screen
4. Select your account: afridi.shahid1643@gmail.com
5. Click "Continue"
6. You'll be redirected back to your app ✅

---

## 🎯 Quick Checklist

Before testing, verify:

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Added yourself as test user
- [ ] Created OAuth 2.0 Client ID
- [ ] Added correct redirect URI: `http://localhost:5001/api/auth/google/callback`
- [ ] Copied Client ID to `.env`
- [ ] Copied Client Secret to `.env`
- [ ] Restarted backend server
- [ ] Frontend is running on http://localhost:5173

---

## 🐛 Still Getting Errors?

### "redirect_uri_mismatch"
**Fix:** Make sure you added exactly:
```
http://localhost:5001/api/auth/google/callback
```
(no trailing slash, no extra spaces)

### "Access blocked: This app's request is invalid"
**Fix:** Make sure you:
1. Configured OAuth consent screen
2. Added yourself as a test user
3. Saved all changes

### "invalid_client"
**Fix:** 
1. Double-check Client ID and Secret in `.env`
2. Make sure there are no extra spaces
3. Make sure you copied the complete values
4. Restart backend server after updating `.env`

---

## 📸 Visual Guide

If you need screenshots of each step, visit:
https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred

---

## ⚠️ Security Reminder

- **Never commit** your `.env` file to GitHub
- **Never share** your Client Secret publicly
- For production, create separate credentials with HTTPS URLs

---

**Ready?** Follow steps 1-8 above, then test your Google login! 🚀