'use client';

import React from 'react';
import VehicleTable from '../../../../components/VehicleTable';

const VehicleListPage = () => {
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
