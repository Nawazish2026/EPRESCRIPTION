// src/components/Features.jsx
import React, { useRef, useCallback } from 'react';
import { Shield, Clock, Heart, Lock, Zap, ArrowUpRight, Cpu, HeartHandshake } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Features() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  const features = [
    {
      icon: Shield,
      title: 'Verified Medicines',
      description: 'All medicines verified and approved by health authorities ensuring your safety and authenticity',
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      glowColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
      icon: Clock,
      title: 'Quick Access',
      description: 'Get instant access to comprehensive medicine information anytime, anywhere with one click',
      gradient: 'from-cyan-500 to-teal-600',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      glowColor: 'rgba(6, 182, 212, 0.15)',
    },
    {
      icon: HeartHandshake,
      title: 'Patient Care',
      description: 'Personalized prescriptions designed with patient safety and wellness as our priority',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
      glowColor: 'rgba(236, 72, 153, 0.15)',
    },
    {
      icon: Lock,
      title: 'Secure Data',
      description: 'Enterprise-grade encryption protecting patient data and medical information',
      gradient: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      glowColor: 'rgba(139, 92, 246, 0.15)',
    },
    {
      icon: Cpu,
      title: 'Smart Search',
      description: 'Advanced search with AI-powered recommendations for accurate medicine discovery',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      glowColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      icon: Heart,
      title: 'Support 24/7',
      description: 'Round-the-clock customer support for all your medical queries and concerns',
      gradient: 'from-red-500 to-rose-600',
      iconBg: 'bg-red-500/10 dark:bg-red-500/20',
      glowColor: 'rgba(239, 68, 68, 0.15)',
    },
  ];

  return (
    <div ref={sectionRef} className="py-16 mb-16">
      {/* Section Header */}
      <div className={`text-center mb-16 ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 px-5 py-2.5 rounded-full mb-6 border border-cyan-100 dark:border-cyan-800">
          <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Why Choose Us</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Why Choose{' '}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            E-Prescription
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          The most trusted digital healthcare platform for modern medicine management
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index, isVisible }) {
  const cardRef = useRef(null);
  const Icon = feature.icon;

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`feature-card group dark:bg-gray-800 dark:border-gray-700 ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.3s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient top border on hover */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl`}></div>

      {/* Glow effect behind card on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{ boxShadow: `0 20px 60px -15px ${feature.glowColor}` }}
      ></div>

      {/* Icon */}
      <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
        <Icon className="w-8 h-8 text-white" />
        {/* Floating particles */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" style={{ animationDelay: '0.3s' }}></div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors duration-300">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

      <a href="#" className="inline-flex items-center text-gray-700 dark:text-gray-300 font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all duration-300">
        Learn more
        <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
      </a>
    </div>
  );
}
