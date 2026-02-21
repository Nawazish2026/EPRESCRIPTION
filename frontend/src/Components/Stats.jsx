// src/components/Stats.jsx
import React from 'react';
import { Pill, TrendingUp, Shield, Star, Clock, Sparkles, Users, Heart } from 'lucide-react';
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';

export default function Stats() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const stats = [
    {
      icon: Pill,
      secIcon: TrendingUp,
      value: '5000',
      suffix: '+',
      label: 'Medicines Available',
      gradient: 'from-blue-500 to-indigo-600',
      progressWidth: '85%',
    },
    {
      icon: Shield,
      secIcon: Star,
      value: '100',
      suffix: '%',
      label: 'Verified Products',
      gradient: 'from-purple-500 to-violet-600',
      progressWidth: '100%',
    },
    {
      icon: Users,
      secIcon: Heart,
      value: '50',
      suffix: 'K+',
      label: 'Happy Customers',
      gradient: 'from-pink-500 to-rose-600',
      progressWidth: '72%',
    },
    {
      icon: Clock,
      secIcon: Sparkles,
      value: '24',
      suffix: '/7',
      label: 'Support Available',
      gradient: 'from-cyan-500 to-teal-600',
      progressWidth: '95%',
    },
  ];

  return (
    <div ref={ref} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-children`}>
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} isVisible={isVisible} />
      ))}
    </div>
  );
}

function StatCard({ stat, index, isVisible }) {
  const Icon = stat.icon;
  const SecIcon = stat.secIcon;
  const displayValue = useCountUp(stat.value, isVisible, 1800, stat.suffix);

  return (
    <div
      className={`stat-card group ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl transition-all duration-500 group-hover:saturate-150`}></div>

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full transition-transform duration-700 group-hover:scale-125"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-110"></div>

      <div className="relative z-10">
        {/* Icons */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:shadow-xl transition-all duration-500">
            <Icon className="w-7 h-7 text-white animate-iconFloat" />
          </div>
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
            <SecIcon className="w-4 h-4 text-white/80" />
          </div>
        </div>

        {/* Value with animated counter */}
        <p className={`text-4xl font-black text-white mb-1 tabular-nums tracking-tight ${isVisible ? 'animate-countBounce' : 'opacity-0'}`}
          style={{ animationDelay: `${index * 0.12 + 0.3}s` }}
        >
          {displayValue}
        </p>
        <p className="text-white/80 text-sm font-semibold tracking-wide">{stat.label}</p>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full bg-white/60 rounded-full ${isVisible ? 'animate-progressFill' : 'w-0'}`}
            style={{
              '--progress-width': stat.progressWidth,
              animationDelay: `${index * 0.12 + 0.5}s`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
