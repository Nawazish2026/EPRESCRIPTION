// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { Pill, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader, Sparkles } from 'lucide-react';
import GoogleButton from './GoogleButton';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './forms.css';

const InputField = ({ icon, type, value, onChange, placeholder }) => (
  <div className="relative">
    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
      value 
        ? 'text-cyan-500 scale-110' 
        : 'text-gray-400 scale-100'
    } w-5 h-5 z-10`}>
      {icon}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full pl-12 pr-4 py-5 border-2 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 ${
        value 
          ? 'border-cyan-400 shadow-lg shadow-cyan-100 bg-white' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      placeholder={placeholder}
    />
    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ${
      value ? 'w-full' : 'w-0'
    }`}></div>
  </div>
);

export default function LoginForm({ onGotoSignup }) {
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = { password };
      if (loginMethod === 'email') {
        payload.email = email;
      } else {
        payload.phone = phone;
      }
      const response = await api.post('/auth/login', payload);
      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #06b6d4 2px, transparent 2px),
                           radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px),
                           radial-gradient(circle at 40% 60%, #ec4899 2px, transparent 2px),
                           radial-gradient(circle at 60% 30%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '80px 80px, 120px 120px, 100px 100px, 60px 60px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-float"></div>
      <div className="absolute bottom-32 left-16 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-25 blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-40 left-40 w-24 h-24 border-2 border-cyan-300 rounded-full opacity-30 animate-spin" style={{animationDuration: '20s'}}></div>
      <div className="absolute bottom-40 right-40 w-16 h-16 border-2 border-purple-300 transform rotate-45 opacity-40 animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-300 to-cyan-300 rounded-lg opacity-20 blur-lg animate-bounce" style={{animationDelay: '3s'}}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Elegant Glass Card */}

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur opacity-25 hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 transform hover:scale-105 transition-all duration-500">
              
              {/* Logo with Enhanced Animation */}
              <div className="text-center mb-10">

                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl mb-6 shadow-2xl transform hover:rotate-12 hover:scale-110 transition-all duration-500">
                  <div className="relative">
                    <Pill className="w-10 h-10 text-white" />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg font-medium">Sign in to your healthcare account</p>
              </div>

              {/* Enhanced Tab Toggle */}
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 mb-8 shadow-inner">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-500 ${
                    loginMethod === 'email'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-500 ${
                    loginMethod === 'phone'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </button>
              </div>

              {/* Enhanced Form Fields */}
              <div className="space-y-6 mb-8">
                {loginMethod === 'email' ? (

                  <InputField
                    icon={<Mail />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <InputField
                    icon={<Phone />}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                )}



                <div className="relative">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    password 
                      ? 'text-cyan-500 scale-110' 
                      : 'text-gray-400 scale-100'
                  } w-5 h-5 z-10`}>
                    <Lock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-16 py-5 border-2 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 ${
                      password 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-100 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ${
                    password ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>

              {/* Enhanced Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              {/* Enhanced Sign In Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mb-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-6 h-6" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              {/* Enhanced Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 bg-white/90 text-gray-500 text-sm font-bold rounded-full">or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <GoogleButton text="Sign in with Google" />

              {/* Enhanced Sign Up Link */}
              <p className="mt-8 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onGotoSignup}
                  className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 underline decoration-2 decoration-cyan-400 hover:decoration-cyan-600"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
