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
    // Real hospitals data based on seed data
    const realHospitals = [
      // Phagwara Hospitals
      {
        _id: '1',
        name: 'Civil Hospital, Phagwara',
        address: 'Chahal Nagar, Phagwara, Punjab 144401, India',
        distance: 0.5,
        phone: '+91-1824-XXXXXX',
        vaccines: ['COVID-19', 'Hepatitis B', 'Chickenpox', 'Dengue', 'Diphtheria'],
        rating: 4.3,
        reviews: 156,
        hours: '24/7',
        availability: 'High',
        coordinates: { lat: 31.2240, lng: 75.7708 },
      },
      {
        _id: '2',
        name: 'PHC Autholi, Phagwara',
        address: 'Unnamed Road, Athouli, Phagwara, Punjab 144402, India',
        distance: 2.1,
        phone: '+91-1824-XXXXXX',
        vaccines: ['Influenza', 'MMR', 'Tetanus'],
        rating: 4.0,
        reviews: 89,
        hours: '8 AM - 8 PM',
        availability: 'Medium',
        coordinates: { lat: 31.2280, lng: 75.7190 },
      },
      {
        _id: '3',
        name: 'Aam Admi Clinic, Phagwara',
        address: 'Khothra Rd, Kaulsar, Friends Colony, Phagwara Sharki, Punjab 144401, India',
        distance: 1.8,
        phone: '+91-1824-XXXXXX',
        vaccines: ['Tetanus', 'Chickenpox', 'Hepatitis A'],
        rating: 4.2,
        reviews: 112,
        hours: '9 AM - 9 PM',
        availability: 'High',
        coordinates: { lat: 31.2200, lng: 75.7650 },
      },
      {
        _id: '4',
        name: 'ESI Hospital, Phagwara',
        address: 'Phagwara HO, Phagwara – 144401, Punjab',
        distance: 1.2,
        phone: '+91-1824-XXXXXX',
        vaccines: ['COVID-19', 'Dengue', 'Diphtheria', 'Hepatitis B'],
        rating: 4.5,
        reviews: 203,
        hours: '24/7',
        availability: 'High',
        coordinates: { lat: 31.2300, lng: 75.7750 },
      },
      {
        _id: '5',
        name: 'Manjit Singh Bal Hospital, Phagwara',
        address: 'Near Sondhi Gas Agency, Hargobind Nagar, Phagwara',
        distance: 2.5,
        phone: '+91-1824-XXXXXX',
        vaccines: ['Hepatitis A', 'Hib'],
        rating: 4.1,
        reviews: 95,
        hours: '24/7',
        availability: 'Medium',
        coordinates: { lat: 31.2150, lng: 75.7600 },
      },
      // Delhi Hospitals (if needed for broader coverage)
      {
        _id: '6',
        name: 'Delhi Healthcare Center',
        address: '123 Healthcare Ave, New Delhi, 110001',
        distance: 12.3,
        phone: '+91-11-XXXXXXX',
        vaccines: ['COVID-19', 'Chickenpox', 'Hepatitis B'],
        rating: 4.6,
        reviews: 245,
        hours: '24/7',
        availability: 'High',
        coordinates: { lat: 28.6139, lng: 77.2088 },
      },
      {
        _id: '7',
        name: 'Connaught Place Medical Plaza',
        address: '456 Medical Plaza, Connaught Place, New Delhi, 110001',
        distance: 15.7,
        phone: '+91-11-XXXXXXX',
        vaccines: ['COVID-19', 'Dengue', 'Diphtheria'],
        rating: 4.4,
        reviews: 178,
        hours: '8 AM - 10 PM',
        availability: 'High',
        coordinates: { lat: 28.63493, lng: 77.22634 },
      }
    ];
    setHospitals(realHospitals);
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


      </div>
    </div>
  );
};

export default NearbyHospitals;