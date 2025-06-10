'use client';

import React from 'react';
import VehicleTable from '../../../../components/VehicleTable';
import SkeletonLoader from '../../../../components/SkeletonLoader';

const VehicleListPage = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust time to match actual data loading

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonLoader type="vehicle-list-page" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <VehicleTable />
      </div>
    </div>
  );
};

export default VehicleListPage;
