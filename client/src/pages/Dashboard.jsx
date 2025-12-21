import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import VaccineList from "../components/VaccineList";
import NearbyHospitalsFinder from "../components/NearbyHospitalsFinder";
import CertificateGenerator from "../components/CertificateGenerator";
import React from "react";
import { FiLogOut, FiCalendar, FiUser, FiActivity, FiMessageSquare, FiHome, FiMenu, FiX, FiCrosshair, FiAward, FiBell, FiChevronDown, FiChevronUp } from "react-icons/fi";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedAppointments, setExpandedAppointments] = useState({});

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data);
      
      // Generate sample notifications based on appointments
      const upcomingAppointments = data.filter(a => 
        a.status === 'approved' && 
        new Date(a.date) > new Date() && 
        new Date(a.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );
      
      const certificateEligible = data.filter(a => 
        (a.status === 'vaccinated' || a.status === 'completed') && 
        !localStorage.getItem(`cert_notified_${a._id}`)
      );
      
      const newNotifications = [
        ...upcomingAppointments.map(a => ({
          id: `appt_${a._id}`,
          type: 'appointment',
          message: `Upcoming vaccination: ${a.vaccineId?.name || 'N/A'} on ${new Date(a.date).toLocaleDateString()}`,
          date: a.date
        })),
        ...certificateEligible.map(a => ({
          id: `cert_${a._id}`,
          type: 'certificate',
          message: `Certificate available for ${a.vaccineId?.name || 'N/A'}`,
          date: a.date
        }))
      ];
      
      setNotifications(newNotifications);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Clean, user-friendly date/time format
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

  // Calculate days until next appointment
  const daysUntilNextAppointment = () => {
    const upcomingAppointments = appointments
      .filter(a => a.status === 'approved' && new Date(a.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingAppointments.length === 0) return null;
    
    const nextAppointment = upcomingAppointments[0];
    const today = new Date();
    const appointmentDate = new Date(nextAppointment.date);
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { days: diffDays, appointment: nextAppointment };
  };

  // Count completed vaccinations
  const completedVaccinationsCount = appointments.filter(a => 
    a.status === 'completed' || a.status === 'vaccinated'
  ).length;

  // Toggle appointment expansion
  const toggleAppointmentExpansion = (id) => {
    setExpandedAppointments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get nearest hospital (mock data for now)
  const nearestHospital = {
    name: "Government Medical College & Hospital",
    distance: "2.5 km"
  };

  // Get countdown to next dose
  const nextDoseCountdown = () => {
    const nextAppointment = daysUntilNextAppointment();
    if (!nextAppointment) return null;
    
    return nextAppointment.days > 0 
      ? `${nextAppointment.days} day${nextAppointment.days > 1 ? 's' : ''}`
      : "Today";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 flex flex-col lg:flex-row">
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/80 backdrop-blur-lg p-3 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <FiBell className="text-purple-600 text-xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-gray-700 text-sm">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <FiUser className="text-purple-600 text-lg" />
          </div>
          <div>
            <h3 className="text-gray-800 font-bold">{user?.name}</h3>
            <p className="text-gray-600 text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-6 space-y-2 transition-transform duration-300 ease-in-out lg:mt-0 mt-[73px] shadow-xl`}>
        <div className="mb-8 hidden lg:block">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <FiUser className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-gray-800 text-center mt-3 font-bold text-lg">{user?.name}</h3>
          <p className="text-gray-600 text-center text-sm">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Dashboard Home"
          >
            <FiHome className="text-lg" /> Home
          </button>

          <button
            onClick={() => {
              setActiveTab('vaccine');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'vaccine'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Book Vaccine"
          >
            <FiActivity className="text-lg" /> Book Vaccine
          </button>

          <button
            onClick={() => {
              setActiveTab('consultation');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'consultation'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Doctor Consultation"
          >
            <FiMessageSquare className="text-lg" /> Doctor Consultation
          </button>

          <button
            onClick={() => {
              setActiveTab('appointments');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'appointments'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="My Appointments"
          >
            <FiCalendar className="text-lg" /> My Appointments
          </button>

          <button
            onClick={() => {
              setActiveTab('nearby');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'nearby'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Nearby Hospitals"
          >
            <FiCrosshair className="text-lg" /> Nearby Hospitals
          </button>

          <button
            onClick={() => {
              setActiveTab('certificate');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'certificate'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Certificates"
          >
            <FiAward className="text-lg" /> Certificate
          </button>
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-sm"
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 mt-[73px]"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm rounded-2xl p-5 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {activeTab === 'home' && 'Dashboard'}
                {activeTab === 'vaccine' && 'Book Vaccine Appointment'}
                {activeTab === 'consultation' && 'Doctor Consultation'}
                {activeTab === 'appointments' && 'My Appointments'}
                {activeTab === 'nearby' && 'Nearby Government Hospitals'}
                {activeTab === 'certificate' && 'Vaccination Certificate'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {activeTab === 'home' && 'Welcome to your health dashboard'}
                {activeTab === 'vaccine' && 'Schedule your vaccination appointment'}
                {activeTab === 'consultation' && 'Get medical advice from our doctors'}
                {activeTab === 'appointments' && 'View and manage your appointments'}
                {activeTab === 'nearby' && 'Find the nearest government hospital using your location'}
                {activeTab === 'certificate' && 'Generate and download your vaccination certificate'}
              </p>
            </div>
            <div className="bg-purple-100 px-4 py-2 rounded-full">
              <p className="text-purple-700 font-medium text-sm">
                Hello, {user?.name?.split(' ')[0] || 'User'}!
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl space-y-6">

        {/* Home Tab - Dashboard Overview */}
        {activeTab === 'home' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {/* Total Vaccines Taken */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FiActivity className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Vaccines Taken</p>
                    <p className="text-2xl font-bold text-gray-800">{completedVaccinationsCount}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FiCalendar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {appointments.filter(a => a.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Dose Countdown */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <FiCalendar className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Next Dose</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {nextDoseCountdown() || 'None scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nearest Vaccination Center */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <FiCrosshair className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Nearest Center</p>
                    <p className="text-lg font-bold text-gray-800 truncate">
                      {nearestHospital.name}
                    </p>
                    <p className="text-gray-600 text-xs">{nearestHospital.distance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Vaccination Progress</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiActivity className="text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">Dose 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${completedVaccinationsCount >= 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <FiActivity className={`${completedVaccinationsCount >= 1 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <span className={`font-medium ${completedVaccinationsCount >= 1 ? 'text-gray-700' : 'text-gray-400'}`}>Dose 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${completedVaccinationsCount >= 2 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <FiActivity className={`${completedVaccinationsCount >= 2 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <span className={`font-medium ${completedVaccinationsCount >= 2 ? 'text-gray-700' : 'text-gray-400'}`}>Booster</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (completedVaccinationsCount / 3) * 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                {completedVaccinationsCount === 0 && "Start your vaccination journey today!"}
                {completedVaccinationsCount === 1 && "Great job! You've completed your first dose."}
                {completedVaccinationsCount === 2 && "Almost there! One more dose to complete your vaccination."}
                {completedVaccinationsCount >= 3 && "Congratulations! You've completed all recommended doses."}
              </p>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Recent Appointments</h3>
              </div>
              
              {appointments.slice(0, 3).length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <FiCalendar className="text-gray-400 text-2xl" />
                  </div>
                  <h4 className="text-gray-800 font-medium text-lg mb-2">No appointments yet</h4>
                  <p className="text-gray-600 mb-4">Book your first vaccine to get started</p>
                  <button
                    onClick={() => setActiveTab('vaccine')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all"
                  >
                    Book Your First Vaccine
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {appointments.slice(0, 3).map((a) => (
                    <div key={a._id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{a.vaccineId?.name || 'N/A'}</h4>
                          <p className="text-gray-600 text-sm">{formatDateTime(a.date)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            a.status === 'completed' ? 'bg-green-100 text-green-700' :
                            a.status === 'vaccinated' ? 'bg-purple-100 text-purple-700' :
                            a.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                          </span>
                          <button 
                            onClick={() => toggleAppointmentExpansion(a._id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedAppointments[a._id] ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                        </div>
                      </div>
                      
                      {expandedAppointments[a._id] && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Status</p>
                              <p className="font-medium capitalize">{a.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Hospital</p>
                              <p className="font-medium">Government Medical Center</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Vaccine Booking Tab */}
        {activeTab === 'vaccine' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Book Vaccine Appointment</h3>
            </div>
            <div className="p-5">
              <VaccineList refreshAppointments={fetchAppointments} />
            </div>
          </div>
        )}

        {/* Doctor Consultation Tab */}
        {activeTab === 'consultation' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Request Doctor Consultation</h3>
            </div>
            <div className="p-5">
              <div className="space-y-5">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium flex items-center gap-2">
                    <span>💡</span> Get expert medical advice
                  </p>
                  <p className="text-blue-700 text-sm mt-1">Our doctors are available to answer your vaccine-related questions and health concerns.</p>
                </div>

                <form className="space-y-5">
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
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center text-sm">
                        <input type="radio" name="contact" className="mr-2" defaultChecked />
                        <span className="text-gray-700">Phone Call</span>
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="radio" name="contact" className="mr-2" />
                        <span className="text-gray-700">Video Call</span>
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="radio" name="contact" className="mr-2" />
                        <span className="text-gray-700">Email</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-all"
                  >
                    Submit Consultation Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-purple-600" /> All Your Appointments
              </h3>
              <button
                onClick={() => setActiveTab('vaccine')}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Book New
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto bg-gray-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-5">
                  <FiCalendar className="text-gray-400 text-3xl" />
                </div>
                <h4 className="text-gray-800 font-medium text-xl mb-2">No appointments found</h4>
                <p className="text-gray-600 mb-6">Book your first vaccine to get started</p>
                <button
                  onClick={() => setActiveTab('vaccine')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all"
                >
                  Book Your First Vaccine
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {appointments.map((a) => (
                  <div key={a._id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">{a.vaccineId?.name || 'N/A'}</h4>
                        <p className="text-gray-600 mt-1">{formatDateTime(a.date)}</p>
                        <p className="text-gray-500 text-sm mt-1">Government Medical Center</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          a.status === 'completed' ? 'bg-green-100 text-green-700' :
                          a.status === 'vaccinated' ? 'bg-purple-100 text-purple-700' :
                          a.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                        <button 
                          onClick={() => toggleAppointmentExpansion(a._id)}
                          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                        >
                          {expandedAppointments[a._id] ? 'Show Less' : 'View Details'}
                          {expandedAppointments[a._id] ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </div>
                    
                    {expandedAppointments[a._id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Status</p>
                          <p className="font-medium capitalize">{a.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Hospital</p>
                          <p className="font-medium">Government Medical Center</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Appointment ID</p>
                          <p className="font-mono text-sm">{a._id.substring(0, 8)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nearby Hospitals Tab */}
        {activeTab === 'nearby' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Nearby Government Hospitals</h3>
            </div>
            <div className="p-5">
              <NearbyHospitalsFinder />
            </div>
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === 'certificate' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Vaccination Certificate</h3>
            </div>
            <div className="p-5">
              <CertificateGenerator />
            </div>
          </div>
        )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;