
// src/components/GoogleButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function GoogleButton({ text = 'Continue with Google' }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    // Create a popup window for Google OAuth to avoid page redirect
    const popup = window.open(
      `${API_BASE_URL}/auth/google`,
      'google-oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from the popup
    const messageListener = (event) => {
      // Verify origin for security
      const targetOrigin = new URL(API_BASE_URL, window.location.origin).origin;
      if (event.origin !== targetOrigin && event.origin !== window.location.origin) {
        return;
      }

      // Handle the OAuth success/failure
      if (event.data.type === 'OAUTH_SUCCESS') {
        popup.close();
        // Fetch user profile and redirect to home
        api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${event.data.token}` }
        }).then(response => {
          login(event.data.token, response.data.user);
          navigate('/home');
        }).catch(error => {
          console.error('Failed to fetch user profile', error);
        });
      } else if (event.data.type === 'OAUTH_ERROR') {
        popup.close();
        console.error('OAuth error:', event.data.error);
        alert('Google authentication failed. Please try again.');
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className="font-bold text-gray-700">{text}</span>
    </button>
  );
}
