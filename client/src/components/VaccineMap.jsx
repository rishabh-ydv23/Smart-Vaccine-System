import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const VaccineMap = () => {
  const [vaccines, setVaccines] = useState([]);
  const [searchParams, setSearchParams] = useState({
    lat: '',
    lng: '',
    radius: '10',
    city: '',
    pinCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load all vaccines on component mount
  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/vaccines');
      setVaccines(data);
      setError('');
    } catch (err) {
      setError('Failed to load vaccination centers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (searchParams.lat && searchParams.lng) {
        queryParams.append('lat', searchParams.lat);
        queryParams.append('lng', searchParams.lng);
        queryParams.append('radius', searchParams.radius);
      }
      
      if (searchParams.city) {
        queryParams.append('city', searchParams.city);
      }
      
      if (searchParams.pinCode) {
        queryParams.append('pinCode', searchParams.pinCode);
      }
      
      const { data } = await api.get(`/vaccines/nearby?${queryParams.toString()}`);
      setVaccines(data);
      setError('');
    } catch (err) {
      setError('Failed to search vaccination centers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Vaccination Centers</h2>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="text"
              name="lat"
              value={searchParams.lat}
              onChange={handleInputChange}
              placeholder="28.6139"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="text"
              name="lng"
              value={searchParams.lng}
              onChange={handleInputChange}
              placeholder="77.2088"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
            <select
              name="radius"
              value={searchParams.radius}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={searchParams.city}
              onChange={handleInputChange}
              placeholder="New Delhi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
            <input
              type="text"
              name="pinCode"
              value={searchParams.pinCode}
              onChange={handleInputChange}
              placeholder="110001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={loadVaccines}
            disabled={loading}
            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Vaccination Centers {vaccines.length > 0 && `(${vaccines.length})`}
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading vaccination centers...</p>
          </div>
        ) : vaccines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No vaccination centers found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccines.map((vaccine) => (
              <div key={vaccine._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg text-gray-800">{vaccine.name}</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <p><span className="font-medium">Doses Required:</span> {vaccine.doseRequired}</p>
                  <p><span className="font-medium">Available Quantity:</span> {vaccine.availableQuantity}</p>
                  {vaccine.location && (
                    <>
                      <p><span className="font-medium">Address:</span> {vaccine.location.address}</p>
                      <p><span className="font-medium">City:</span> {vaccine.location.city}</p>
                      <p><span className="font-medium">PIN Code:</span> {vaccine.location.pinCode}</p>
                      <p><span className="font-medium">Coordinates:</span> {vaccine.location.coordinates[1]}, {vaccine.location.coordinates[0]}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Simple Map Visualization */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Map View</h3>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-gray-600">Interactive map would be displayed here</p>
            <p className="text-gray-500 text-sm mt-2">
              In a production environment, this would integrate with Google Maps or Leaflet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineMap;