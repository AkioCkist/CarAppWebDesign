'use client';

import React, { useEffect, useState, useCallback } from 'react';
import UserStats from '../../../../components/UserStats';
import UserTable from '../../../../components/UserTable';
import SkeletonLoader from '../../../../components/SkeletonLoader';

const UserInfoDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    newUsersThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('total'); // Default to 'total'
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const fetchUsers = useCallback(async (filterType) => {
    setSelectedFilter(filterType);
    setLoadingUsers(true);
    setUsersError(null);
    setUsers([]);

    let title = '';
    if (filterType === 'total') title = 'All Users'; // Changed to All Users for default display
    else if (filterType === 'month') title = 'New Users This Month';
    else if (filterType === 'week') title = 'New Users This Week';

    try {
      const response = await fetch(`/api/users?filter=${filterType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch initial stats
        const statsResponse = await fetch('/api/user/stats');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch user statistics');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch initial users (Total Users)
        await fetchUsers('total');

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [fetchUsers]);

  // Add a click handler to pass to UserStats
  const handleCardClick = (filterType) => {
    fetchUsers(filterType);
  };

  let tableTitle = '';
  if (selectedFilter === 'total') tableTitle = 'All Users';
  else if (selectedFilter === 'month') tableTitle = 'New Users This Month';
  else if (selectedFilter === 'week') tableTitle = 'New Users This Week';


  if (loading) {
    return <SkeletonLoader type="user-info-page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg text-center">
          <p className="font-bold text-xl mb-2">Error Loading Data</p>
          <p>{error}</p>
          <p className="text-sm text-gray-600 mt-4">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            User Infomations
          </h1>
        </div>

        <UserStats stats={stats} onCardClick={handleCardClick} />

        {selectedFilter && (
          <div className="mt-8">
            {loadingUsers ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="ml-3 text-gray-700">Loading user list...</p>
              </div>
            ) : usersError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{usersError}</span>
              </div>
            ) : (
              <UserTable users={users} title={tableTitle} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoDashboard;