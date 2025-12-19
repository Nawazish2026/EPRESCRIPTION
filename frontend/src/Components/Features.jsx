// src/components/Features.jsx
import React from 'react';
import { Shield, Clock, Heart, ChevronRight, Lock, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Medicines',
      description: 'All medicines verified and approved by health authorities ensuring your safety and authenticity',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      title: 'Quick Access',
      description: 'Get instant access to comprehensive medicine information anytime, anywhere with one click',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Heart,
      title: 'Patient Care',
      description: 'Personalized prescriptions designed with patient safety and wellness as our priority',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Lock,
      title: 'Secure Data',
      description: 'Enterprise-grade encryption protecting patient data and medical information',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Smart Search',
      description: 'Advanced search with AI-powered recommendations for accurate medicine discovery',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Heart,
      title: 'Support 24/7',
      description: 'Round-the-clock customer support for all your medical queries and concerns',
      color: 'from-red-500 to-red-600'
    },
  ];

  return (
    <div className="py-16 mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">Why Choose E-Prescription</h2>
      <p className="text-gray-600 text-center mb-16 text-lg max-w-2xl mx-auto">The most trusted digital healthcare platform for modern medicine management</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-gray-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <a href="#" className="inline-flex items-center text-gray-900 font-semibold group-hover:text-cyan-600 transition duration-300">
                Learn more <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
