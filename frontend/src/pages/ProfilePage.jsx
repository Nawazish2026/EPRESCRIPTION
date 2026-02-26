import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');

    setIsSaving(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file (JPG, PNG)');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setIsUploading(true);
    try {
      const res = await api.post('/uploads/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser({ profilePicture: res.data.url });
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error(error);
      const msg = error.response?.status === 503
        ? 'Upload service is currently unavailable. Please try again later.'
        : error.response?.data?.message || 'Failed to upload image';
      toast.error(msg);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">

          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600 w-full relative">
            <div className="absolute inset-0 bg-white/10 pattern-grid opacity-20"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative flex justify-center -mt-16 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-700 shadow-xl overflow-hidden flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Form */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl mx-auto">

              {/* Read Only Email & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-transparent rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <div className="w-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800 rounded-xl px-4 py-3 text-sm font-medium capitalize flex items-center gap-2 cursor-not-allowed">
                    {user?.role || 'Doctor'}
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border items-center border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white outline-none transition-shadow"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border items-center border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white outline-none transition-shadow"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSaving || (name === user?.name && phone === user?.phone)}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><Loader2 className="animate-spin w-5 h-5" /> Saving Changes...</>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
