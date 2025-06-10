import React from 'react';
import { Users, TrendingUp, UserPlus } from 'lucide-react';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between h-full transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    onClick={onClick}
  >
    <div 
      className="p-4 rounded-full mb-4 flex items-center justify-center"
      style={{ backgroundColor: `${color}15` }}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">
        {title}
      </p>
      <h2 className="text-4xl font-bold text-gray-900">
        {value}
      </h2>
    </div>
  </div>
);

const UserStats = ({ stats, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users size={32} color="#2196f3" />}
        color="#2196f3"
        onClick={() => onCardClick('total')}
      />
      <StatCard
        title="New Users This Month"
        value={stats.newUsersThisMonth}
        icon={<TrendingUp size={32} color="#4caf50" />}
        color="#4caf50"
        onClick={() => onCardClick('month')}
      />
      <StatCard
        title="New Users This Week"
        value={stats.newUsersThisWeek}
        icon={<UserPlus size={32} color="#ff9800" />}
        color="#ff9800"
        onClick={() => onCardClick('week')}
      />
    </div>
  );
};

export default UserStats; 