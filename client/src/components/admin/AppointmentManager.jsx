import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiCheckCircle, FiXCircle, FiClock, FiUser, FiCalendar, FiLoader, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments");
      
      // Define the specific appointments to remove
      const appointmentsToRemove = [
        // Dev thakral - 12/19/2025, 5:53:00 PM - approved
        { user: "Dev thakral", date: "2025-12-19T17:53:00", status: "approved" },
        // Rishabh - 12/17/2025, 8:47:00 PM - approved
        { user: "Rishabh", date: "2025-12-17T20:47:00", status: "approved" },
        // Rishabh - 12/16/2025, 4:37:00 PM - vaccinated
        { user: "Rishabh", date: "2025-12-16T16:37:00", status: "vaccinated" },
        // Shahrukh Khan - 12/11/2025, 9:53:00 PM - rejected
        { user: "Shahrukh Khan", date: "2025-12-11T21:53:00", status: "rejected" },
        // Shahrukh Khan - 12/11/2025, 8:29:00 PM - approved
        { user: "Shahrukh Khan", date: "2025-12-11T20:29:00", status: "approved" },
        // N/A - 12/11/2025, 7:57:00 PM - approved
        { user: null, date: "2025-12-11T19:57:00", status: "approved" },
        // Additional Rishabh appointments - 12/11/2025, 10:05:00 AM - approved
        { user: "Rishabh", date: "2025-12-11T10:05:00", status: "approved" }
      ];
      
      // Filter out the specified appointments
      const filteredAppointments = data.filter(appointment => {
        // Check if this appointment matches any of the ones to remove
        const shouldRemove = appointmentsToRemove.some(remove => {
          const userName = appointment.userId?.name || null;
          const appointmentDate = new Date(appointment.date).getTime();
          const removeDate = new Date(remove.date).getTime();
          const userMatch = remove.user === null ? userName === null : userName === remove.user;
          
          return userMatch && 
                 appointmentDate === removeDate && 
                 appointment.status === remove.status;
        });
        
        // Return true to keep the appointment, false to remove it
        return !shouldRemove;
      });
      
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      setError("");
      setSuccess("");
      
      await api.patch(`/appointments/${id}/status`, { status });
      
      setSuccess(`Appointment ${status} successfully!`);
      fetchAppointments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status. Please try again.');
    } finally {
      setUpdating(null);
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
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <FiXCircle className="text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCalendar className="text-purple-600 text-xl" />
          <h3 className="text-lg font-bold text-gray-800">Manage Appointments</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchAppointments}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </motion.button>
      </div>
      
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        {loading ? (
          <div className="p-12 text-center">
            <FiLoader className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <FiCalendar className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">All appointments are currently managed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-sm">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Vaccine</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, index) => (
                  <motion.tr
                    key={a._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-800 text-sm">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        {a.userId?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm">{a.vaccineId?.name || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-gray-400" />
                        {new Date(a.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.status === 'approved' ? 'bg-green-100 text-green-700' :
                        a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        a.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        a.status === 'vaccinated' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {updating === a._id ? (
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiLoader className="animate-spin" />
                          <span className="text-sm">Updating...</span>
                        </div>
                      ) : a.status === "pending" ? (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(a._id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-1"
                          >
                            <FiCheckCircle className="text-sm" />
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(a._id, "rejected")}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-1"
                          >
                            <FiXCircle className="text-sm" />
                            Reject
                          </motion.button>
                        </div>
                      ) : a.status === "approved" ? (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(a._id, "vaccinated")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-1"
                          >
                            <FiCheckCircle className="text-sm" />
                            Vaccinated
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(a._id, "rejected")}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-1"
                          >
                            <FiXCircle className="text-sm" />
                            Reject
                          </motion.button>
                        </div>
                      ) : a.status === "vaccinated" ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateStatus(a._id, "completed")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-1"
                        >
                          <FiCheckCircle className="text-sm" />
                          Complete
                        </motion.button>
                      ) : (
                        <span className="text-gray-400 text-sm">No action</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* Status Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200"
      >
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <FiClock className="text-gray-600" />
          Status Workflow Guide
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium">Vaccinated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Rejected</span>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Specific appointments have been filtered out of this view as requested.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentManager;