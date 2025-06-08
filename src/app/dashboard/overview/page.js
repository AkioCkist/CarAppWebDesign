'use client';

import React from 'react';
import { Construction } from 'lucide-react';

export default function Overview() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 shadow-md rounded-2xl px-8 py-12 max-w-lg w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full w-16 h-16 mx-auto">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Feature In Progress</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          This feature is currently under development. Please check back soon for updates.
        </p>
      </div>
    </div>
  );
}
