'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit, Trash2, Eye, Star, ChevronLeft, ChevronRight, Image, X, MapPin, Users, Gauge, Fuel, DollarSign } from 'lucide-react';

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const fetchController = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchVehicles = useCallback(async () => {
    if (fetchController.current) {
      fetchController.current.abort();
    }
    fetchController.current = new AbortController();

    try {
      setLoading(true);
      if (vehicles.length === 0 && currentPage === 1) {
        setIsInitialLoading(true);
      }

      const url = new URL('/api/vehicles_list', window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', itemsPerPage.toString());

      // Add status filter if not 'all'
      if (statusFilter && statusFilter !== 'all') {
        url.searchParams.append('status', statusFilter);
      }

      // Add search term if exists
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        url.searchParams.append('search', debouncedSearchTerm.trim());
      }

      console.log('Fetching vehicles with URL:', url.toString()); // Debug log

      const response = await fetch(url.toString(), { 
        signal: fetchController.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      if (data.success) {
        const minDelay = vehicles.length === 0 ? 1500 : 500;
        setTimeout(() => {
          const sortedVehicles = data.vehicles.sort((a, b) => a.vehicle_id - b.vehicle_id);
          setVehicles(sortedVehicles);
          setIsInitialLoading(false);
          setLoading(false);
          setTotalPages(Math.ceil(data.total / itemsPerPage));
        }, minDelay);
      } else {
        throw new Error(data.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching vehicles:', err); // Debug log
        setError(err.message);
        setIsInitialLoading(false);
        setLoading(false);
      }
    }
  }, [statusFilter, debouncedSearchTerm, currentPage, vehicles.length]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      setDeletingId(id);
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', vehicle_id: id })
      });
      
      const data = await response.json();
      if (data.success) {
        setVehicles(vehicles.filter(v => v.vehicle_id !== id));
      } else {
        setError(data.error || 'Failed to delete vehicle');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'rented', label: 'Rented' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border border-green-300',
      rented: 'bg-blue-100 text-blue-800 border border-blue-300',
      maintenance: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      inactive: 'bg-red-100 text-red-800 border border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getButtonStyle = (option) => {
    if (statusFilter === option.value) {
      if (option.value === 'all') {
        return 'bg-gray-200 text-gray-900 font-semibold border border-gray-300';
      }
      return getStatusColor(option.value);
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const handleRowClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedVehicle(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 text-center">
          <p>Error: {error}</p>
          <button
            onClick={fetchVehicles}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-md transition ${getButtonStyle(option)}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isInitialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr 
                  key={vehicle.vehicle_id}
                  onClick={() => handleRowClick(vehicle)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicle_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicle_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.transmission}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.fuel_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vehicle.base_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" /> Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedVehicle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 ease-out"
          onClick={closeImageModal}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full shadow-xl transform transition-all duration-300 ease-out scale-100 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-gray-600 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Image Section */}
              <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden shadow-md border-4 border-white">
                {selectedVehicle.vehicle_images?.[0]?.image_url ? (
                  <img
                    src={selectedVehicle.vehicle_images[0].image_url}
                    alt={selectedVehicle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-6">
                <h3 className="text-2xl font-normal text-gray-800 mb-4">{selectedVehicle.name}</h3>
                <div className="grid grid-cols-2 gap-y-2 text-gray-600">
                  <div><span className="font-bold">Type:</span> {selectedVehicle.vehicle_type}</div>
                  <div className="flex items-center gap-2"><img src="/icons/IconDetailCarCard/location.svg" alt="location" className="w-4 h-4" /><span className="font-bold">Location:</span> {selectedVehicle.location}</div>
                  <div className="flex items-center gap-2"><img src="/icons/IconDetailCarCard/seat.svg" alt="seats" className="w-4 h-4" /><span className="font-bold">Seats:</span> {selectedVehicle.seats}</div>
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedVehicle.transmission?.toLowerCase()?.includes('manual')
                        ? "/icons/IconDetailCarCard/Transmission.svg"
                        : "/icons/IconDetailCarCard/transmissionautomatic.svg"
                      }
                      alt="transmission"
                      className="w-4 h-4"
                    />
                    <span className="font-bold">Transmission:</span> {selectedVehicle.transmission}
                  </div>
                  <div className="flex items-center gap-2"><img src="/icons/IconDetailCarCard/fuel.svg" alt="fuel" className="w-4 h-4" /><span className="font-bold">Fuel Type:</span> {selectedVehicle.fuel_type}</div>
                  <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVehicle.base_price)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable; 