'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Car,
  Users,
  BarChart2,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout'
        }),
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('user');
        
        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/dashboard/overview', label: 'Overview', icon: <Home size={18} /> },
    { href: '/dashboard/vehicle_list', label: 'Vehicle List', icon: <Car size={18} /> },
    { href: '/dashboard/user_info', label: 'User Info', icon: <Users size={18} /> },
    { href: '/dashboard/rental_orders', label: 'Rental Orders', icon: <BarChart2 size={18} /> },
  ];

  return (
    <div className="w-64 h-screen bg-green-900 text-white flex flex-col px-4 py-6 shadow-2xl transition-all duration-300 fixed top-0 left-0">
      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <Link href="/dashboard">
          <img
            src="/logo/logo.webp"
            alt="Whalecar Logo"
            className="h-20 w-auto hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-grow">
        <ul className="flex flex-col justify-start gap-4 text-[15px] font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-green-500 text-white font-semibold shadow-md ring-2 ring-green-400'
                      : 'hover:bg-green-500/30 hover:text-green-100 hover:shadow-md'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="mt-auto pt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-green-500/30 hover:text-green-100 hover:shadow-md w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
