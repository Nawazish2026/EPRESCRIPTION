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

// Set defaults for dark mode visibility
ChartJS.defaults.color = '#9ca3af'; // text-gray-400
ChartJS.defaults.borderColor = '#374151'; // border-gray-700

const SmartDashboard = () => {
  const [stats, setStats] = useState({ treatedStats: [], diagnosisStats: [], recentPrescriptions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use the centralized API instance
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Prepare Data for Bar Chart
  const barData = {
    labels: stats.treatedStats.map((item) => item._id), // Dates
    datasets: [
      {
        label: 'Patients Treated',
        data: stats.treatedStats.map((item) => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo-500
      },
    ],
  };

  // Prepare Data for Pie Chart
  const pieData = {
    labels: stats.diagnosisStats.map((item) => item._id), // Diagnosis Names
    datasets: [
      {
        label: '# of Cases',
        data: stats.diagnosisStats.map((item) => item.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',   // Red
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(16, 185, 129, 0.7)',  // Green
          'rgba(245, 158, 11, 0.7)',  // Amber
          'rgba(139, 92, 246, 0.7)',  // Violet
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="w-full bg-gray-900 p-6 md:p-8 rounded-3xl shadow-2xl mb-8">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Practice Overview
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-200 text-center">Patients Treated (Last 7 Days)</h3>
          <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={barData} />
        </div>

        {/* Chart 2: Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-6 text-gray-200 text-center">Top Diagnoses</h3>
          <div className="w-full max-w-xs">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-200">Recent Prescriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Patient Name</th>
                <th className="pb-3 px-4">Diagnosis</th>
                <th className="pb-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stats.recentPrescriptions && stats.recentPrescriptions.length > 0 ? (
                stats.recentPrescriptions.map((rx) => (
                  <tr key={rx._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap text-sm">{new Date(rx.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-white">
                      {rx.patientName || rx.patient?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm">{rx.diagnosis || 'N/A'}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No recent prescriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmartDashboard;