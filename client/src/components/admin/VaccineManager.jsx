import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const VaccineManager = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
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
    try {
      setLoading(true);
      const { data } = await api.get("/vaccines");
      setVaccines(data);
    } catch (err) {
      console.error('Error fetching vaccines:', err);
      setErrors({ fetch: 'Failed to load vaccines. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Vaccine name is required";
    if (form.doseRequired < 1) newErrors.doseRequired = "Dose required must be at least 1";
    if (form.availableQuantity < 0) newErrors.availableQuantity = "Stock quantity cannot be negative";
    if (!form.location.address.trim()) newErrors.address = "Address is required";
    if (!form.location.city.trim()) newErrors.city = "City is required";
    if (!form.location.pinCode.trim()) newErrors.pinCode = "PIN code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setErrors({});
      setSuccess("");
      
      // Prepare the vaccine data with location
      const vaccineData = {
        name: form.name.trim(),
        doseRequired: parseInt(form.doseRequired) || 1,
        availableQuantity: parseInt(form.availableQuantity) || 0,
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])],
          address: form.location.address.trim(),
          city: form.location.city.trim(),
          pinCode: form.location.pinCode.trim()
        }
      };
      
      await api.post("/vaccines", vaccineData);
      
      // Reset form
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
      
      setSuccess("Vaccine added successfully!");
      fetchVaccines();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error('Error adding vaccine:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error adding vaccine';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteVaccine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vaccine? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/vaccines/${id}`);
      setSuccess("Vaccine deleted successfully!");
      fetchVaccines();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Error deleting vaccine:', err);
      setErrors({ delete: 'Failed to delete vaccine. Please try again.' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
          >
            <FiCheckCircle className="text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </motion.div>
        )}
        
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <FiAlertCircle className="text-red-600 flex-shrink-0" />
            <p className="text-red-800">{errors.submit}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <FiPlus className="text-green-600" />
          <h3 className="text-lg font-bold text-gray-800">Add New Vaccine</h3>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-blue-800 font-medium mb-2">📝 Instructions</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Enter the full vaccine name (e.g., "COVID-19 Vaccine (Pfizer)")</li>
            <li>• Doses Required: Number of shots needed (1 or 2 typically)</li>
            <li>• Stock Quantity: How many doses are available</li>
            <li>• Location: Enter the address, city, PIN code, and coordinates where the vaccine will be available</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vaccine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., COVID-19 Vaccine (Pfizer)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doses Required <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 1 or 2"
                value={form.doseRequired}
                onChange={(e) => setForm({ ...form, doseRequired: parseInt(e.target.value) || 1 })}
                className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                  errors.doseRequired ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.doseRequired && <p className="text-red-500 text-xs mt-1">{errors.doseRequired}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 100"
                value={form.availableQuantity}
                onChange={(e) => setForm({ ...form, availableQuantity: parseInt(e.target.value) || 0 })}
                className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                  errors.availableQuantity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
              />
              {errors.availableQuantity && <p className="text-red-500 text-xs mt-1">{errors.availableQuantity}</p>}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-gray-600" />
              Location Information
            </h4>
            <p className="text-gray-600 text-sm mb-4">Enter the location where this vaccine will be available</p>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full address"
                  value={form.location.address}
                  onChange={(e) => setForm({
                    ...form, 
                    location: { ...form.location, address: e.target.value }
                  })}
                  className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={form.location.city}
                  onChange={(e) => setForm({
                    ...form, 
                    location: { ...form.location, city: e.target.value }
                  })}
                  className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                    errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="PIN code"
                  value={form.location.pinCode}
                  onChange={(e) => setForm({
                    ...form, 
                    location: { ...form.location, pinCode: e.target.value }
                  })}
                  className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${
                    errors.pinCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
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
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
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
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <motion.button 
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin" />
                Adding Vaccine...
              </>
            ) : (
              <>
                <FiPlus />
                Add Vaccine
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiPlus className="text-gray-600" />
            Vaccine Inventory ({vaccines.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vaccines...</p>
          </div>
        ) : errors.fetch ? (
          <div className="p-8 text-center">
            <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <p className="text-red-600 mb-4">{errors.fetch}</p>
            <button
              onClick={fetchVaccines}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : vaccines.length === 0 ? (
          <div className="p-12 text-center">
            <FiPlus className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccines found</h3>
            <p className="text-gray-600 mb-4">Add your first vaccine using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Vaccine Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Doses Required</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Location</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaccines.map((v, index) => (
                  <motion.tr
                    key={v._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-800 text-sm">{v.name}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        v.availableQuantity > 50 ? 'bg-green-100 text-green-700' :
                        v.availableQuantity > 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {v.availableQuantity} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {v.doseRequired} dose{v.doseRequired > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {v.location ? (
                        <div>
                          <div className="font-medium">{v.location.address}</div>
                          <div className="text-xs text-gray-500">{v.location.city} - {v.location.pinCode}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No location</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteVaccine(v._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-2"
                      >
                        <FiTrash2 className="text-sm" />
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VaccineManager;
