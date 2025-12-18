import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const VaccineMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchParams, setSearchParams] = useState({
    lat: '30.9010', // Default to Amritsar, Punjab
    lng: '75.8572',
    radius: '10',
    city: '',
    pinCode: '',
    address: 'Amritsar, Punjab'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [mapError, setMapError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load all government hospitals in Punjab on component mount
  useEffect(() => {
    loadPunjabHospitals();
  }, []);

  const loadPunjabHospitals = async () => {
    try {
      setLoading(true);
      // Load all hospitals (government hospitals in Punjab)
      const { data } = await api.get('/vaccines');
      // Filter for government hospitals in Punjab
      const punjabHospitals = data.filter(hospital => 
        hospital.location && 
        (hospital.location.city.includes('Amritsar') || 
         hospital.location.city.includes('Ludhiana') || 
         hospital.location.city.includes('Patiala') || 
         hospital.location.city.includes('Jalandhar') || 
         hospital.location.city.includes('Bathinda') ||
         hospital.location.pinCode.startsWith('14'))
      );
      setHospitals(punjabHospitals);
      setError('');
    } catch (err) {
      setError('Failed to load government hospitals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.preventDefault) e.preventDefault();
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Always search by coordinates for nearby hospitals
      if (searchParams.lat && searchParams.lng) {
        queryParams.append('lat', searchParams.lat);
        queryParams.append('lng', searchParams.lng);
        queryParams.append('radius', searchParams.radius);
      }
      
      // Also search by pin code if provided
      if (searchParams.pinCode) {
        queryParams.append('pinCode', searchParams.pinCode);
      }
      
      const { data } = await api.get(`/vaccines/nearby?${queryParams.toString()}`);
      // Filter for government hospitals
      const nearbyHospitals = data.filter(hospital => 
        hospital.location && 
        (hospital.location.city.includes('Amritsar') || 
         hospital.location.city.includes('Ludhiana') || 
         hospital.location.city.includes('Patiala') || 
         hospital.location.city.includes('Jalandhar') || 
         hospital.location.city.includes('Bathinda') ||
         hospital.location.pinCode.startsWith('14'))
      );
      setHospitals(nearbyHospitals);
      setError('');
    } catch (err) {
      setError('Failed to search nearby government hospitals');
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
    setMapError('');
    setMapLoaded(false);
    
    try {
      // Extract PIN code if present in address
      const pinCodeMatch = address.match(/\b\d{6}\b/);
      if (pinCodeMatch) {
        setSearchParams(prev => ({
          ...prev,
          pinCode: pinCodeMatch[0]
        }));
      }
      
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
          address,
          pinCode: pinCodeMatch ? pinCodeMatch[0] : searchParams.pinCode
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

  // Generate static map image URL as fallback
  const getStaticMapUrl = () => {
    if (searchParams.lat && searchParams.lng) {
      const markers = [];
      
      // Add user location marker
      markers.push(`pin-s-large+FF0000(${searchParams.lng},${searchParams.lat})`);
      
      // Add hospital markers
      hospitals.forEach(hospital => {
        if (hospital.location && hospital.location.coordinates) {
          const lat = hospital.location.coordinates[1];
          const lng = hospital.location.coordinates[0];
          markers.push(`pin-s-large+0000FF(${lng},${lat})`);
        }
      });
      
      const markerParam = markers.join('~');
      return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${searchParams.lng},${searchParams.lat}&zoom=12&marker=${markerParam}&apiKey=YOUR_API_KEY_HERE`;
    }
    return '';
  };

  // Handle iframe load error
  const handleMapError = () => {
    setMapError('Unable to load map. Showing static map instead.');
    setMapLoaded(false);
  };

  // Handle iframe load success
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Government Hospitals</h2>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Find Nearby Government Hospitals</h3>
          <form onSubmit={handleAddressSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={searchParams.address}
                onChange={handleInputChange}
                placeholder="Enter complete address (e.g., Phagwara, Punjab - 144411)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={geocoding}
              />
              <button
                type="submit"
                disabled={geocoding || !searchParams.address.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {geocoding ? 'Locating...' : 'Find Hospitals'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Enter your complete address to find nearby government hospitals</p>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="lat"
                value={searchParams.lat}
                onChange={handleInputChange}
                placeholder="30.9010"
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
                placeholder="75.8572"
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
            {loading ? 'Searching...' : 'Search Nearby Hospitals'}
          </button>
          <button
            onClick={loadPunjabHospitals}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Show All Punjab Hospitals
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
          Government Hospitals {hospitals.length > 0 && `(${hospitals.length})`}
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading government hospitals...</p>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No government hospitals found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div key={hospital._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg text-gray-800">{hospital.name}</h4>
                <div className="mt-2 text-sm text-gray-600">
                  {hospital.location && (
                    <>
                      <p><span className="font-medium">Address:</span> {hospital.location.address}</p>
                      <p><span className="font-medium">City:</span> {hospital.location.city}</p>
                      <p><span className="font-medium">PIN Code:</span> {hospital.location.pinCode}</p>
                      <p><span className="font-medium">Coordinates:</span> {hospital.location.coordinates[1]}, {hospital.location.coordinates[0]}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Map View */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Map View</h3>
        <div className="rounded-lg overflow-hidden border border-gray-300 relative">
          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 mb-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2 border-2 border-white shadow"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2 border-2 border-white shadow"></div>
              <span>Government Hospitals</span>
            </div>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden border border-gray-300 relative">
            {searchParams.lat && searchParams.lng ? (
              <>
                {!mapError ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${searchParams.lng - 0.05},${searchParams.lat - 0.05},${searchParams.lng + 0.05},${searchParams.lat + 0.05}&layer=mapnik&marker=${searchParams.lat},${searchParams.lng}`}
                    title="Government Hospitals Map"
                    onError={handleMapError}
                    onLoad={handleMapLoad}
                    className={mapLoaded ? '' : 'hidden'}
                  ></iframe>
                ) : null}
                
                {/* Fallback static map or error message */}
                <div className={`${mapError || !mapLoaded ? 'flex' : 'hidden'} items-center justify-center h-full bg-gray-100`}>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">{mapError || 'Loading map...'}</p>
                    <div className="mt-4">
                      <button 
                        onClick={() => {
                          setMapError('');
                          setMapLoaded(false);
                          window.location.reload();
                        }} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                      >
                        Retry Map
                      </button>
                      <button 
                        onClick={loadPunjabHospitals} 
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Show All Punjab Hospitals
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-600">Enter an address to view map</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>📍 Map showing location for: {searchParams.address || 'Selected coordinates'}</p>
          <p className="text-gray-500 text-xs mt-1">Red marker: Your Location | Blue markers: Government Hospitals</p>
          <p className="text-gray-500 text-xs mt-1">Powered by OpenStreetMap</p>
        </div>
      </div>
    </div>
  );
};

export default VaccineMap;