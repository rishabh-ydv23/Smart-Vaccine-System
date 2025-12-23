import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const VaccineManager = () => {
  const [vaccines, setVaccines] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    doseRequired: 1, 
    availableQuantity: 0,
    location: {
      type: 'Point',
      coordinates: [77.2088, 28.6139], // Default coordinates (New Delhi)
      address: '',
      city: '',
      pinCode: ''
    }
  });

  const fetchVaccines = async () => {
    const { data } = await api.get("/vaccines");
    setVaccines(data);
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleSubmit = async () => {
    try {
      // Prepare the vaccine data with location
      const vaccineData = {
        name: form.name,
        doseRequired: parseInt(form.doseRequired) || 1,
        availableQuantity: parseInt(form.availableQuantity) || 0,
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])],
          address: form.location.address,
          city: form.location.city,
          pinCode: form.location.pinCode
        }
      };
      
      await api.post("/vaccines", vaccineData);
      setForm({ 
        name: "", 
        doseRequired: 1, 
        availableQuantity: 0,
        location: {
          type: 'Point',
          coordinates: [77.2088, 28.6139],
          address: '',
          city: '',
          pinCode: ''
        }
      });
      fetchVaccines();
    } catch (err) {
      console.error('Error adding vaccine:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error adding vaccine';
      alert(`Error adding vaccine: ${errorMessage}`);
    }
  };

  const deleteVaccine = async (id) => {
    if (window.confirm("Delete vaccine?")) {
      await api.delete(`/vaccines/${id}`);
      fetchVaccines();
    }
  };

  return (
    <div className="space-y-5">
      {/* Form Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Add New Vaccine</h3>
        
        <div className="mb-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-blue-800 font-medium">📝 Instructions</p>
          <ul className="text-blue-700 text-sm mt-1 list-disc pl-5 space-y-1">
            <li>Enter the full vaccine name (e.g., "COVID-19 Vaccine (Pfizer)")</li>
            <li>Doses Required: Number of shots needed (1 or 2 typically)</li>
            <li>Stock Quantity: How many doses are available</li>
            <li>Location: Enter the address, city, PIN code, and coordinates where the vaccine will be available</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vaccine Name *</label>
            <input
              placeholder="e.g., COVID-19 Vaccine (Pfizer)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Doses Required *</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 1 or 2"
              value={form.doseRequired}
              onChange={(e) => setForm({ ...form, doseRequired: parseInt(e.target.value) || 1 })}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Stock Quantity *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 100"
              value={form.availableQuantity}
              onChange={(e) => setForm({ ...form, availableQuantity: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
            />
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Location Information</h4>
          <p className="text-blue-700 text-sm mb-3">Enter the location where this vaccine will be available</p>
          
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
              <input
                placeholder="Full address"
                value={form.location.address}
                onChange={(e) => setForm({
                  ...form, 
                  location: { ...form.location, address: e.target.value }
                })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input
                placeholder="City"
                value={form.location.city}
                onChange={(e) => setForm({
                  ...form, 
                  location: { ...form.location, city: e.target.value }
                })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code</label>
              <input
                placeholder="PIN code"
                value={form.location.pinCode}
                onChange={(e) => setForm({
                  ...form, 
                  location: { ...form.location, pinCode: e.target.value }
                })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={form.location.coordinates[0]}
                onChange={(e) => setForm({
                  ...form, 
                  location: { 
                    ...form.location, 
                    coordinates: [parseFloat(e.target.value) || 77.2088, form.location.coordinates[1]] 
                  }
                })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={form.location.coordinates[1]}
                onChange={(e) => setForm({
                  ...form, 
                  location: { 
                    ...form.location, 
                    coordinates: [form.location.coordinates[0], parseFloat(e.target.value) || 28.6139] 
                  }
                })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Add Vaccine
        </button>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Vaccine Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Doses Required</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vaccines.map((v, index) => (
                <tr key={v._id} className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">{v.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      v.availableQuantity > 50 ? 'bg-green-100 text-green-700' :
                      v.availableQuantity > 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {v.availableQuantity} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {v.doseRequired} dose{v.doseRequired > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {v.location ? (
                      <div>
                        <div>{v.location.address}</div>
                        <div className="text-xs text-gray-500">{v.location.city} - {v.location.pinCode}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No location</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => deleteVaccine(v._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VaccineManager;
