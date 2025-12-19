// src/components/Footer.jsx
import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              E-Prescription
            </h3>
            <p className="text-gray-400 mb-6">Your trusted digital healthcare companion for modern medicine management.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Home</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Browse Medicines</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">My Prescriptions</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition duration-300">Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <a href="mailto:info@eprescription.com" className="hover:text-cyan-400 transition">info@eprescription.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400" />
                <a href="tel:+1234567890" className="hover:text-cyan-400 transition">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>123 Health St, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 E-Prescription. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
