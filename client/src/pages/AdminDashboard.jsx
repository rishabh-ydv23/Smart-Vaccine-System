import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VaccineManager from "../components/admin/VaccineManager";
import AppointmentManager from "../components/admin/AppointmentManager";
import DoctorConsultationManager from "../components/admin/DoctorConsultationManager";
import HospitalManager from "../components/admin/HospitalManager";
import Analytics from "../components/admin/Analytics";
import { useState, useEffect } from "react";
import React from "react";
import { FiLogOut, FiUser, FiActivity, FiCalendar, FiHome, FiMenu, FiX, FiShield, FiBarChart2, FiArrowRight, FiTrendingUp, FiUsers, FiCheckCircle, FiMapPin, FiSearch, FiBell, FiSettings, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalVaccines: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/appointments/analytics');
      setStats({
        totalUsers: data.totalUsers || 0,
        totalAppointments: data.upcomingAppointments?.length || 0,
        totalVaccines: data.vaccines?.length || 0,
        pendingAppointments: data.statusCounts?.find(s => s._id === 'pending')?.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // restrict non-admin access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-red-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-red-100 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">🚫 Access Denied</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">You are not authorized to view this page. Admin privileges are required.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Go Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center"
              >
                <FiShield className="text-white text-sm" />
              </motion.div>
              <div>
                <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>

            {/* Desktop Menu Items - More Compact */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Dashboard', icon: FiHome },
                { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
                { id: 'vaccines', label: 'Vaccines', icon: FiActivity },
                { id: 'appointments', label: 'Appointments', icon: FiCalendar },
                { id: 'doctor-consultations', label: 'Consultations', icon: FiUsers },
                { id: 'hospitals', label: 'Hospitals', icon: FiMapPin }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      tab === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.id === 'appointments' && stats.pendingAppointments > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                        {stats.pendingAppointments > 99 ? '99+' : stats.pendingAppointments}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar - Compact */}
              <div className="hidden md:block relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchDashboardStats}
                disabled={loading}
                className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                title="Refresh Data"
              >
                <FiSettings className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.button>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-purple-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                {/* Mobile Search */}
                <div className="mb-3 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {[
                  { id: 'home', label: 'Dashboard', icon: FiHome },
                  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
                  { id: 'vaccines', label: 'Vaccines', icon: FiActivity },
                  { id: 'appointments', label: 'Appointments', icon: FiCalendar },
                  { id: 'doctor-consultations', label: 'Consultations', icon: FiUsers },
                  { id: 'hospitals', label: 'Hospitals', icon: FiMapPin }
                ].filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all ${
                        tab === item.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'appointments' && stats.pendingAppointments > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {stats.pendingAppointments}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-500">
            <span className="flex items-center">
              <FiHome className="mr-1" />
              Admin Panel
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {tab === 'home' && 'Dashboard'}
              {tab === 'analytics' && 'Analytics'}
              {tab === 'vaccines' && 'Vaccine Management'}
              {tab === 'appointments' && 'Appointment Management'}
              {tab === 'doctor-consultations' && 'Doctor Consultations'}
              {tab === 'hospitals' && 'Hospital Management'}
            </span>
          </nav>
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-4 lg:p-5 mb-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {tab === 'home' && '🏠 Admin Dashboard'}
                {tab === 'analytics' && '📊 Analytics Dashboard'}
                {tab === 'vaccines' && '💉 Manage Vaccines'}
                {tab === 'appointments' && '📅 Manage Appointments'}
                {tab === 'doctor-consultations' && '👨‍⚕️ Doctor Consultations'}
                {tab === 'hospitals' && '🏥 Manage Hospitals'}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base mt-1">
                {tab === 'home' && 'Welcome to the admin control panel'}
                {tab === 'analytics' && 'Comprehensive overview of your vaccine management system'}
                {tab === 'vaccines' && 'Add, update, and manage vaccine inventory'}
                {tab === 'appointments' && 'Approve or reject user appointments'}
                {tab === 'doctor-consultations' && 'Manage doctor consultations'}
                {tab === 'hospitals' && 'Add, update, and manage hospital locations'}
              </p>
            </div>
          </div>
        </motion.header>

        <div className="space-y-6">

        {/* Home Tab */}
        {tab === 'home' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Welcome Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Welcome to Admin Control Center
                  </h1>
                  <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
                    Manage your vaccine system efficiently with comprehensive tools for analytics, inventory, and appointments.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTab('analytics')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                    >
                      View Analytics
                      <FiArrowRight className="ml-2 w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTab('vaccines')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors border-2 border-white"
                    >
                      Manage Vaccines
                      <FiArrowRight className="ml-2 w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Info Cards Section */}
            <section className="py-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">System Overview</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Monitor key metrics and manage your vaccination platform effectively
                  </p>
                </motion.div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-lg border p-6 animate-pulse">
                        <div className="flex items-center mb-4">
                          <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
                          <div className="h-4 bg-gray-200 rounded w-24 ml-4"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 border-purple-200 hover:border-purple-300"
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-3 rounded-lg text-purple-600 bg-purple-50"
                        >
                          <FiUsers className="w-6 h-6" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-4">Total Users</h3>
                      </div>
                      <div className="text-gray-700">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-600">Registered users</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-300"
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-3 rounded-lg text-blue-600 bg-blue-50"
                        >
                          <FiCalendar className="w-6 h-6" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-4">Total Appointments</h3>
                      </div>
                      <div className="text-gray-700">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                        <p className="text-sm text-gray-600">Scheduled appointments</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 border-green-200 hover:border-green-300"
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-3 rounded-lg text-green-600 bg-green-50"
                        >
                          <FiActivity className="w-6 h-6" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-4">Available Vaccines</h3>
                      </div>
                      <div className="text-gray-700">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalVaccines}</p>
                        <p className="text-sm text-gray-600">Vaccine types</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-300"
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-3 rounded-lg text-orange-600 bg-orange-50"
                        >
                          <FiCheckCircle className="w-6 h-6" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-4">Pending Reviews</h3>
                      </div>
                      <div className="text-gray-700">
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
                        <p className="text-sm text-gray-600">Awaiting approval</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <p className="text-gray-600">Access management tools with just one click</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { tab: 'analytics', icon: FiBarChart2, color: 'purple', title: 'Analytics', desc: 'View detailed reports' },
                    { tab: 'vaccines', icon: FiActivity, color: 'green', title: 'Manage Vaccines', desc: 'Add and update inventory' },
                    { tab: 'appointments', icon: FiCalendar, color: 'blue', title: 'Appointments', desc: 'Review and approve' },
                    { tab: 'hospitals', icon: FiMapPin, color: 'orange', title: 'Hospitals', desc: 'Manage locations' }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.tab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTab(action.tab)}
                        className={`group bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-${action.color}-200`}
                      >
                        <div className="text-center">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`w-12 h-12 bg-${action.color}-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.desc}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200"
          >
            <Analytics />
          </motion.section>
        )}

        {/* Vaccines Tab */}
        {tab === 'vaccines' && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200"
          >
            <VaccineManager />
          </motion.section>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200"
          >
            <AppointmentManager />
          </motion.section>
        )}

        {/* Doctor Consultations Tab */}
        {tab === 'doctor-consultations' && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200"
          >
            <DoctorConsultationManager />
          </motion.section>
        )}

        {/* Hospitals Tab */}
        {tab === 'hospitals' && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200"
          >
            <HospitalManager />
          </motion.section>
        )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;