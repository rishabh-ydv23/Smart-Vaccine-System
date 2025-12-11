import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import VaccineList from "../components/VaccineList";
import React from "react";
import { FiLogOut, FiCalendar, FiUser, FiActivity, FiMessageSquare, FiHome, FiMenu, FiX } from "react-icons/fi";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ⭐ Clean, user-friendly date/time format
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/20 backdrop-blur-lg border-b border-white/30 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/30 p-2 rounded-full">
            <FiUser className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-white font-bold">{user?.name}</h3>
            <p className="text-white/70 text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/20 backdrop-blur-lg border-r border-white/30 p-6 space-y-2 transition-transform duration-300 ease-in-out lg:mt-0 mt-[73px]`}>
        <div className="mb-8 hidden lg:block">
          <div className="bg-white/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <FiUser className="text-white text-2xl" />
          </div>
          <h3 className="text-white text-center mt-3 font-bold text-lg">{user?.name}</h3>
          <p className="text-white/70 text-center text-sm">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiHome /> Home
          </button>

          <button
            onClick={() => {
              setActiveTab('vaccine');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'vaccine'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiActivity /> Book Vaccine
          </button>

          <button
            onClick={() => {
              setActiveTab('consultation');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'consultation'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiMessageSquare /> Doctor Consultation
          </button>

          <button
            onClick={() => {
              setActiveTab('appointments');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'appointments'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiCalendar /> My Appointments
          </button>
        </nav>

        <div className="pt-6 mt-6 border-t border-white/30">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all shadow-md"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[73px]"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-4 lg:p-5 mb-4 lg:mb-6 border border-white/30">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {activeTab === 'home' && '🏠 Dashboard Home'}
              {activeTab === 'vaccine' && '💉 Book Vaccine Appointment'}
              {activeTab === 'consultation' && '👨‍⚕️ Doctor Consultation'}
              {activeTab === 'appointments' && '📅 My Appointments'}
            </h2>
            <p className="text-white/70 text-xs lg:text-sm mt-1">
              {activeTab === 'home' && 'Welcome to your health dashboard'}
              {activeTab === 'vaccine' && 'Schedule your vaccination appointment'}
              {activeTab === 'consultation' && 'Get medical advice from our doctors'}
              {activeTab === 'appointments' && 'View and manage your appointments'}
            </p>
          </div>
      </header>

        <div className="max-w-6xl space-y-4 lg:space-y-6">

        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveTab('vaccine')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-blue-100 p-3 lg:p-4 rounded-full">
                    <FiActivity className="text-blue-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Book Vaccine</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">Schedule vaccination</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveTab('consultation')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-green-100 p-3 lg:p-4 rounded-full">
                    <FiMessageSquare className="text-green-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Consultation</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">Talk to a doctor</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveTab('appointments')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-purple-100 p-3 lg:p-4 rounded-full">
                    <FiCalendar className="text-purple-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Appointments</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">View schedule</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Recent Appointments</h3>
              {appointments.slice(0, 3).length === 0 ? (
                <p className="text-gray-600 text-center py-6 lg:py-8 text-sm lg:text-base">No appointments yet. Book your first vaccine!</p>
              ) : (
                <div className="space-y-2 lg:space-y-3">
                  {appointments.slice(0, 3).map((a) => (
                    <div key={a._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 lg:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm lg:text-base">{a.vaccineId?.name || 'N/A'}</p>
                        <p className="text-xs lg:text-sm text-gray-600">{formatDateTime(a.date)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        a.status === 'completed' ? 'bg-green-100 text-green-700' :
                        a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {a.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Vaccine Booking Tab */}
        {activeTab === 'vaccine' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <VaccineList refreshAppointments={fetchAppointments} />
          </section>
        )}

        {/* Doctor Consultation Tab */}
        {activeTab === 'consultation' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Request Doctor Consultation</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-800 font-medium">💡 Get expert medical advice</p>
                <p className="text-blue-700 text-sm mt-1">Our doctors are available to answer your vaccine-related questions and health concerns.</p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Reason</label>
                  <select className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Vaccine Side Effects</option>
                    <option>Pre-vaccination Consultation</option>
                    <option>Vaccination Schedule Query</option>
                    <option>General Health Query</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Query</label>
                  <textarea
                    rows="5"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Please describe your symptoms or questions in detail..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    <label className="flex items-center text-sm lg:text-base">
                      <input type="radio" name="contact" className="mr-2" defaultChecked />
                      <span className="text-gray-700">Phone Call</span>
                    </label>
                    <label className="flex items-center text-sm lg:text-base">
                      <input type="radio" name="contact" className="mr-2" />
                      <span className="text-gray-700">Video Call</span>
                    </label>
                    <label className="flex items-center text-sm lg:text-base">
                      <input type="radio" name="contact" className="mr-2" />
                      <span className="text-gray-700">Email</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
                >
                  Submit Consultation Request
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
              <FiCalendar className="text-purple-600" /> All Your Appointments
            </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-8 lg:py-10">
              <p className="text-gray-600 text-base lg:text-lg font-medium">No appointments found</p>
              <p className="text-gray-400 text-xs lg:text-sm mt-1">Book your first vaccine below</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <table className="w-full rounded-xl overflow-hidden shadow-md min-w-[500px]">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="py-2 lg:py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-semibold">Vaccine</th>
                    <th className="py-2 lg:py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-semibold">Date & Time</th>
                    <th className="py-2 lg:py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-b hover:bg-purple-50 transition">
                      <td className="py-2 lg:py-3 px-3 lg:px-4 font-medium text-gray-800 text-xs lg:text-sm">
                        {a.vaccineId?.name || "N/A"}
                      </td>

                      {/* ⭐ Updated user-friendly time */}
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-gray-600 text-xs lg:text-sm">
                        {formatDateTime(a.date)}
                      </td>

                      <td className="py-2 lg:py-3 px-3 lg:px-4">
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
        )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
