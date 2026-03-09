import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiShield, FiAward, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcomingAppointment: null,
    vaccinationStatus: 'Not Started',
    certificatesAvailable: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: appointments } = await api.get('/appointments/my');

      // Calculate stats
      const upcoming = appointments
        .filter(a => a.status === 'confirmed' && new Date(a.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

      const completedCount = appointments.filter(a =>
        a.status === 'completed' || a.status === 'vaccinated'
      ).length;

      const totalAppointments = appointments.length;
      let vaccinationStatus = 'Not Started';
      if (completedCount > 0) {
        vaccinationStatus = completedCount === totalAppointments ? 'Fully Vaccinated' : 'Partially Vaccinated';
      }

      const certificatesAvailable = appointments.filter(a =>
        a.status === 'completed' || a.status === 'vaccinated'
      ).length;

      setStats({
        upcomingAppointment: upcoming,
        vaccinationStatus,
        certificatesAvailable,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const infoCards = [
    {
      title: 'Upcoming Appointment',
      icon: FiCalendar,
      content: stats.upcomingAppointment ? (
        <div>
          <p className="font-medium text-gray-900">
            {stats.upcomingAppointment.vaccineId?.name || 'Vaccination'}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(stats.upcomingAppointment.date).toLocaleDateString()} at {stats.upcomingAppointment.time}
          </p>
          <p className="text-sm text-gray-600">
            {stats.upcomingAppointment.hospitalId?.name || 'Hospital'}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">No upcoming appointments</p>
      ),
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Vaccination Status',
      icon: FiShield,
      content: (
        <div className="flex items-center space-x-2">
          <FiCheckCircle className={`w-5 h-5 ${
            stats.vaccinationStatus === 'Fully Vaccinated' ? 'text-green-600' :
            stats.vaccinationStatus === 'Partially Vaccinated' ? 'text-yellow-600' : 'text-gray-400'
          }`} />
          <span className="font-medium">{stats.vaccinationStatus}</span>
        </div>
      ),
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      title: 'Certificates Available',
      icon: FiAward,
      content: (
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.certificatesAvailable}</p>
          <p className="text-sm text-gray-600">Digital certificates ready</p>
        </div>
      ),
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Protect Your Health with<br />
              <span className="text-teal-100">Timely Vaccination</span>
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Stay healthy and protected with our comprehensive vaccination services.
              Book appointments, consult doctors, and manage your health records all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-vaccine"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Book Vaccine
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/nearby-hospitals"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors border-2 border-white"
              >
                Find Nearby Hospitals
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Cards Section - Only for logged in users */}
      {user && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Health Dashboard</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Keep track of your vaccination journey and manage your healthcare needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {infoCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                  className={`bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow ${card.color}`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${card.iconColor} bg-white`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-4">{card.title}</h3>
                  </div>
                  <div className="text-gray-700">
                    {card.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Login Prompt for non-logged in users */}
      {!user && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Your Health Dashboard</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Login to view your vaccination status, manage appointments, and access personalized health services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-teal-600"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-600">Access our services with just one click</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/book-vaccine"
              className="group bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-teal-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiShield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Book Vaccine</h3>
                <p className="text-sm text-gray-600">Schedule your vaccination appointment</p>
              </div>
            </Link>

            <Link
              to="/doctor-consultation"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Doctor Consultation</h3>
                <p className="text-sm text-gray-600">Connect with healthcare professionals</p>
              </div>
            </Link>

            <Link
              to="/appointments"
              className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Appointments</h3>
                <p className="text-sm text-gray-600">View and manage your appointments</p>
              </div>
            </Link>

            <Link
              to="/certificate"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Certificates</h3>
                <p className="text-sm text-gray-600">Download your vaccination certificates</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;