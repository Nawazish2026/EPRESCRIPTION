import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { generatePrescriptionPDF } from './generatePrescriptionPDF';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, FileText, Mail, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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
      await generatePrescriptionPDF(cartItems, user, patientDetails, doctorNotes);
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
        prescription: { medicines: cartItems },
        doctor: { name: user.name },
      });
      alert('Prescription sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Prescription is Empty</h2>
          <p className="text-gray-600 text-lg mb-8">Add medicines to create a prescription</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-12">Prescription Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medicines Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-6">
                <h2 className="text-2xl font-bold">Medicines ({cartItems.length})</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.manufacturer}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.composition}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden hover:border-cyan-500 transition-colors">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-bold text-gray-900 bg-gray-100">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="text-2xl font-bold text-cyan-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-4xl font-bold text-cyan-600">₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear Prescription
                </button>
              </div>
            </div>
          </div>

          {/* Patient Details Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 sticky top-24">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <h2 className="text-2xl font-bold">Patient Details</h2>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Patient's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g., Hypertension"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
                  <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="General advice, instructions..."
                  />
                </div>

                <button
                  onClick={handleGeneratePDF}
                  disabled={!patientName || !patientAge || isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate PDF'}
                </button>

                <button
                  onClick={handleSendEmail}
                  disabled={!patientName || !patientAge || !patientEmail || isSendingEmail}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  {isSendingEmail ? 'Sending...' : 'Send via Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;