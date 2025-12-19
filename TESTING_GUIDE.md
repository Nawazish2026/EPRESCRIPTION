# Testing Guide - Authentication Flow

## Test Scenario 1: Email/Password Signup ✅

**Steps:**
1. Open http://localhost:5173
2. Click "Sign Up Free"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: password123
4. Click "Create Account"

**Expected Result:**
- ✅ User created in database
- ✅ JWT token generated
- ✅ Redirected to home page
- ✅ Token stored in localStorage

---

## Test Scenario 2: Email/Password Login ✅

**Steps:**
1. Open http://localhost:5173
2. Enter email and password from Scenario 1
3. Click "Sign In"

**Expected Result:**
- ✅ User authenticated
- ✅ JWT token generated
- ✅ Redirected to home page

---

## Test Scenario 3: Google OAuth Signup (NEW!) 🆕

**Prerequisites:** 
- Google OAuth credentials configured in `backend/.env`

**Steps:**
1. Open http://localhost:5173
2. Click "Sign up with Gmail"
3. Select your Google account
4. Grant permissions

**Expected Result:**
- ✅ Redirected to Google login
- ✅ After authentication, redirected back to app
- ✅ New user created with Google account
- ✅ JWT token generated
- ✅ Redirected to home page
- ✅ Token stored in localStorage

**Database Check:**
```javascript
{
  googleId: "1234567890",
  name: "John Doe",
  email: "john@gmail.com",
  password: undefined  // No password for Google users
}
```

---

## Test Scenario 4: Google OAuth Login (Existing User) 🆕

**Prerequisites:**
- User already signed up via Google (Scenario 3)

**Steps:**
1. Open http://localhost:5173
2. Click "Sign in with Gmail"
3. Select same Google account

**Expected Result:**
- ✅ User recognized by googleId
- ✅ JWT token generated
- ✅ Redirected to home page
- ✅ No duplicate user created

---

## Test Scenario 5: Account Linking 🆕

**Prerequisites:**
- User already signed up with email: john@gmail.com (Scenario 1)

**Steps:**
1. Open http://localhost:5173
2. Click "Sign in with Gmail"
3. Select Google account with same email: john@gmail.com

**Expected Result:**
- ✅ Existing user found by email
- ✅ Google account linked to existing user
- ✅ User's googleId updated in database
- ✅ JWT token generated
- ✅ Redirected to home page

**Database Check:**
```javascript
{
  googleId: "1234567890",  // ← Now has googleId
  name: "John Doe",
  email: "john@gmail.com",
  password: "$2b$10$..."    // ← Still has password
}
```

Now user can login with BOTH methods!

---

## Test Scenario 6: Multiple Regular Users ✅

**Steps:**
1. Sign up user1@example.com (email/password)
2. Sign up user2@example.com (email/password)
3. Sign up user3@example.com (email/password)

**Expected Result:**
- ✅ All users created successfully
- ✅ No duplicate key errors
- ✅ Each has googleId: null
- ✅ Sparse index allows multiple null values

---

## Verification Commands

### Check if user exists:
```bash
# In MongoDB shell or Compass
db.users.findOne({ email: "john@example.com" })
```

### Check token in browser:
```javascript
// In browser console
localStorage.getItem('authToken')
```

### Decode JWT token:
```javascript
// In browser console
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

---

## Common Issues & Solutions

### Issue: "E11000 duplicate key error"
**Solution:** ✅ Already fixed! Added `sparse: true` to googleId field

### Issue: "next is not a function"
**Solution:** ✅ Already fixed! Updated Mongoose pre-save hook

### Issue: "redirect_uri_mismatch"
**Solution:** Update Google Console with exact callback URL:
`http://localhost:5001/api/auth/google/callback`

### Issue: Token not saving after Google login
**Solution:** Check browser console, ensure frontend is on http://localhost:5173

---

## Success Indicators

After completing all scenarios, you should have:

1. ✅ Users can sign up with email/password
2. ✅ Users can sign up with Google
3. ✅ Users can log in with email/password
4. ✅ Users can log in with Google
5. ✅ Google accounts link to existing email accounts
6. ✅ Multiple regular users can coexist
7. ✅ JWT tokens work for all authentication methods
8. ✅ No duplicate key errors
9. ✅ Proper redirects after authentication
10. ✅ Tokens stored in localStorage

---

**Ready to test?** Start both servers and try each scenario! 🚀