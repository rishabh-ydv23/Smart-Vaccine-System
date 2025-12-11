import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VaccineManager from "../components/admin/VaccineManager";
import MedicineManager from "../components/admin/MedicineManager";
import AppointmentManager from "../components/admin/AppointmentManager";
import Analytics from "../components/admin/Analytics";
import { useState } from "react";
import React from "react";
import { FiLogOut, FiUser, FiActivity, FiPackage, FiCalendar, FiHome, FiMenu, FiX, FiShield, FiBarChart2 } from "react-icons/fi";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              setTab('medicines');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              tab === 'medicines'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FiPackage /> Manage Medicines
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
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-4 lg:p-5 mb-4 lg:mb-6 border border-white/30">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {tab === 'home' && '🏠 Admin Dashboard'}
              {tab === 'vaccines' && '💉 Manage Vaccines'}
              {tab === 'medicines' && '💊 Manage Medicines'}
              {tab === 'appointments' && '📅 Manage Appointments'}
            </h2>
            <p className="text-white/70 text-xs lg:text-sm mt-1">
              {tab === 'home' && 'Welcome to the admin control panel'}
              {tab === 'vaccines' && 'Add, update, and manage vaccine inventory'}
              {tab === 'medicines' && 'Add, update, and manage medicine stock'}
              {tab === 'appointments' && 'Approve or reject user appointments'}
            </p>
          </div>
        </header>

        <div className="max-w-6xl space-y-4 lg:space-y-6">

        {/* Home Tab */}
        {tab === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setTab('analytics')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-purple-100 p-3 lg:p-4 rounded-full">
                    <FiBarChart2 className="text-purple-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Analytics</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">View reports</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setTab('vaccines')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-green-100 p-3 lg:p-4 rounded-full">
                    <FiActivity className="text-green-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Vaccines</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">Manage inventory</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setTab('medicines')}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-blue-100 p-3 lg:p-4 rounded-full">
                    <FiPackage className="text-blue-600 text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg">Medicines</h4>
                    <p className="text-gray-600 text-xs lg:text-sm">Manage stock</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <button
                  onClick={() => setTab('analytics')}
                  className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-semibold shadow-md transition-all text-left"
                >
                  <p className="text-sm opacity-90">View</p>
                  <p className="text-lg">Analytics Report</p>
                </button>
                <button
                  onClick={() => setTab('vaccines')}
                  className="p-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-semibold shadow-md transition-all text-left"
                >
                  <p className="text-sm opacity-90">Add New</p>
                  <p className="text-lg">Vaccine</p>
                </button>
                <button
                  onClick={() => setTab('medicines')}
                  className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold shadow-md transition-all text-left"
                >
                  <p className="text-sm opacity-90">Add New</p>
                  <p className="text-lg">Medicine</p>
                </button>
                <button
                  onClick={() => setTab('appointments')}
                  className="p-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold shadow-md transition-all text-left"
                >
                  <p className="text-sm opacity-90">Review</p>
                  <p className="text-lg">Appointments</p>
                </button>
              </div>
            </section>
          </>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <Analytics />
          </section>
        )}

        {/* Vaccines Tab */}
        {tab === 'vaccines' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <VaccineManager />
          </section>
        )}

        {/* Medicines Tab */}
        {tab === 'medicines' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <MedicineManager />
          </section>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:p-6 border border-white/30">
            <AppointmentManager />
          </section>
        )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
