import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  const renderCardSkeleton = () => (
    <div className="bg-gray-100 rounded-xl shadow-md p-6 animate-pulse h-full flex flex-col">
      <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFullPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="h-10 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl shadow-md p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-64 w-full bg-gray-200"></div> 
        </div>
      </div>
    </div>
  );

  const renderRentalOrdersFullPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="flex flex-wrap gap-3 mt-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-300 rounded-md"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-300 rounded-md mb-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg shadow-md p-6 h-48 flex flex-col justify-between">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingCardsGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg shadow-md p-6 h-48 flex flex-col justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mt-4"></div>
        </div>
      ))}
    </div>
  );

  const renderVehicleListFullPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-3/4 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl shadow-md p-6 h-40 flex flex-col justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
          <div className="h-64 w-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'full-page': 
      return renderFullPageSkeleton();
    case 'rental-orders-full-page':
      return renderRentalOrdersFullPageSkeleton();
    case 'booking-cards-grid':
      return renderBookingCardsGridSkeleton();
    case 'vehicle-list-full-page':
      return renderVehicleListFullPageSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export default SkeletonLoader; 