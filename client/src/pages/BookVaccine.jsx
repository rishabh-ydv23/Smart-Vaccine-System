import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCheck, FiChevronRight, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const BookVaccine = () => {
  const [step, setStep] = useState(1);
  const [vaccines, setVaccines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchVaccines();
    fetchHospitals();
  }, []);

  const fetchVaccines = async () => {
    try {
      const { data } = await api.get('/vaccines');
      setVaccines(data);
    } catch (error) {
      toast.error('Failed to load vaccines');
    }
  };

  const fetchHospitals = async () => {
    // Mock hospitals data - in real app, fetch from API
    setHospitals([
      { _id: '1', name: 'City General Hospital', location: 'Downtown', availability: 'Available' },
      { _id: '2', name: 'Metro Health Center', location: 'Midtown', availability: 'Limited' },
      { _id: '3', name: 'Regional Medical Center', location: 'Uptown', availability: 'Available' },
    ]);
  };

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post('/appointments', {
        vaccineId: selectedVaccine._id,
        hospitalId: selectedHospital._id,
        date: selectedDate,
        time: selectedTime,
      });
      toast.success('Appointment booked successfully!');
      setShowConfirmModal(false);
      // Reset form
      setStep(1);
      setSelectedVaccine(null);
      setSelectedHospital(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-100';
      case 'Limited': return 'text-yellow-600 bg-yellow-100';
      case 'Full': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const steps = [
    { number: 1, title: 'Select Vaccine', icon: FiCheck },
    { number: 2, title: 'Select Hospital', icon: FiMapPin },
    { number: 3, title: 'Choose Date & Time', icon: FiCalendar },
    { number: 4, title: 'Confirm Booking', icon: FiClock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Vaccine</h1>
          <p className="text-gray-600">Follow the steps below to schedule your vaccination appointment</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  step >= s.number ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <s.icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > s.number ? 'bg-teal-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {steps.map((s) => (
              <div key={s.number} className="text-center mx-4">
                <p className={`text-sm font-medium ${
                  step >= s.number ? 'text-teal-600' : 'text-gray-500'
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a Vaccine</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaccines.map((vaccine) => (
                  <div
                    key={vaccine._id}
                    onClick={() => setSelectedVaccine(vaccine)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedVaccine?._id === vaccine._id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{vaccine.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{vaccine.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a Hospital</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital._id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedHospital?._id === hospital._id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <p className="text-sm text-gray-600">{hospital.location}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getAvailabilityColor(hospital.availability)}`}>
                      {hospital.availability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholderText="Choose a date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm border rounded-lg transition-all ${
                          selectedTime === time
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Vaccine:</span>
                  <span>{selectedVaccine?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hospital:</span>
                  <span>{selectedHospital?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{selectedTime}</span>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full mt-6 bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedVaccine) ||
                (step === 2 && !selectedHospital) ||
                (step === 3 && (!selectedDate || !selectedTime))
              }
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ml-auto"
            >
              Next
              <FiChevronRight className="inline w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to book this appointment? You will receive a confirmation email shortly.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300"
              >
                {loading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookVaccine;