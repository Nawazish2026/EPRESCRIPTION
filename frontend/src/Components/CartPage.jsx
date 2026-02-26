import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { generatePrescriptionPDF } from './generatePrescriptionPDF';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, FileText, Mail, ShoppingBag, User, Calendar, Stethoscope, ClipboardList, Sparkles, ArrowLeft, Pill, Clock, Timer, AlarmClock } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const DOSAGE_OPTIONS = [
  '1/2 tablet',
  '1 tablet',
  '2 tablets',
  '1 capsule',
  '2 capsules',
  '5 ml',
  '10 ml',
  '15 ml',
  '250 mg',
  '500 mg',
  '650 mg',
  '1 g',
  '1 sachet',
  '1 puff',
  '2 puffs',
  '1 drop',
  '2 drops',
  '1 application',
  'As directed',
];

const FREQUENCY_OPTIONS = [
  'Once daily (OD)',
  'Twice daily (BD)',
  'Thrice daily (TDS)',
  'Four times (QDS)',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Before meals',
  'After meals',
  'At bedtime (HS)',
  'As needed (SOS)',
  'Weekly',
];

const DURATION_OPTIONS = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '21 days',
  '1 month',
  '2 months',
  '3 months',
  'Ongoing',
];

const CartPage = () => {
  const { cartItems, updateQuantity, updateItemField, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: formRef, isVisible: formVisible } = useScrollReveal({ threshold: 0.1 });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGeneratePDF = async () => {
    if (!patientName || !patientAge) {
      alert('Please enter patient name and age.');
      return;
    }
    setIsGenerating(true);
    try {
      await api.post('/prescriptions', {
        patientName,
        patientAge,
        diagnosis,
        medicines: cartItems,
        doctorNotes,
      });

      const patientDetails = { name: patientName, age: patientAge };
      await generatePrescriptionPDF(cartItems, user, patientDetails, diagnosis, doctorNotes);
      navigate('/home');
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!patientName || !patientAge || !patientEmail) {
      alert('Please enter patient name, age, and email.');
      return;
    }
    setIsSendingEmail(true);
    try {
      await api.post('/prescription/email', {
        patientEmail,
        patientName,
        patientAge,
        diagnosis,
        prescription: {
          medicines: cartItems.map(item => ({
            name: item.name,
            composition: item.composition,
            dosage: item.dosage || `${item.quantity} unit(s)`,
            frequency: item.frequency || 'As directed',
            duration: item.duration || 'As directed',
            quantity: item.quantity,
          })),
        },
        doctor: { name: user.name },
        doctorNotes,
      });
      alert('Prescription sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 350);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center animate-fadeInUp">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Your Prescription is Empty</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">Add medicines from our catalog to create a prescription for your patients</p>
            <button onClick={() => navigate('/home')} className="btn-premium text-lg px-8 py-4">
              <ArrowLeft className="w-5 h-5" />
              Browse Medicines
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-15 blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10 blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div ref={headerRef} className={`mb-12 ${headerVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Medicines
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            Prescription Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Create and send prescriptions with proper dosage to your patients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medicines with Dosage */}
          <div className="lg:col-span-2">
            <div className="glass-card dark:bg-gray-800 dark:border-gray-700 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Medicines ({cartItems.length})
                  </h2>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm">
                    <Pill className="w-4 h-4" />
                    Add dosage for each
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {cartItems.map((item, index) => (
                  <div
                    key={item._id}
                    className={`p-6 transition-all duration-300 ${removingId === item._id
                      ? 'opacity-0 translate-x-8 max-h-0 py-0 overflow-hidden'
                      : 'opacity-100 translate-x-0'
                      }`}
                    style={{
                      transition: removingId === item._id
                        ? 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                        : `all 0.3s ease ${index * 0.05}s`,
                    }}
                  >
                    {/* Medicine Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-white text-xs font-bold flex-shrink-0">{index + 1}</span>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{item.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-9">{item.composition}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Quantity */}
                        <div className="flex items-center bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors shadow-sm">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-cyan-600 transition-all active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2.5 font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-600 min-w-[2.5rem] text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-cyan-600 transition-all active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[90px]">
                          <p className="text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Dosage Row — the key improvement */}
                    <div className="ml-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Dosage */}
                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                          <Pill className="w-3 h-3 text-cyan-500" />
                          Dosage
                        </label>
                        <select
                          value={item.dosage || ''}
                          onChange={(e) => updateItemField(item._id, 'dosage', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white outline-none focus:border-cyan-400 dark:focus:border-cyan-500 focus:shadow-sm transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select dosage</option>
                          {DOSAGE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Frequency */}
                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                          <AlarmClock className="w-3 h-3 text-purple-500" />
                          Frequency
                        </label>
                        <select
                          value={item.frequency || 'After meals'}
                          onChange={(e) => updateItemField(item._id, 'frequency', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:shadow-sm transition-all appearance-none cursor-pointer"
                        >
                          {FREQUENCY_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                          <Timer className="w-3 h-3 text-emerald-500" />
                          Duration
                        </label>
                        <select
                          value={item.duration || ''}
                          onChange={(e) => updateItemField(item._id, 'duration', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 focus:shadow-sm transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select duration</option>
                          {DURATION_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Amount:</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline transition-all"
                >
                  Clear Prescription
                </button>
              </div>
            </div>
          </div>

          {/* Patient Details Form */}
          <div ref={formRef} className={`lg:col-span-1 ${formVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ animationDelay: '0.15s' }}>
            <div className="glass-card dark:bg-gray-800 dark:border-gray-700 rounded-3xl overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <User className="w-6 h-6" />
                    Patient Details
                  </h2>
                </div>
              </div>

              <div className="p-8 space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="input-premium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Patient's full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="input-premium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Years"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="input-premium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Stethoscope className="w-4 h-4 text-indigo-500" />
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="input-premium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., Hypertension, Diabetes"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <ClipboardList className="w-4 h-4 text-indigo-500" />
                    Doctor's Notes
                  </label>
                  <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows="3"
                    className="input-premium resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Instructions, follow-up date, dietary advice..."
                  />
                </div>

                {/* Prescription Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl border border-indigo-100 dark:border-gray-600">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">Prescription Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Medicines</span>
                      <span className="font-bold text-gray-900 dark:text-white">{cartItems.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Qty</span>
                      <span className="font-bold text-gray-900 dark:text-white">{cartItems.reduce((s, i) => s + i.quantity, 0)} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">With dosage</span>
                      <span className={`font-bold ${cartItems.filter(i => i.dosage).length === cartItems.length ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {cartItems.filter(i => i.dosage).length}/{cartItems.length}
                      </span>
                    </div>
                    <div className="h-px bg-indigo-200 dark:bg-gray-600 my-1"></div>
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleGeneratePDF}
                    disabled={!patientName || !patientAge || isGenerating}
                    className="ripple-container w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FileText className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Download Prescription PDF'}
                  </button>

                  <button
                    onClick={handleSendEmail}
                    disabled={!patientName || !patientAge || !patientEmail || isSendingEmail}
                    className="ripple-container w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Mail className="w-5 h-5" />
                    {isSendingEmail ? 'Sending...' : 'Email to Patient'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;