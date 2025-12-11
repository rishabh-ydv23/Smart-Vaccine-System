import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import VaccineList from "../components/VaccineList";
import React from "react";
import { FiLogOut, FiCalendar, FiUser } from "react-icons/fi";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-5 mb-6 border border-white/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/30 p-3 rounded-full">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Hello, {user?.name} 👋</h2>
              <p className="text-white/70 text-sm">Welcome to your vaccine dashboard</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Appointments Section */}
        <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-purple-600" /> Your Appointments
          </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg font-medium">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">Book your first vaccine below</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full rounded-xl overflow-hidden shadow-md">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Vaccine</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Date & Time</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-b hover:bg-purple-50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800 text-sm">
                        {a.vaccineId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(a.date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            a.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : a.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* New Appointment / Vaccine List */}
        <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Book New Appointment
          </h3>
          <VaccineList refreshAppointments={fetchAppointments} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
