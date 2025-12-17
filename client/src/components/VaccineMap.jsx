import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VaccineMap = () => {
  const [vaccines, setVaccines] = useState([]);
  const [searchParams, setSearchParams] = useState({
    lat: '28.6139',
    lng: '77.2088',
    radius: '10',
    city: '',
    pinCode: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2088]);

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

  // Function to geocode address to coordinates
  const geocodeAddress = async (address) => {
    setGeocoding(true);
    setError('');
    
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchParams({
          ...searchParams,
          lat,
          lng: lon,
          address
        });
        
        // Automatically search after geocoding
        setTimeout(() => {
          handleSearch({ preventDefault: () => {} });
        }, 500);
      } else {
        setError('Could not find coordinates for the given address. Please try a different address.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to geocode address. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (searchParams.address.trim()) {
      geocodeAddress(searchParams.address);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Vaccination Centers</h2>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Find Nearby Vaccination Centers</h3>
          <form onSubmit={handleAddressSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={searchParams.address}
                onChange={handleInputChange}
                placeholder="Enter complete address (e.g., 123 Main Street, New Delhi 110001)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={geocoding}
              />
              <button
                type="submit"
                disabled={geocoding || !searchParams.address.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {geocoding ? 'Locating...' : 'Find Centers'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Enter your complete address to find nearby vaccination centers and government hospitals</p>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="lat"
                value={searchParams.lat}
                onChange={handleInputChange}
                placeholder="28.6139"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
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
                readOnly
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
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading || !searchParams.lat || !searchParams.lng}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Nearby Centers'}
          </button>
          <button
            onClick={loadVaccines}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Show All Centers
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
      
      {/* Embedded Map Visualization */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Interactive Map</h3>
        <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            {searchParams.lat && searchParams.lng && (
              <Marker position={[parseFloat(searchParams.lat), parseFloat(searchParams.lng)]}>
                <Popup>
                  <div className="font-semibold">Your Location</div>
                  <div className="text-sm">{searchParams.address || 'Selected location'}</div>
                </Popup>
              </Marker>
            )}
            
            {/* Vaccination centers markers */}
            {vaccines.map((vaccine) => {
              if (vaccine.location && vaccine.location.coordinates) {
                return (
                  <Marker 
                    key={vaccine._id} 
                    position={[vaccine.location.coordinates[1], vaccine.location.coordinates[0]]}
                  >
                    <Popup>
                      <div className="font-semibold">{vaccine.name}</div>
                      <div className="text-sm">{vaccine.location.address}</div>
                      <div className="text-sm">{vaccine.location.city}, {vaccine.location.pinCode}</div>
                      <div className="text-sm mt-1">Doses Required: {vaccine.doseRequired}</div>
                      <div className="text-sm">Available: {vaccine.availableQuantity}</div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>📍 <span className="font-medium">Blue marker:</span> Your location | 
          <span className="font-medium">Red markers:</span> Vaccination centers</p>
        </div>
      </div>
    </div>
  );
};

export default VaccineMap;