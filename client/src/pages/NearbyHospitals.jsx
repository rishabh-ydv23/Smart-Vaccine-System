import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiPhone, FiClock, FiStar } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    // Mock hospitals data
    const mockHospitals = [
      {
        _id: '1',
        name: 'City General Hospital',
        address: '123 Main St, Downtown',
        distance: 2.3,
        phone: '+1-555-0123',
        vaccines: ['COVID-19', 'Flu', 'Hepatitis B'],
        rating: 4.5,
        reviews: 128,
        hours: '24/7',
        availability: 'High',
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      {
        _id: '2',
        name: 'Metro Health Center',
        address: '456 Health Ave, Midtown',
        distance: 3.7,
        phone: '+1-555-0456',
        vaccines: ['COVID-19', 'Flu', 'MMR'],
        rating: 4.2,
        reviews: 89,
        hours: '8 AM - 8 PM',
        availability: 'Medium',
        coordinates: { lat: 40.7589, lng: -73.9851 },
      },
      {
        _id: '3',
        name: 'Regional Medical Center',
        address: '789 Care Blvd, Uptown',
        distance: 5.1,
        phone: '+1-555-0789',
        vaccines: ['COVID-19', 'Flu', 'Tdap', 'Pneumococcal'],
        rating: 4.7,
        reviews: 203,
        hours: '24/7',
        availability: 'High',
        coordinates: { lat: 40.7831, lng: -73.9712 },
      },
    ];
    setHospitals(mockHospitals);
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission(true);
          toast.success('Location accessed successfully!');
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to access your location. Please check permissions.');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleGetDirections = (hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.coordinates.lat},${hospital.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      toast.error('Please share your location first to get directions.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
          <p className="text-gray-600">Find vaccination centers and healthcare facilities near you</p>
        </motion.div>

        {/* Location Button */}
        <div className="mb-6 text-center">
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FiMapPin className="w-5 h-5" />
            <span>{loading ? 'Getting Location...' : 'Use My Location'}</span>
          </button>
          {locationPermission && (
            <p className="text-sm text-green-600 mt-2">✓ Location access granted</p>
          )}
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={hospital._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{hospital.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <FiMapPin className="w-4 h-4" />
                        <span>{hospital.distance} km</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{hospital.rating} ({hospital.reviews})</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(hospital.availability)}`}>
                    {hospital.availability} Availability
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Available Vaccines:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hospital.vaccines.map((vaccine) => (
                      <span
                        key={vaccine}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {vaccine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>{hospital.hours}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiPhone className="w-4 h-4" />
                    <span>{hospital.phone}</span>
                  </span>
                </div>

                <button
                  onClick={() => handleGetDirections(hospital)}
                  className="w-full flex items-center justify-center space-x-2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <FiNavigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Map</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map will be integrated here</p>
              <p className="text-sm text-gray-500">Showing hospitals within 10km radius</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NearbyHospitals;