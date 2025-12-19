// src/Components/MedicineCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { IndianRupee, FlaskConical, AlertTriangle, Plus, Minus, Sparkles, Star, Shield, Heart, Eye } from 'lucide-react';

const MedicineCard = ({ medicine }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const itemInCart = cartItems.find(item => item._id === medicine._id);

  // Generate a consistent color scheme based on medicine name
  const getColorScheme = (name) => {
    const colors = [
      { bg: 'from-emerald-400 to-teal-600', text: 'text-emerald-600', border: 'border-emerald-200' },
      { bg: 'from-blue-400 to-indigo-600', text: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'from-purple-400 to-violet-600', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'from-pink-400 to-rose-600', text: 'text-pink-600', border: 'border-pink-200' },
      { bg: 'from-amber-400 to-orange-600', text: 'text-amber-600', border: 'border-amber-200' },
      { bg: 'from-cyan-400 to-blue-600', text: 'text-cyan-600', border: 'border-cyan-200' },
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const colorScheme = getColorScheme(medicine.name);
  const isLowStock = Math.random() > 0.8; // Simulate low stock for some medicines

  return (
    <div className="medicine-card group relative">
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-10 badge-premium animate-fadeInUp">
        <Sparkles className="w-3 h-3 mr-1" />
        Premium
      </div>

      {/* Low Stock Warning */}
      {isLowStock && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          Limited Stock
        </div>
      )}

      {/* Header with Dynamic Gradient */}
      <div className={`bg-gradient-to-br ${colorScheme.bg} text-white p-6 flex-shrink-0 group-hover:shadow-2xl transition-all relative overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-black text-xl text-white line-clamp-2 group-hover:text-cyan-100 transition-colors leading-tight" title={medicine.name}>
                {medicine.name}
              </h3>
              <p className="text-white/80 text-sm mt-2 font-medium">{medicine.manufacturer}</p>
            </div>
            <button className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 group/btn">
              <Eye className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
              ))}
            </div>
            <span className="text-xs text-white/80 font-medium">(4.8)</span>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 mb-6 flex-1">
          {/* Composition Card */}
          <div className={`bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 ${colorScheme.border} hover:shadow-lg transition-all transform hover:scale-105 duration-300`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-gradient-to-br ${colorScheme.bg} rounded-xl shadow-md`}>
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Active Ingredient</p>
                <p className="text-sm text-gray-900 line-clamp-2 font-semibold leading-relaxed">{medicine.composition}</p>
              </div>
            </div>
          </div>

          {/* Side Effects Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all transform hover:scale-105 duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Precautions</p>
                <p className="text-sm text-gray-900 line-clamp-2 font-semibold leading-relaxed">
                  {medicine.side_effects || 'Consult your doctor before use'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-green-800">Verified</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-xl border border-red-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-red-800">Safe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-5 rounded-2xl border-2 border-gray-200 group-hover:border-cyan-300 transition-all mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Price</p>
              <div className="flex items-center gap-2">
                <IndianRupee className={`w-6 h-6 ${colorScheme.text}`} />
                <span className={`font-black text-3xl ${colorScheme.text}`}>
                  {medicine.price ? medicine.price.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold text-gray-700">4.8</span>
              </div>
            </div>
          </div>

          {/* Quantity Controls or Add to Cart */}
          <div className="w-full">
            {itemInCart ? (
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 border-2 border-cyan-400 rounded-2xl p-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => updateQuantity(medicine._id, itemInCart.quantity - 1)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-all transform hover:scale-125 active:scale-95"
                    disabled={itemInCart.quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="px-4 py-2 font-black text-white text-lg bg-white/20 rounded-lg inline-block min-w-[3rem]">
                      {itemInCart.quantity}
                    </span>
                    <p className="text-xs text-white/80 mt-1">
                      ₹{(itemInCart.price * itemInCart.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => updateQuantity(medicine._id, itemInCart.quantity + 1)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-all transform hover:scale-125 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => addToCart(medicine)}
                disabled={isLowStock}
                className={`w-full bg-gradient-to-r ${colorScheme.bg} text-white font-black px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg ${
                  isLowStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                {isLowStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-white/80 hover:bg-white text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border border-gray-200">
              Details
            </button>
            <button className="flex-1 bg-white/80 hover:bg-white text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border border-gray-200">
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
    </div>
  );
};

export default MedicineCard;

