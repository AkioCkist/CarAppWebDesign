import React from 'react';
import { Sidebar } from '../../../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto ml-64">
        {children}
      </main>
    </div>
  );
}
