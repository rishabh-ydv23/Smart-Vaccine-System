import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiRefreshCw, FiX, FiCheckCircle, FiAlertCircle, FiPlayCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        setNeedsAuth(true);
        return;
      }
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiAlertCircle className="w-4 h-4" />;
      case 'confirmed': return <FiCheckCircle className="w-4 h-4" />;
      case 'completed': return <FiPlayCircle className="w-4 h-4" />;
      case 'cancelled': return <FiX className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${appointmentId}/cancel`);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString; // Assuming time is already in HH:MM format
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your vaccination and consultation appointments</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium ${
                viewMode === 'calendar' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar View
            </button>
          </div>
        </motion.div>

        {/* Login Prompt if not authenticated */}
        {needsAuth ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mb-6 shadow-lg">
              <FiCalendar className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Appointments</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Sign in to view and manage your vaccination and consultation appointments.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => navigate(`/login?next=${encodeURIComponent('/appointments')}`)}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-[1.02] transition-transform"
              >
                Sign in to view appointments
              </button>
              <Link to="/register" className="px-6 py-3 border border-teal-500 text-teal-600 rounded-lg font-medium">Create account</Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Appointments List */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600">You haven't booked any appointments yet.</p>
                  </div>
                ) : (
                  appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {appointment.vaccineId?.name || 'Consultation'}
                            </h3>
                            <span className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">{appointment.status}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <FiCalendar className="w-4 h-4" />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4" />
                              <span>{formatTime(appointment.time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiMapPin className="w-4 h-4" />
                              <span>{appointment.hospitalId?.name || 'Online'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                            <>
                              <button
                                onClick={() => handleReschedule(appointment)}
                                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                              >
                                <FiRefreshCw className="w-4 h-4" />
                                <span>Reschedule</span>
                              </button>
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                              >
                                <FiX className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Calendar View Placeholder */}
            {viewMode === 'calendar' && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Calendar view is coming soon. Please use list view for now.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 mb-6">
              Reschedule functionality will be implemented soon. Please contact support for now.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;