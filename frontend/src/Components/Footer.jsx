// src/components/Footer.jsx
import React from 'react';
import { Heart, Mail, Phone, MapPin, Pill, ArrowUpRight, Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { ref: footerRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <footer ref={footerRef} className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 mt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter CTA */}
        <div className={`mb-16 p-8 md:p-10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl border border-white/10 backdrop-blur-sm ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 font-medium">Get the latest healthcare updates and medicine information</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 bg-white/10 border border-white/20 rounded-l-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-r-2xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95">
                <Send className="w-5 h-5" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 stagger-children">
          {/* Brand */}
          <div className={isVisible ? 'reveal-visible' : 'reveal-hidden'} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">E-Prescription</h3>
                <p className="text-xs text-gray-400">Smart Healthcare</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted digital healthcare companion for modern medicine management and patient care.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-transparent group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={isVisible ? 'reveal-visible' : 'reveal-hidden'} style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'Browse Medicines', 'My Prescriptions', 'Contact Support'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className={isVisible ? 'reveal-visible' : 'reveal-hidden'} style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={isVisible ? 'reveal-visible' : 'reveal-hidden'} style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
              Contact Us
            </h4>
            <div className="space-y-4">
              <a href="mailto:info@eprescription.com" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-gray-400 group-hover:text-cyan-400 transition-colors">info@eprescription.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-gray-400 group-hover:text-emerald-400 transition-colors">+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400">123 Health St, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-2">
              © {currentYear} E-Prescription. Made with
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              for healthcare
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
