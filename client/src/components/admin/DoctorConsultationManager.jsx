import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiCheck, FiX, FiClock, FiUser, FiCalendar, FiDollarSign } from "react-icons/fi";

const DoctorConsultationManager = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctor-consultations");
      setConsultations(data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/doctor-consultations/${id}/status`, { status });
      fetchConsultations();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Manage Doctor Consultations</h3>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Doctor</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Specialization</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 px-4 text-center text-gray-500">
                    <FiUser className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No doctor consultations found</p>
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => (
                  <tr key={consultation._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{consultation.userId?.name}</p>
                        <p className="text-gray-500 text-xs">{consultation.userId?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {consultation.doctorName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {consultation.specialization}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {consultation.consultationType}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      ₹{consultation.price}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {consultation.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateStatus(consultation._id, 'confirmed')}
                            className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title="Confirm"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(consultation._id, 'cancelled')}
                            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            title="Cancel"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {consultation.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(consultation._id, 'completed')}
                          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          title="Mark as Completed"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultationManager;