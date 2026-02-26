// src/components/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { Pill, User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Loader, CheckCircle, Sparkles, Building2 } from 'lucide-react';
import GoogleButton from './GoogleButton';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './forms.css';

const InputField = ({ icon, type, value, onChange, placeholder, hasValidation, fieldKey }) => (
  <div className="relative group">
    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${value
      ? 'text-purple-500 scale-110'
      : 'text-gray-400 scale-100'
      } w-5 h-5 z-10`}>
      {icon}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full pl-12 pr-12 py-3 border-2 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 ${value
        ? 'border-purple-400 shadow-lg shadow-purple-100 bg-white'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
      placeholder={placeholder}
    />
    {/* Animated underline */}
    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ${value ? 'w-full' : 'w-0'
      }`}></div>
    {/* Validation indicator */}
    {hasValidation !== undefined && value && (
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        {hasValidation ? (
          <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
        ) : (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>
    )}
  </div>
);

export default function SignupForm({ onGotoLogin }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [role, setRole] = useState('doctor');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { name, email, phone, password, role });
      login(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #a855f7 2px, transparent 2px),
                           radial-gradient(circle at 80% 80%, #ec4899 2px, transparent 2px),
                           radial-gradient(circle at 40% 60%, #8b5cf6 2px, transparent 2px),
                           radial-gradient(circle at 60% 30%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '80px 80px, 120px 120px, 100px 100px, 60px 60px'
        }}></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-2xl animate-float"></div>
      <div className="absolute bottom-32 left-16 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-25 blur-xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Geometric Shapes */}
      <div className="absolute top-40 left-40 w-24 h-24 border-2 border-purple-300 rounded-full opacity-30 animate-spin" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-40 right-40 w-16 h-16 border-2 border-pink-300 transform rotate-45 opacity-40 animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cyan-300 to-purple-300 rounded-lg opacity-20 blur-lg animate-bounce" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-3">
        <div className="w-full max-w-md">
          {/* Elegant Glass Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform group-hover:scale-[1.02] transition-all duration-500">

              {/* Enhanced Logo */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-2xl mb-3 shadow-2xl transform hover:rotate-12 hover:scale-110 transition-all duration-500 group">
                  <div className="relative">
                    <Pill className="w-7 h-7 text-white" />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  Create Account
                </h1>
                <p className="text-gray-600 text-sm font-medium">Join our healthcare community</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              {/* Enhanced Form Fields */}
              <div className="space-y-3 mb-4">

                <InputField
                  icon={<User />}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  hasValidation={name.length > 0}
                  fieldKey="name"
                />

                <InputField
                  icon={<Mail />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  hasValidation={isValidEmail(email)}
                  fieldKey="email"
                />

                <InputField
                  icon={<Phone />}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  hasValidation={isValidPhone(phone)}
                  fieldKey="phone"
                />

                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 text-purple-500 scale-110 w-5 h-5 z-10`}>
                    <Building2 />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-purple-400 shadow-lg shadow-purple-100 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white appearance-none cursor-pointer"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 w-full"></div>
                </div>


                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${password
                    ? 'text-purple-500 scale-110'
                    : 'text-gray-400 scale-100'
                    } w-5 h-5 z-10`}>
                    <Lock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-16 py-3 border-2 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 ${password
                      ? 'border-purple-400 shadow-lg shadow-purple-100 bg-white'
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
                  {password && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ${password ? 'w-full' : 'w-0'
                    }`}></div>
                </div>

                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${confirmPassword
                    ? 'text-purple-500 scale-110'
                    : 'text-gray-400 scale-100'
                    } w-5 h-5 z-10`}>
                    <Lock />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-16 py-3 border-2 rounded-2xl outline-none transition-all duration-500 text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 ${confirmPassword
                      ? 'border-purple-400 shadow-lg shadow-purple-100 bg-white'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {confirmPassword && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {password === confirmPassword && confirmPassword.length >= 6 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
                      ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ${confirmPassword ? 'w-full' : 'w-0'
                    }`}></div>
                </div>

                {/* Enhanced Terms Agreement */}
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 focus:ring-offset-0 mt-1 transform hover:scale-110 transition-transform"
                  />
                  <label className="text-sm text-gray-700 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="font-bold text-purple-600 hover:text-purple-700 transition-colors underline decoration-purple-300 hover:decoration-purple-600">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-bold text-purple-600 hover:text-purple-700 transition-colors underline decoration-purple-300 hover:decoration-purple-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !name || !email || !phone || !password || !agreedToTerms || password !== confirmPassword}
                className="w-full mb-4 bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-600 text-white py-3 rounded-2xl font-bold text-base hover:from-purple-600 hover:via-pink-700 hover:to-indigo-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-6 h-6" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              {/* Enhanced Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 bg-white/90 text-gray-500 text-sm font-bold rounded-full">or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <GoogleButton text="Sign up with Google" />

              {/* Enhanced Sign In Link */}
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => onGotoLogin && onGotoLogin()}
                  className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300 underline decoration-2 decoration-purple-400 hover:decoration-purple-600"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
