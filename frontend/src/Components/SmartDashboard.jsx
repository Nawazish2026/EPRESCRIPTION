// src/Components/SmartDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../api/axiosConfig';
import { BarChart3, PieChart, ClipboardList, TrendingUp, Sparkles, Activity, Users, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SmartDashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ treatedStats: [], diagnosisStats: [], recentPrescriptions: [] });
  const [loading, setLoading] = useState(true);

  // Dynamic Chart Defaults
  ChartJS.defaults.color = theme === 'dark' ? '#94a3b8' : '#64748b';
  ChartJS.defaults.borderColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {}
        };
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const res = await api.get('/dashboard/stats', config);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [theme]); // Re-fetch on theme change isn't needed, but re-render is

  if (loading) {
    return (
      <div className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 dark:border-gray-700 shadow-xl mb-8">
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-100 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare Data for Bar Chart
  const barData = {
    labels: stats.treatedStats.map((item) => item._id),
    datasets: [
      {
        label: 'Patients Treated',
        data: stats.treatedStats.map((item) => item.count),
        backgroundColor: 'rgba(6, 182, 212, 0.7)', // Cyan-500
        borderColor: 'rgba(6, 182, 212, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
        borderColor: theme === 'dark' ? 'rgba(55, 65, 81, 1)' : 'rgba(6, 182, 212, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        titleFont: { weight: 'bold' },
        boxPadding: 4,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 1)',
        },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#94a3b8',
          font: { weight: '500' }
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#94a3b8',
          font: { weight: '500' }
        },
        border: { display: false }
      }
    }
  };

  // Prepare Data for Pie Chart
  const pieData = {
    labels: stats.diagnosisStats.map((item) => item._id),
    datasets: [
      {
        label: '# of Cases',
        data: stats.diagnosisStats.map((item) => item.count),
        backgroundColor: [
          'rgba(6, 182, 212, 0.7)',   // Cyan
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(139, 92, 246, 0.7)',  // Violet
          'rgba(236, 72, 153, 0.7)',  // Pink
          'rgba(245, 158, 11, 0.7)',  // Amber
        ],
        borderColor: [
          'rgba(6, 182, 212, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? '#cbd5e1' : '#475569',
          padding: 20,
          font: {
            size: 11,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
        borderColor: theme === 'dark' ? 'rgba(55, 65, 81, 1)' : 'rgba(226, 232, 240, 1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        titleFont: { weight: 'bold' }
      }
    }
  };

  return (
    <div className="w-full relative overflow-hidden mb-12 animate-fadeInUp">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-[2.5rem] shadow-xl transition-all duration-500"></div>

      {/* Decorative Gradients */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 p-8 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transform rotate-3 hover:rotate-6 transition-transform">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Practice Overview
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Your analytics dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-700/50 px-4 py-2 rounded-xl border border-white/60 dark:border-gray-600 shadow-sm">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Last 7 Days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Bar Chart */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/60 dark:border-gray-700 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-default group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors">
                  <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patients Treated</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Daily activity</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800">
                <TrendingUp className="w-3.5 h-3.5" />
                +12.5%
              </div>
            </div>
            <Bar options={barOptions} data={barData} />
          </div>

          {/* Chart 2: Pie Chart */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/60 dark:border-gray-700 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-default group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Diagnosis Distribution</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">By category</p>
                </div>
              </div>
            </div>
            <div className="max-w-[300px] mx-auto relative group-hover:scale-105 transition-transform duration-500">
              <Pie data={pieData} options={pieOptions} />
              {/* Center Text for Donut Chart Look */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <Users className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-8 border border-white/60 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Prescriptions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Latest patient records</p>
              </div>
            </div>
            <button className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 px-4 py-2 rounded-xl transition-all">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                  <th className="text-left pb-4 pl-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left pb-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left pb-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Diagnosis</th>
                  <th className="text-left pb-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.recentPrescriptions && stats.recentPrescriptions.length > 0 ? (
                  stats.recentPrescriptions.map((rx, index) => (
                    <tr
                      key={rx._id}
                      className="group hover:bg-white/80 dark:hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <td className="py-4 pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border border-white dark:border-gray-600 shadow-sm">
                            {(rx.patientName || rx.patient?.name || 'U').charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-gray-200">
                            {rx.patientName || rx.patient?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {rx.diagnosis || 'N/A'}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800 shadow-sm group-hover:scale-105 transition-transform">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Submitted
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-50">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <ClipboardList className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No recent prescriptions found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDashboard;