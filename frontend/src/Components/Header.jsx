// src/components/Header.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pill, Bell, Heart, LogOut, User, Settings, ChevronDown, ShoppingCart, Menu, X } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout, onNavigate, hasNotifications = true }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // useMemo will prevent recalculating these values on every render
  const { doctorName, initials } = useMemo(() => {
    const name = user?.name || 'Doctor';
    const nameParts = name.split(' ');
    const calculatedInitials =
      (nameParts.length > 1
        ? nameParts.map((n) => n[0]).join('')
        : name.slice(0, 2)
      ).toUpperCase() || 'DR';
    return { doctorName: name, initials: calculatedInitials };
  }, [user?.name]);

  // Effect to handle closing the dropdown on outside clicks or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      // Close dropdown if Escape key is pressed
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/home');
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={handleHomeClick} 
            className="cursor-pointer flex-shrink-0 group"
          >
            <h1 className="text-3xl font-black gradient-text group-hover:opacity-80 transition-opacity">
              E-Rx
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:gradient-text font-bold text-lg transition-all duration-300 hover:scale-110"
            >
              Home
            </button>

            <button
              onClick={handleCartClick}
              className="relative group"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <ShoppingCart className="w-6 h-6 text-cyan-600" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse-gentle shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-gray-200 space-y-3 animate-slideIn">
            <button
              onClick={handleHomeClick}
              className="block w-full text-left px-4 py-3 hover:bg-cyan-100 rounded-lg transition-all font-semibold text-gray-800"
            >
              Home
            </button>
            <button
              onClick={handleLogoutClick}
              className="block w-full text-left px-4 py-3 hover:bg-red-100 rounded-lg transition-all font-semibold text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
