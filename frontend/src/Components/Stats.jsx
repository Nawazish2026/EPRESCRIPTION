// src/components/Stats.jsx
import React from 'react';
import { Pill, TrendingUp, Shield, Star, Clock, Sparkles, User, Heart } from 'lucide-react';

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2"><Pill className="w-8 h-8 opacity-80" /><TrendingUp className="w-5 h-5" /></div>
        <p className="text-3xl font-bold mb-1">5,000+</p>
        <p className="text-blue-100 text-sm">Medicines Available</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2"><Shield className="w-8 h-8 opacity-80" /><Star className="w-5 h-5" /></div>
        <p className="text-3xl font-bold mb-1">100%</p>
        <p className="text-purple-100 text-sm">Verified Products</p>
      </div>

      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2"><User className="w-8 h-8 opacity-80" /><Heart className="w-5 h-5" /></div>
        <p className="text-3xl font-bold mb-1">50K+</p>
        <p className="text-pink-100 text-sm">Happy Customers</p>
      </div>

      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2"><Clock className="w-8 h-8 opacity-80" /><Sparkles className="w-5 h-5" /></div>
        <p className="text-3xl font-bold mb-1">24/7</p>
        <p className="text-cyan-100 text-sm">Support Available</p>
      </div>
    </div>
  );
}
