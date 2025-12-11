import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import VaccineList from "../components/VaccineList";
import React from "react";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Hello, {user?.name}! 👋</h2>
            <p className="text-sm text-gray-500">Welcome to your dashboard</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Appointments Section */}
        <section className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h3>

            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments found.</p>
                <p className="text-gray-400 text-sm mt-1">Book your first appointment below!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Vaccine</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date & Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800 text-sm">{a.vaccineId?.name || "N/A"}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(a.date).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            a.status === 'completed' ? 'bg-green-100 text-green-700' :
                            a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Vaccine Booking Section */}
        <section>
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Book New Appointment</h3>
            <VaccineList refreshAppointments={fetchAppointments} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
