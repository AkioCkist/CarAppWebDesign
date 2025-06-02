// components/ProfileEditPanel.js
import React, { useState } from 'react';

export default function ProfileEditPanel({ userData }) {
  const [username, setUsername] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [language, setLanguage] = useState('English');
  const [hourFormat, setHourFormat] = useState('24-hour');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Profile Updated:', {
      username,
      email,
      newPassword, // In a real app, you'd hash this before sending
      language,
      hourFormat,
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex border-b border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-green-700 border-b-2 border-green-500">Profile</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700">Notifications</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1">
              <input
                type="text"
                name="username"
                id="username"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1">
              <input
                type="password"
                name="new-password"
                id="new-password"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="re-enter-password" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
            <div className="mt-1">
              <input
                type="password"
                name="re-enter-password"
                id="re-enter-password"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <div className="mt-1">
              <select
                id="language"
                name="language"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                {/* Add more language options as needed */}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="hour-format" className="block text-sm font-medium text-gray-700">Hour Format</label>
            <div className="mt-1">
              <select
                id="hour-format"
                name="hour-format"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                value={hourFormat}
                onChange={(e) => setHourFormat(e.target.value)}
              >
                <option>24-hour</option>
                <option>12-hour</option>
              </select>
            </div>
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Update profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}