import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiSave, FiX } from "react-icons/fi";

const HospitalManager = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [newHospital, setNewHospital] = useState({
    name: "",
    address: "",
    city: "",
    pinCode: "",
    latitude: "",
    longitude: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all unique hospitals from vaccines
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/vaccines");
      
      // Extract unique hospitals from vaccine data
      const hospitalMap = {};
      data.forEach(vaccine => {
        const location = vaccine.location;
        if (location && location.address) {
          const key = `${location.address}-${location.city}-${location.pinCode}`;
          if (!hospitalMap[key]) {
            hospitalMap[key] = {
              name: location.address.split(',')[0], // Extract hospital name from address
              address: location.address,
              city: location.city,
              pinCode: location.pinCode,
              latitude: location.coordinates ? location.coordinates[1] : "",
              longitude: location.coordinates ? location.coordinates[0] : ""
            };
          }
        }
      });
      
      setHospitals(Object.values(hospitalMap));
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      // Create a dummy vaccine with this hospital to add it to the system
      const vaccineData = {
        name: `COVID-19 Vaccine at ${newHospital.name}`,
        doseRequired: 2,
        availableQuantity: 100,
        location: {
          type: "Point",
          coordinates: [parseFloat(newHospital.longitude), parseFloat(newHospital.latitude)],
          address: newHospital.address,
          city: newHospital.city,
          pinCode: newHospital.pinCode
        }
      };
      
      await api.post("/vaccines", vaccineData);
      setNewHospital({
        name: "",
        address: "",
        city: "",
        pinCode: "",
        latitude: "",
        longitude: ""
      });
      setShowAddForm(false);
      fetchHospitals();
    } catch (error) {
      console.error("Failed to add hospital:", error);
    }
  };

  const handleUpdateHospital = async (e) => {
    e.preventDefault();
    // Implementation for updating hospital would go here
    // Since hospitals are tied to vaccines, we'd need to update all vaccines at this location
  };

  const handleDeleteHospital = async (hospital) => {
    if (window.confirm("Are you sure you want to remove this hospital? This will remove all vaccines associated with this location.")) {
      try {
        // Find all vaccines at this location and delete them
        const { data: vaccines } = await api.get("/vaccines");
        const vaccinesToDelete = vaccines.filter(vaccine => 
          vaccine.location.address === hospital.address &&
          vaccine.location.city === hospital.city &&
          vaccine.location.pinCode === hospital.pinCode
        );
        
        // Delete all vaccines at this location
        await Promise.all(
          vaccinesToDelete.map(vaccine => api.delete(`/vaccines/${vaccine._id}`))
        );
        
        fetchHospitals();
      } catch (error) {
        console.error("Failed to delete hospital:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Manage Hospitals</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Add New Hospital
        </button>
      </div>

      {/* Add Hospital Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Add New Hospital</h4>
          <form onSubmit={handleAddHospital} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                value={newHospital.name}
                onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <input
                type="text"
                value={newHospital.address}
                onChange={(e) => setNewHospital({...newHospital, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={newHospital.city}
                onChange={(e) => setNewHospital({...newHospital, city: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
              <input
                type="text"
                value={newHospital.pinCode}
                onChange={(e) => setNewHospital({...newHospital, pinCode: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={newHospital.latitude}
                onChange={(e) => setNewHospital({...newHospital, latitude: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={newHospital.longitude}
                onChange={(e) => setNewHospital({...newHospital, longitude: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiSave /> Save Hospital
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                <FiX /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hospitals List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Hospital Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">City</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">PIN Code</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Coordinates</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                    <FiMapPin className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No hospitals found</p>
                  </td>
                </tr>
              ) : (
                hospitals.map((hospital, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{hospital.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{hospital.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{hospital.city}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{hospital.pinCode}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {hospital.latitude}, {hospital.longitude}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingHospital(hospital)}
                          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital)}
                          className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Hospital Form (if needed) */}
      {editingHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Edit Hospital</h4>
            <p className="text-gray-600 mb-4">To edit hospital information, please modify the vaccines associated with this location.</p>
            <button
              onClick={() => setEditingHospital(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManager;