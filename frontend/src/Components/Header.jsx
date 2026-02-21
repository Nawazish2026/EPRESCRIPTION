// src/Components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Pill, LogOut, ShoppingCart, Menu, X, Home, User, Settings, Sparkles, Activity, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-black/50 border-b border-gray-200/50 dark:border-gray-800'
          : 'bg-transparent border-b border-transparent py-2'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div
            onClick={() => handleNavigation('/home')}
            className="cursor-pointer flex-shrink-0 group flex items-center gap-3 relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-500 scale-90 group-hover:scale-110"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-500 group-hover:rotate-6">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white transform group-hover:-rotate-12 transition-transform duration-500" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300">
                E-Rx
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest -mt-1 group-hover:text-cyan-500 transition-colors">Healthcare AI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <nav className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <button
                onClick={() => handleNavigation('/home')}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive('/home')
                    ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-md shadow-gray-200 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <Home className={`w-4 h-4 ${isActive('/home') ? 'animate-bounce-gentle' : ''}`} />
                Dashboard
              </button>

              <button
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 text-gray-400 dark:text-gray-500 cursor-not-allowed`}
              >
                <Activity className="w-4 h-4" />
                Analytics
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </button>
            </nav>

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => handleNavigation('/cart')}
                className="relative group p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                <div className={`transition-transform duration-300 ${cartCount > 0 ? 'group-hover:scale-110' : ''}`}>
                  <ShoppingCart className={`w-5 h-5 ${isActive('/cart') ? 'text-cyan-600 fill-cyan-100 dark:fill-cyan-900' : 'text-gray-500 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                    }`} />
                </div>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-lg shadow-red-500/30 border-2 border-white dark:border-gray-900">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative group">
                <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
                    <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-none">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-1">Free Plan</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1"></div>
                </button>

                {/* Minimal Dropdown for Logout */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => handleNavigation('/cart')}
              className="relative p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 block"></span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        style={{ top: '64px' }}
      >
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
              <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.name || 'Hello, User'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back!</p>
            </div>
          </div>

          <div className="grid gap-2">
            <button
              onClick={() => handleNavigation('/home')}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${isActive('/home')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Home className="w-5 h-5" />
              Home Dashboard
            </button>

            <button
              onClick={() => handleNavigation('/cart')}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${isActive('/cart')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                )}
              </div>
              My Cart {cartCount > 0 && `(${cartCount})`}
            </button>

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-4 w-full p-4 rounded-2xl font-bold bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
