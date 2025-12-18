import React, { useState } from 'react';

const NearbyHospitalsFinder = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Static list of government hospitals in Punjab
  const governmentHospitals = [
    {
      name: "Government Medical College & Hospital",
      city: "Amritsar",
      latitude: 31.6964,
      longitude: 74.7974
    },
    {
      name: "Civil Hospital",
      city: "Ludhiana",
      latitude: 30.9010,
      longitude: 75.8572
    },
    {
      name: "Government Medical College",
      city: "Patiala",
      latitude: 30.3391,
      longitude: 76.3892
    },
    {
      name: "District Headquarters Hospital",
      city: "Jalandhar",
      latitude: 31.3256,
      longitude: 75.5725
    },
    {
      name: "Government Medical College",
      city: "Bathinda",
      latitude: 30.2110,
      longitude: 74.9450
    },
    {
      name: "Sher-i-Kashmir Institute of Medical Sciences",
      city: "Chandigarh",
      latitude: 30.7333,
      longitude: 76.7794
    },
    {
      name: "Government Medical College",
      city: "Faridkot",
      latitude: 30.7104,
      longitude: 74.8464
    },
    {
      name: "District Hospital",
      city: "Gurdaspur",
      latitude: 32.0366,
      longitude: 75.4362
    },
    {
      name: "Government Medical College",
      city: "Hoshiarpur",
      latitude: 31.5145,
      longitude: 75.0794
    },
    {
      name: "Civil Hospital",
      city: "Ferozepur",
      latitude: 30.9193,
      longitude: 74.6254
    }
  ];

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Find nearest hospital
  const findNearestHospital = (latitude, longitude) => {
    let nearest = null;
    let shortestDistance = Infinity;

    governmentHospitals.forEach(hospital => {
      const distance = calculateDistance(
        latitude,
        longitude,
        hospital.latitude,
        hospital.longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = {
          ...hospital,
          distance: distance.toFixed(2)
        };
      }
    });

    return nearest;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    setUserLocation(null);
    setNearestHospital(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        const nearest = findNearestHospital(latitude, longitude);
        setNearestHospital(nearest);
        
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions to use this feature.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred while getting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Nearby Government Hospitals</h2>
      
      <div className="mb-6">
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Finding Location...' : 'Find Nearby Government Hospitals'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* User Location */}
      {userLocation && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Your Location:</p>
          <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
          <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
        </div>
      )}

      {/* Nearest Hospital */}
      {nearestHospital && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <h3 className="text-xl font-semibold mb-2">Nearest Government Hospital</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Hospital:</span> {nearestHospital.name}</p>
            <p><span className="font-medium">City:</span> {nearestHospital.city}</p>
            <p><span className="font-medium">Distance:</span> {nearestHospital.distance} km</p>
          </div>
        </div>
      )}

      {/* All Hospitals Info */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Government Hospitals in Punjab</h3>
        <p className="text-gray-600 mb-4">
          This feature uses your browser's geolocation to find the nearest government hospital from our database of {governmentHospitals.length} hospitals in Punjab.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {governmentHospitals.map((hospital, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-lg text-gray-800">{hospital.name}</h4>
              <p className="text-gray-600">City: {hospital.city}</p>
              <p className="text-gray-600 text-sm">
                Coordinates: {hospital.latitude.toFixed(4)}, {hospital.longitude.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">How It Works</h4>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li>Click the "Find Nearby Government Hospitals" button</li>
          <li>Allow location access when prompted by your browser</li>
          <li>We'll calculate distances to all government hospitals in our database</li>
          <li>The nearest hospital will be displayed with exact distance</li>
        </ul>
      </div>
    </div>
  );
};

export default NearbyHospitalsFinder;