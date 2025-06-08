'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back, Admin</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            This is your administrative dashboard. Use the sidebar to manage vehicles, users, bookings, and system settings with ease and efficiency.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
