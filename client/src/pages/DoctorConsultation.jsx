import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiStar, FiMessageSquare, FiVideo, FiFilter } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const DoctorConsultation = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    consultationType: '',
    availability: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState('09:00');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, filters]);

  const fetchDoctors = async () => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use the same doctors but with a slight delay to simulate API call
    const doctorsData = [
      {
        _id: '1',
        name: 'Dr. Rishabh Yadav',
        specialization: 'General Medicine',
        experience: 8,
        rating: 4.8,
        reviews: 124,
        availability: 'Available',
        consultationTypes: ['Chat', 'Video'],
        price: { chat: 500, video: 800 },
        avatar: 'https://via.placeholder.com/100',
      },
      {
        _id: '2',
        name: 'Dr. Dipanshu Patidar',
        specialization: 'Pediatrics',
        experience: 12,
        rating: 4.9,
        reviews: 89,
        availability: 'Available',
        consultationTypes: ['Chat', 'Video'],
        price: { chat: 600, video: 900 },
        avatar: 'https://via.placeholder.com/100',
      },
      {
        _id: '3',
        name: 'Dr. Dev Thakral',
        specialization: 'Cardiology',
        experience: 15,
        rating: 4.7,
        reviews: 156,
        availability: 'Limited',
        consultationTypes: ['Video'],
        price: { chat: 0, video: 1200 },
        avatar: 'https://via.placeholder.com/100',
      },
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setDoctors(doctorsData);
  };

  const applyFilters = () => {
    let filtered = doctors;

    if (filters.specialization) {
      filtered = filtered.filter(doctor => doctor.specialization === filters.specialization);
    }

    if (filters.consultationType) {
      filtered = filtered.filter(doctor =>
        doctor.consultationTypes.includes(filters.consultationType)
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(doctor => doctor.availability === filters.availability);
    }

    setFilteredDoctors(filtered);
  };

  const handleBookConsultation = (doctor, type) => {
    setSelectedDoctor(doctor);
    setSelectedType(type);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login?next=/doctor-consultation');
      return;
    }
    try {
      const bookingData = {
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        consultationType: selectedType,
        date: bookingDate,
        time: bookingTime,
        price: selectedDoctor.price[selectedType.toLowerCase()]
      };

      const response = await api.post('/doctor-consultations', bookingData);
      toast.success('Consultation booked successfully!');
      setShowBookingModal(false);
      // Reset form
      setSelectedDoctor(null);
      setSelectedType('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book consultation');
    }
  };
  const specializations = [...new Set(doctors.map(d => d.specialization))];
  const consultationTypes = ['Chat', 'Video'];
  const availabilities = ['Available', 'Limited'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Consultation</h1>
          <p className="text-gray-600">Connect with healthcare professionals for personalized medical advice</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <FiFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 mt-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                  <select
                    value={filters.consultationType}
                    onChange={(e) => setFilters({ ...filters, consultationType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Types</option>
                    {consultationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Availabilities</option>
                    {availabilities.map(avail => (
                      <option key={avail} value={avail}>{avail}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500">{doctor.experience} years experience</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-xs text-gray-500">({doctor.reviews} reviews)</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    doctor.availability === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.availability}
                  </span>
                </div>

                <div className="space-y-2">
                  {doctor.consultationTypes.map(type => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {type === 'Chat' ? (
                          <FiMessageSquare className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiVideo className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm">{type} Consultation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{doctor.price[type.toLowerCase()]}
                        </span>
                        <button
                          onClick={() => handleBookConsultation(doctor, type)}
                          className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your filters to find more doctors.</p>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Consultation</h3>
              
              <div className="mb-4">
                <p className="text-gray-600">Doctor: <span className="font-semibold">{selectedDoctor.name}</span></p>
                <p className="text-gray-600">Specialization: <span className="font-semibold">{selectedDoctor.specialization}</span></p>
                <p className="text-gray-600">Consultation Type: <span className="font-semibold">{selectedType}</span></p>
                <p className="text-gray-600">Price: <span className="font-semibold">₹{selectedDoctor.price[selectedType.toLowerCase()]}</span></p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingDate.toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(new Date(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {/* Generate time slots from 9:00 AM to 5:30 PM */}
                  {Array.from({ length: 17 }, (_, i) => {
                    if (i < 9) return null;
                    return (
                      <React.Fragment key={i}>
                        <option value={`${i.toString().padStart(2, '0')}:00`}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                        {i < 17 && (
                          <option value={`${i.toString().padStart(2, '0')}:30`}>
                            {i.toString().padStart(2, '0')}:30
                          </option>
                        )}
                      </React.Fragment>
                    );
                  })}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultation;