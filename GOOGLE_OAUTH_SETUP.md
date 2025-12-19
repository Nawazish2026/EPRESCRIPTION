# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add the following:
     - **Name**: E-Prescription App
     - **Authorized JavaScript origins**: 
       - `http://localhost:5173` (frontend)
       - `http://localhost:5001` (backend)
     - **Authorized redirect URIs**: 
       - `http://localhost:5001/api/auth/google/callback`
   - Click "Create"

5. Copy your credentials:
   - You'll get a **Client ID** and **Client Secret**
   - Keep these safe!

## Step 2: Update Backend Environment Variables

1. Open `backend/.env`
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```

## Step 3: Test the Setup

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173
4. Click "Sign up with Gmail" or "Sign in with Gmail"
5. You should be redirected to Google's login page
6. After authentication, you'll be redirected back to your app

## How It Works

1. User clicks "Continue with Google" button
2. Frontend redirects to `http://localhost:5001/api/auth/google`
3. Backend redirects to Google's OAuth consent screen
4. User authenticates with Google
5. Google redirects back to `http://localhost:5001/api/auth/google/callback`
6. Backend:
   - Verifies the user with Google
   - Creates or finds user in database
   - Generates JWT token
   - Redirects to frontend with token in URL
7. Frontend:
   - Extracts token from URL
   - Stores token in localStorage
   - Redirects to home page

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for production
- For production, update the authorized origins and redirect URIs in Google Console
- Consider using HTTPS in production

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Console exactly matches `http://localhost:5001/api/auth/google/callback`

**Error: "Access blocked: This app's request is invalid"**
- Make sure you've enabled the Google+ API
- Check that your OAuth consent screen is configured

**Token not being saved**
- Check browser console for errors
- Verify the frontend is running on http://localhost:5173