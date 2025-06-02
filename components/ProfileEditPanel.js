"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react'; // Import useSession for session data

export default function ProfileEditPanel() {
  const { data: session, update } = useSession(); // Get the update function from useSession
  const accountId = session?.user?.id;
  const initialUsername = session?.user?.name || ''; // Get initial username from session
  const initialPhone = session?.user?.phone || ''; // Get initial phone from session

  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // No longer fetching from external API at mount
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: initialUsername, // Initialize with session data
    phone: initialPhone,       // Initialize with session data
    newPassword: '',
    reEnterPassword: '',
    language: 'English',
    hourFormat: '24-hour'
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Update formData when session changes (e.g., after login or external session update)
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        username: session.user.name || '',
        phone: session.user.phone || '',
      }));
    }
  }, [session]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
  };

  const handlePhoneInput = (e) => {
    const { value } = e.target;
    if (/^[+]?\d*$/.test(value)) handleInputChange(e);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (formData.newPassword && formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword && formData.newPassword !== formData.reEnterPassword) newErrors.reEnterPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setSuccessMessage('');
    try {
      const updateData = {
        account_id: accountId, // Make sure accountId is available
        username: formData.username,
        phone_number: formData.phone,
        // Only include password if a new one is entered
        ...(formData.newPassword && { password: formData.newPassword })
      };

      // Important: Change this to your actual API endpoint for updating user profiles.
      // Assuming your PHP API for profile update is accessible via /api/myapi/profile-update.php
      // or similar. For this example, I'll use a generic /api/user.
      const response = await fetch('/myapi/profile-update.php', { // <--- Adjust this URL to your PHP update endpoint
        method: 'PUT', // or POST, depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage('Profile updated successfully!');
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          reEnterPassword: ''
        }));

        // Update the NextAuth session so changes reflect immediately
        await update({
          user: {
            name: formData.username,
            phone: formData.phone,
            // avatar: formData.avatar, // If you allow avatar updates
          }
        });

      } else {
        setErrors({ submit: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setErrors({ submit: 'Network error or API issue. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Removed the fetching spinner on initial load as data comes from session

  // Define form animation variants (copied from UserProfilePage for consistency)
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <motion.button
            className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${ // Increased font size
              activeTab === 'profile'
                ? 'text-green-700 border-green-500'
                : 'text-gray-700 hover:text-green-700 border-transparent'
            }`}
            onClick={() => setActiveTab('profile')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Profile
          </motion.button>
          <motion.button
            className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${ // Increased font size
              activeTab === 'notifications'
                ? 'text-green-700 border-green-500'
                : 'text-gray-700 hover:text-green-700 border-transparent'
            }`}
            onClick={() => setActiveTab('notifications')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Notifications
          </motion.button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-base" // Increased font size
          >
            {successMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-base" // Increased font size
          >
            {errors.submit}
          </motion.div>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <motion.form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4"
            variants={formVariants} // Apply animation to the form as well
            initial="hidden"
            animate="visible"
          >
            {/* Username Field */}
            <motion.div>
              <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3 border transition-colors ${ // Increased font size
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </motion.div>

            {/* Phone Number Field (changed from email) */}
            <motion.div>
              <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3 border transition-colors ${ // Increased font size
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.phone}
                onChange={handlePhoneInput}
                placeholder="Enter your phone number"
                pattern="^\+?\d{10,15}$"
                inputMode="tel"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </motion.div>

            {/* New Password Field */}
            <motion.div>
              <label htmlFor="new-password" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="new-password"
                className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3 border transition-colors ${ // Increased font size
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </motion.div>

            {/* Re-enter Password Field */}
            <motion.div>
              <label htmlFor="re-enter-password" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                Re-enter Password
              </label>
              <input
                type="password"
                name="reEnterPassword"
                id="re-enter-password"
                className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3 border transition-colors ${ // Increased font size
                  errors.reEnterPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.reEnterPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
              />
              {errors.reEnterPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.reEnterPassword}</p>
              )}
            </motion.div>

            {/* Language Field */}
            <motion.div>
              <label htmlFor="language" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                Language
              </label>
              <select
                id="language"
                name="language"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3" // Increased font size
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </motion.div>

            {/* Hour Format Field */}
            <motion.div>
              <label htmlFor="hour-format" className="block text-base font-medium text-gray-700 mb-1"> {/* Increased font size */}
                Hour Format
              </label>
              <select
                id="hour-format"
                name="hourFormat"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base p-3" // Increased font size
                value={formData.hourFormat}
                onChange={handleInputChange}
              >
                <option value="24-hour">24-hour</option>
                <option value="12-hour">12-hour</option>
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="col-span-full"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-3 px-6 text-lg font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" // Increased font size
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> {/* Increased spinner size */}
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <p className="text-gray-600 text-base">Notification settings will be available here.</p> {/* Increased font size */}
          </motion.div>
        )}

        {/* Link Other Accounts Section */}
        {activeTab === 'profile' && (
          <motion.div
            className="mt-8 border-t border-gray-200 pt-6"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Link Other Accounts</h3> {/* Increased font size */}
            <div className="grid grid-cols-1 gap-y-4">
              {['Google', 'Facebook', 'GitHub', 'Discord'].map((provider, index) => (
                <motion.button
                  key={provider}
                  onClick={() => handleLinkAccount(provider)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-base transition-colors" // Increased font size
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Link with {provider}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}