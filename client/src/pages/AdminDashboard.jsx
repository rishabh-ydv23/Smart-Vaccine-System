import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VaccineManager from "../components/admin/VaccineManager";
import AppointmentManager from "../components/admin/AppointmentManager";
import Analytics from "../components/admin/Analytics";
import { useState, useEffect } from "react";
import React from "react";
import { FiLogOut, FiUser, FiActivity, FiCalendar, FiHome, FiMenu, FiX, FiShield, FiBarChart2, FiArrowRight, FiTrendingUp, FiUsers, FiCheckCircle } from "react-icons/fi";
import { motion } from 'framer-motion';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      const { data } = await api.get('/appointments/analytics');
      setStats({
        totalUsers: data.totalUsers || 0,
        totalAppointments: data.upcomingAppointments?.length || 0,
        totalVaccines: data.vaccines?.length || 0,
        pendingAppointments: data.statusCounts?.find(s => s._id === 'pending')?.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // restrict non-admin access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">🚫 Access Denied</h2>
          <p className="text-gray-600 mb-6">You are not authorized to view this page.</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col lg:flex-row">

      {/* Mobile Header */}
      <div className="lg:hidden bg-white/20 backdrop-blur-lg border-b border-white/30 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/30 p-2 rounded-full">
            <FiShield className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-white font-bold">Admin Panel</h3>
            <p className="text-white/70 text-xs">{user?.name}</p>
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
            <FiShield className="text-white text-2xl" />
          </div>
          <h3 className="text-white text-center mt-3 font-bold text-lg">Admin Panel</h3>
          <p className="text-white/70 text-center text-sm">{user?.name}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => {
              setTab('home');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              tab === 'home'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiHome /> Dashboard Home
          </button>

          <button
            onClick={() => {
              setTab('analytics');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              tab === 'analytics'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiBarChart2 /> Analytics
          </button>

          <button
            onClick={() => {
              setTab('vaccines');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              tab === 'vaccines'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiActivity /> Manage Vaccines
          </button>

          <button
            onClick={() => {
              setTab('appointments');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              tab === 'appointments'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiCalendar /> Manage Appointments
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
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-lg rounded-2xl p-4 lg:p-5 mb-4 lg:mb-6 border border-gray-200">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {tab === 'home' && '🏠 Admin Dashboard'}
              {tab === 'analytics' && '📊 Analytics Dashboard'}
              {tab === 'vaccines' && '💉 Manage Vaccines'}
              {tab === 'appointments' && '📅 Manage Appointments'}
            </h2>
            <p className="text-gray-600 text-xs lg:text-sm mt-1">
              {tab === 'home' && 'Welcome to the admin control panel'}
              {tab === 'analytics' && 'Comprehensive overview of your vaccine management system'}
              {tab === 'vaccines' && 'Add, update, and manage vaccine inventory'}
              {tab === 'appointments' && 'Approve or reject user appointments'}
            </p>
          </div>
        </header>

        <div className="max-w-6xl space-y-4 lg:space-y-6">

        {/* Home Tab */}
        {tab === 'home' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-16 rounded-2xl">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Admin Control Center
                  </h1>
                  <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
                    Manage your vaccine system efficiently with comprehensive tools for analytics, inventory, and appointments.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setTab('analytics')}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                    >
                      View Analytics
                      <FiArrowRight className="ml-2 w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setTab('vaccines')}
                      className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors border-2 border-white"
                    >
                      Manage Vaccines
                      <FiArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow border-purple-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg text-purple-600 bg-purple-50">
                        <FiUsers className="w-6 h-6" />
                      </div>
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
                    className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow border-blue-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg text-blue-600 bg-blue-50">
                        <FiCalendar className="w-6 h-6" />
                      </div>
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
                    className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow border-green-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg text-green-600 bg-green-50">
                        <FiActivity className="w-6 h-6" />
                      </div>
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
                    className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow border-orange-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg text-orange-600 bg-orange-50">
                        <FiCheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-4">Pending Reviews</h3>
                    </div>
                    <div className="text-gray-700">
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
                      <p className="text-sm text-gray-600">Awaiting approval</p>
                    </div>
                  </motion.div>
                </div>
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
                  <button
                    onClick={() => setTab('analytics')}
                    className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FiBarChart2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                      <p className="text-sm text-gray-600">View detailed reports</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTab('vaccines')}
                    className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FiActivity className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Manage Vaccines</h3>
                      <p className="text-sm text-gray-600">Add and update inventory</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTab('appointments')}
                    className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FiCalendar className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
                      <p className="text-sm text-gray-600">Review and approve</p>
                    </div>
                  </button>

                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-orange-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FiTrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">System Health</h3>
                      <p className="text-sm text-gray-600">Monitor performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <section className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200">
            <Analytics />
          </section>
        )}

        {/* Vaccines Tab */}
        {tab === 'vaccines' && (
          <section className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200">
            <VaccineManager />
          </section>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <section className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-200">
            <AppointmentManager />
          </section>
        )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;