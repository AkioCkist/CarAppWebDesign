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

  const renderVehicleTableSkeleton = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="w-full h-12 bg-gray-200 rounded-md shadow-sm animate-pulse"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVehicleListPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Page Title */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="w-full h-12 bg-gray-200 rounded-md shadow-sm"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-10 w-24 bg-gray-200 rounded-md"
                ></div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRentalOrdersPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="w-full h-12 bg-gray-200 rounded-md shadow-sm animate-pulse"></div>
        </div>
      </div>

      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            style={{ minWidth: 320, maxWidth: 420 }}
          >
            {/* Card Image */}
            <div className="h-44 w-full bg-gray-200 animate-pulse"></div>
            
            {/* Card Content */}
            <div className="p-5">
              {/* Title and Status */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>

              {/* Details */}
              <div className="space-y-2 mt-2">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserInfoPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between h-full">
              <div className="p-4 rounded-full mb-4 bg-gray-200 w-16 h-16 animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
    case 'vehicle-table':
      return renderVehicleTableSkeleton();
    case 'vehicle-list-page':
      return renderVehicleListPageSkeleton();
    case 'rental-orders-page':
      return renderRentalOrdersPageSkeleton();
    case 'user-info-page':
      return renderUserInfoPageSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export default SkeletonLoader; 