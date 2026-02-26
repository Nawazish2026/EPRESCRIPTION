import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, ChevronLeft, ChevronRight, Loader2, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function PrescriptionHistory() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // active, completed, cancelled
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [nextCursor, setNextCursor] = useState(null);
  const [history, setHistory] = useState([]); // Array of cursors to go back

  const fetchPrescriptions = async (cursor = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 10 });
      if (cursor) params.append('cursor', cursor);
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/prescriptions?${params.toString()}`);
      setPrescriptions(res.data.data);
      setNextCursor(res.data.pagination.nextCursor);
    } catch (err) {
      toast.error('Failed to load prescription history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination when filters change
    setHistory([]);
    setNextCursor(null);
    fetchPrescriptions();
  }, [search, status, startDate, endDate]);

  const handleNextPage = () => {
    if (nextCursor) {
      setHistory(prev => [...prev, prescriptions.length > 0 ? prescriptions[prescriptions.length - 1]._id : null]);
      fetchPrescriptions(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current page's start cursor
      const prevCursor = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      setHistory(newHistory);
      fetchPrescriptions(prevCursor);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/prescriptions/${id}/status`, { status: newStatus });
      toast.success(`Prescription marked as ${newStatus}`);
      // Optimistic update
      setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'active':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200"><Clock className="w-3 h-3" /> Active</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{statusStr}</span>;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mt-8 mb-12">

      {/* Header & Filters */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
              <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Prescription History</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all issued prescriptions</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patient or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-gray-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Patient</th>
              <th className="px-6 py-4 font-semibold">Diagnosis</th>
              <th className="px-6 py-4 font-semibold">Date Issued</th>
              <th className="px-6 py-4 font-semibold">Medicines</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              {user?.role === 'doctor' && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                </td>
              </tr>
            ) : prescriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p>No prescriptions found matching your filters.</p>
                </td>
              </tr>
            ) : (
              prescriptions.map((rx) => (
                <tr key={rx._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-white">{(rx.patientName || rx.patient?.name) || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Age: {rx.patientAge} • {rx.patientGender}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                    {rx.diagnosis}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {rx.medicines.slice(0, 2).map((med, idx) => (
                        <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs truncate max-w-[100px]" title={med.medicineName || med.name}>
                          {med.medicineName || med.name}
                        </span>
                      ))}
                      {rx.medicines.length > 2 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                          +{rx.medicines.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(rx.status)}
                  </td>
                  {user?.role === 'doctor' && (
                    <td className="px-6 py-4 text-right">
                      <select
                        onChange={(e) => {
                          if (e.target.value) updateStatus(rx._id, e.target.value);
                          e.target.value = ''; // Reset select after action
                        }}
                        className="text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none text-gray-600 dark:text-gray-300 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Action...</option>
                        {rx.status !== 'completed' && <option value="completed">Complete</option>}
                        {rx.status !== 'cancelled' && <option value="cancelled">Cancel</option>}
                        {rx.status !== 'active' && <option value="active">Mark Active</option>}
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {prescriptions.length > 0 ? `Showing ${prescriptions.length} items` : 'No results'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={history.length === 0}
            className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={!nextCursor}
            className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
