
// src/Components/OAuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    // If opened in a popup (via GoogleButton), send token to parent and close
    if (window.opener && token) {
      window.opener.postMessage({ type: 'OAUTH_SUCCESS', token }, window.location.origin);
      window.close();
      return;
    }

    const fetchUser = async (authToken) => {
      try {
        setStatus('processing');
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        login(authToken, response.data.user);
        setStatus('success');
        // Delay navigation to show success message
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1500);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setError('Failed to fetch user profile');
        setStatus('error');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    if (token) {
      fetchUser(token);
    } else {
      setError('No authentication token received');
      setStatus('error');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }
  }, [searchParams, login, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we verify your Google account</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Authentication Successful!</h2>
            <p className="text-gray-600">Welcome to E-Prescription! Redirecting you to the dashboard...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'There was an error during authentication'}</p>
            <p className="text-sm text-gray-500">You will be redirected back to login shortly...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default OAuthCallback;
