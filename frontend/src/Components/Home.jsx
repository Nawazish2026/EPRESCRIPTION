// src/Components/Home.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SmartDashboard from './SmartDashboard';
import Stats from './Stats';
import Features from './Features';
import MedicineCard from './MedicineCard';
import Footer from './Footer';
import { Search, Loader, AlertCircle, Zap, Sparkles, Heart, Shield, Award } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Home({ searchQuery, onSearch, medicines, isSearching, searchError }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [localIsSearching, setLocalIsSearching] = useState(false);
  const [localMedicines, setLocalMedicines] = useState(medicines);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setLocalSearchQuery(value);

    if (!value || value.trim().length < 2) {
      setLocalMedicines([]);
      if (onSearch) onSearch('');
      return;
    }

    setLocalIsSearching(true);
    try {
      const response = await api.get(`/medicines/search?q=${encodeURIComponent(value)}`);
      if (response.data.success) {
        setLocalMedicines(response.data.data);
        if (onSearch) onSearch(value, response.data.data);
      }
    } catch (err) {
      console.error('Search error:', err);
      setLocalMedicines([]);
    } finally {
      setLocalIsSearching(false);
    }
  };

  const displayMedicines = localMedicines.length > 0 ? localMedicines : medicines;
  const displayIsSearching = localIsSearching || isSearching;
  const displaySearchQuery = localSearchQuery || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {user && <SmartDashboard />}

      <main>
        {/* Enhanced Hero Search Section */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full blur-3xl animate-float-slow"></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute top-40 left-40 w-32 h-32 border-2 border-white/20 rounded-full animate-rotate-slow"></div>
            <div className="absolute bottom-40 right-40 w-24 h-24 border-2 border-white/20 transform rotate-45 animate-bounce-gentle"></div>
            <div className="absolute top-2/3 left-1/4 w-20 h-20 bg-white/10 rounded-lg animate-pulse-slow"></div>
            <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full animate-pulse-slow"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32">
            {/* Enhanced Hero Content */}
            <div className="text-center mb-16 animate-fadeInUp">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full mb-8 border border-white/20">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-semibold text-white/90">Trusted by 10,000+ Healthcare Professionals</span>
                <Award className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-fadeInUp">
                  Smart Medicine
                </span>
                <span className="block bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 bg-clip-text text-transparent animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  Discovery
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                Access our comprehensive database of verified medicines with AI-powered recommendations,
                complete drug interactions, and personalized healthcare insights.
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  <Shield className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">FDA Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  <Heart className="w-5 h-5 text-red-300" />
                  <span className="text-sm font-medium">Doctor Approved</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Instant Search</span>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2">
                  <div className="flex items-center">
                    <div className="flex items-center gap-4 px-6 py-4 flex-1">
                      <Search className="w-8 h-8 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search medicines by name, composition, or manufacturer..."
                        value={query}
                        onChange={handleSearch}
                        className="w-full text-lg text-gray-900 placeholder-gray-500 bg-transparent outline-none font-medium"
                      />
                    </div>
                    <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-white/70 text-sm font-medium">Popular:</span>
                {['Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch({ target: { value: suggestion } });
                    }}
                    className="text-sm bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-white/90"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section for Non-Authenticated Users */}
        {!user && (
          <div className="relative bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-emerald-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 py-20 px-4 mx-4 mt-16 rounded-3xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 bg-white/50 dark:bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full mb-8 border border-white/60 dark:border-white/20">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-gray-800 dark:text-white">Unlock Premium Features</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Advanced Healthcare
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Analytics
                </span>
              </h2>

              <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
                Join thousands of healthcare professionals using our platform for prescription management,
                drug interaction checking, and patient care optimization.
              </p>

              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">50K+</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Medicines</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">10K+</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">1M+</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Prescriptions</div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '#signup'}
                className="btn-premium text-xl px-12 py-6"
              >
                Start Free Trial
                <Sparkles className="w-6 h-6 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Stats Section */}
          <div className="animate-fadeInUp">
            <Stats />
          </div>

          {/* Loading State */}
          {displayIsSearching && (
            <div className="flex flex-col justify-center items-center py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border-2 border-gray-100 dark:border-gray-700 animate-scaleIn">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-cyan-600 absolute top-0 left-0"></div>
              </div>
              <div className="mt-8 text-center">
                <Loader className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
                <span className="text-2xl text-gray-700 dark:text-white font-bold">Searching Medicines</span>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Finding the best matches for you...</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {!displayIsSearching && displayMedicines.length > 0 && (
            <div className="animate-fadeInUp">
              <div className="text-center mb-16">
                <h2 className="section-title dark:text-gray-200">
                  {displaySearchQuery ? `Results for "${displaySearchQuery}"` : 'Available Medicines'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold">{displayMedicines.length} medicines found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayMedicines.map((medicine, index) => (
                  <div
                    key={medicine._id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MedicineCard medicine={medicine} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results State */}
          {!displayIsSearching && displaySearchQuery && displayMedicines.length === 0 && (
            <div className="text-center py-32 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border-3 border-red-200 dark:border-red-900/50 shadow-lg animate-fadeInUp">
              <div className="relative">
                <AlertCircle className="w-32 h-32 text-red-500 mx-auto mb-8 animate-bounce-gentle" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-300 font-bold text-sm">!</span>
                </div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">No medicines found</h3>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-8 max-w-md mx-auto">
                We couldn't find any medicines matching "{displaySearchQuery}".
                Try searching with different keywords or check the spelling.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    setQuery('');
                    setLocalMedicines([]);
                    setLocalSearchQuery('');
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border border-gray-300 dark:border-gray-600"
                >
                  Browse All Medicines
                </button>
              </div>
            </div>
          )}

          {/* Default Empty State */}
          {!displaySearchQuery && displayMedicines.length === 0 && !displayIsSearching && (
            <div className="text-center py-32 animate-fadeInUp">
              <div className="relative mb-8">
                <Search className="w-32 h-32 text-gray-300 dark:text-gray-700 mx-auto" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-4">Start Your Medicine Search</h3>
              <p className="text-gray-500 dark:text-gray-500 text-xl mb-8 max-w-md mx-auto">
                Use the search bar above to find medicines by name, composition, or manufacturer
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setQuery('Paracetamol')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Try Paracetamol
                </button>
                <button
                  onClick={() => setQuery('Aspirin')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Try Aspirin
                </button>
              </div>
            </div>
          )}

          {/* Features Section */}
          {!displaySearchQuery && (
            <div className="mt-32 animate-fadeInUp">
              <Features />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
