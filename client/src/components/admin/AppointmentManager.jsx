import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
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
                      a.status === 'vaccinated' ? 'bg-purple-100 text-purple-700' :
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
                    {a.status === "approved" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(a._id, "vaccinated")}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                        >
                          Mark Vaccinated
                        </button>
                        <button 
                          onClick={() => updateStatus(a._id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {a.status === "vaccinated" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(a._id, "completed")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                        >
                          Complete Process
                        </button>
                      </div>
                    )}
                    {(a.status === "rejected" || a.status === "completed") && (
                      <span className="text-gray-400 text-sm">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Status Explanation */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Status Workflow Guide</h4>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
          <li><span className="font-medium">Pending</span> - Appointment requested by user</li>
          <li><span className="font-medium">Approved</span> - Admin has approved the appointment</li>
          <li><span className="font-medium">Vaccinated</span> - User has received the vaccine (admin action)</li>
          <li><span className="font-medium">Completed</span> - Process finalized, certificate available</li>
          <li><span className="font-medium">Rejected</span> - Appointment cancelled/rejected</li>
        </ul>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
          <p>Note: Specific appointments have been filtered out of this view as requested.</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManager;