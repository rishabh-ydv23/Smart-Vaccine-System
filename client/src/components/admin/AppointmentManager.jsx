import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const { data } = await api.get("/appointments");
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status });
    fetchAppointments();
  };

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Manage Appointments</h3>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Vaccine</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, index) => (
                <tr key={a._id} className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">{a.userId?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm">{a.vaccineId?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{new Date(a.date).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      a.status === 'approved' ? 'bg-green-100 text-green-700' :
                      a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      a.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {a.status === "pending" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(a._id, "approved")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(a._id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {a.status !== "pending" && (
                      <span className="text-gray-400 text-sm">No action</span>
                    )}
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

export default AppointmentManager;
