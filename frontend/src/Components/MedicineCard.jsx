// src/Components/MedicineCard.jsx
import React, { useState, useCallback, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { IndianRupee, FlaskConical, AlertTriangle, Plus, Minus, Sparkles, Star, Shield, Heart, Package, Building2, ShoppingCart, Check } from 'lucide-react';

const MedicineCard = ({ medicine }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const itemInCart = cartItems.find(item => item._id === medicine._id);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const cardRef = useRef(null);

  // Generate a consistent color scheme based on medicine name
  const getColorScheme = (name) => {
    const colors = [
      { bg: 'from-emerald-500 to-teal-600', light: 'from-emerald-50 to-teal-50', darkLight: 'from-emerald-900/40 to-teal-900/40', text: 'text-emerald-600', darkText: 'text-emerald-400', accent: 'emerald', glow: 'rgba(16, 185, 129, 0.2)' },
      { bg: 'from-blue-500 to-indigo-600', light: 'from-blue-50 to-indigo-50', darkLight: 'from-blue-900/40 to-indigo-900/40', text: 'text-blue-600', darkText: 'text-blue-400', accent: 'blue', glow: 'rgba(59, 130, 246, 0.2)' },
      { bg: 'from-violet-500 to-purple-600', light: 'from-violet-50 to-purple-50', darkLight: 'from-violet-900/40 to-purple-900/40', text: 'text-violet-600', darkText: 'text-violet-400', accent: 'violet', glow: 'rgba(139, 92, 246, 0.2)' },
      { bg: 'from-rose-500 to-pink-600', light: 'from-rose-50 to-pink-50', darkLight: 'from-rose-900/40 to-pink-900/40', text: 'text-rose-600', darkText: 'text-rose-400', accent: 'rose', glow: 'rgba(244, 63, 94, 0.2)' },
      { bg: 'from-amber-500 to-orange-600', light: 'from-amber-50 to-orange-50', darkLight: 'from-amber-900/40 to-orange-900/40', text: 'text-amber-600', darkText: 'text-amber-400', accent: 'amber', glow: 'rgba(245, 158, 11, 0.2)' },
      { bg: 'from-cyan-500 to-blue-600', light: 'from-cyan-50 to-blue-50', darkLight: 'from-cyan-900/40 to-blue-900/40', text: 'text-cyan-600', darkText: 'text-cyan-400', accent: 'cyan', glow: 'rgba(6, 182, 212, 0.2)' },
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const colorScheme = getColorScheme(medicine.name);

  const handleAddToCart = (e) => {
    // Ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple-effect';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    addToCart(medicine);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // 3D tilt on hover
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col border border-gray-100 dark:border-gray-700 hover:border-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.4s ease, border-color 0.3s ease',
      }}
    >
      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 -z-10"
        style={{
          boxShadow: isHovered ? `0 25px 60px -15px ${colorScheme.glow}` : 'none',
          opacity: isHovered ? 1 : 0
        }}
      ></div>

      {/* Premium Badge */}
      <div className={`absolute top-4 right-4 z-20 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-80'}`}>
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span>Premium</span>
        </div>
      </div>

      {/* Header with Dynamic Gradient */}
      <div className={`relative bg-gradient-to-br ${colorScheme.bg} text-white p-6 overflow-hidden`}>
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full transition-transform duration-700 group-hover:scale-125"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>

        {/* Shimmer overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}></div>

        {/* Medicine Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {medicine.type || 'Allopathy'}
          </span>
        </div>

        <div className="relative z-10 pt-6">
          {/* Medicine Name */}
          <h3 className="font-black text-xl text-white leading-tight line-clamp-2 mb-2 group-hover:text-white/90 transition-colors">
            {medicine.name}
          </h3>

          {/* Manufacturer */}
          <div className="flex items-center gap-2 text-white/80">
            <Building2 className="w-4 h-4" />
            <p className="text-sm font-medium line-clamp-1">{medicine.manufacturer || 'Unknown Manufacturer'}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 transition-all duration-300 ${i < 4 ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'} ${isHovered && i < 4 ? 'scale-110' : 'scale-100'}`} style={{ transitionDelay: `${i * 50}ms` }} />
              ))}
            </div>
            <span className="text-xs text-white/70 font-medium">(4.5)</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col gap-4 dark:bg-gray-800">
        {/* Composition */}
        {medicine.composition && (
          <div className={`bg-gradient-to-br ${colorScheme.light} dark:${colorScheme.darkLight} p-4 rounded-2xl border border-${colorScheme.accent}-100 dark:border-${colorScheme.accent}-900/30 transition-all duration-300 group-hover:shadow-md`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 bg-gradient-to-br ${colorScheme.bg} rounded-xl shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Composition</p>
                <p className={`text-sm ${colorScheme.text} dark:${colorScheme.darkText} font-semibold line-clamp-2`}>{medicine.composition}</p>
              </div>
            </div>
          </div>
        )}

        {/* Packaging Info */}
        {medicine.packaging && (
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-xl border border-transparent dark:border-gray-700 transition-colors duration-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-700/70">
            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{medicine.packaging}</span>
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-transform duration-300 group-hover:scale-105">
            <Shield className="w-3.5 h-3.5" />
            Verified
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-transform duration-300 group-hover:scale-105">
            <Heart className="w-3.5 h-3.5" />
            Safe
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price & Actions */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-700/50 dark:to-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-600">
          {/* Price Display */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{medicine.price ? medicine.price.toFixed(0) : '0'}</span>
                {medicine.price && <span className="text-sm text-gray-400 dark:text-gray-500 line-through">₹{(medicine.price * 1.2).toFixed(0)}</span>}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold">20% OFF</span>
            </div>
          </div>

          {/* Add to Cart / Quantity Controls */}
          {itemInCart ? (
            <div className={`bg-gradient-to-r ${colorScheme.bg} rounded-2xl p-1 shadow-lg`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => updateQuantity(medicine._id, itemInCart.quantity - 1)}
                  className="p-3 text-white hover:bg-white/20 rounded-xl transition-all active:scale-90"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center">
                  <span className="font-black text-xl text-white">{itemInCart.quantity}</span>
                  <p className="text-xs text-white/70 mt-0.5">in cart</p>
                </div>
                <button
                  onClick={() => updateQuantity(medicine._id, itemInCart.quantity + 1)}
                  className="p-3 text-white hover:bg-white/20 rounded-xl transition-all active:scale-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`ripple-container w-full bg-gradient-to-r ${colorScheme.bg} text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-95 ${justAdded ? 'animate-pulse' : ''}`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
