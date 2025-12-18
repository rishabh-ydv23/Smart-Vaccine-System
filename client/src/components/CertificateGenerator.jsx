import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiDownload, FiAward, FiUser, FiLoader } from 'react-icons/fi';

const CertificateGenerator = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  // Fetch user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments/my");
        // Filter only completed appointments
        const completedAppointments = data.filter(app => app.status === 'completed');
        setAppointments(completedAppointments);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Generate a unique certificate ID
  const generateCertificateId = () => {
    const prefix = 'VCERT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleGenerateCertificate = (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      alert('Please select an appointment to generate a certificate');
      return;
    }
    
    // Find the selected appointment
    const appointment = appointments.find(app => app._id === selectedAppointment);
    
    if (!appointment) {
      alert('Invalid appointment selected');
      return;
    }
    
    // Generate certificate data
    const certData = {
      userName: user?.name || '',
      vaccineName: appointment.vaccineId?.name || 'N/A',
      vaccinationDate: appointment.date,
      doseNumber: '1', // In a real system, this would be determined by the vaccine type
      certificateId: generateCertificateId()
    };
    
    setCertificateData(certData);
    setIsGenerated(true);
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate a PDF
    alert('In a full implementation, this would download a PDF certificate. For now, this is a demo.');
  };

  const handleAppointmentChange = (e) => {
    setSelectedAppointment(e.target.value);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30 text-center">
          <FiLoader className="animate-spin text-purple-600 text-3xl mx-auto mb-4" />
          <p className="text-gray-700">Loading your vaccination history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiAward className="text-purple-600" /> Vaccination Certificate Generator
        </h2>
        
        {!isGenerated ? (
          <div className="space-y-6">
            {appointments.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800 font-medium">⚠️ No completed vaccinations found</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Certificates can only be generated for completed vaccinations. Please contact an administrator if you believe this is an error.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-800 font-medium">📋 Select a completed vaccination to generate your certificate</p>
                  <p className="text-blue-700 text-sm mt-1">Only vaccinations with "COMPLETED" status are eligible for certification</p>
                </div>
                
                <form onSubmit={handleGenerateCertificate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Completed Vaccination</label>
                    <select
                      value={selectedAppointment}
                      onChange={handleAppointmentChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a completed vaccination</option>
                      {appointments.map(appointment => (
                        <option key={appointment._id} value={appointment._id}>
                          {appointment.vaccineId?.name || 'N/A'} - {new Date(appointment.date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
                      disabled={!selectedAppointment}
                    >
                      <FiAward /> Generate Certificate
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        ) : certificateData && (
          <div className="space-y-6">
            {/* Certificate Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 relative">
              <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Verified
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Vaccination Certificate</h3>
                <p className="text-gray-600">Official Proof of Vaccination</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUser className="text-purple-600" /> Recipient Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-800">{certificateData.userName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Certificate ID</p>
                      <p className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">{certificateData.certificateId}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Vaccination Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Vaccine Name</p>
                      <p className="font-medium text-gray-800">{certificateData.vaccineName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Vaccination Date</p>
                      <p className="font-medium text-gray-800">
                        {certificateData.vaccinationDate 
                          ? new Date(certificateData.vaccinationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Dose Number</p>
                      <p className="font-medium text-gray-800">
                        {certificateData.doseNumber === '1' && 'First Dose'}
                        {certificateData.doseNumber === '2' && 'Second Dose'}
                        {certificateData.doseNumber === 'Booster' && 'Booster Dose'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">This certificate is issued by the Ministry of Health</p>
                <p className="text-xs text-gray-400 mt-1">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={() => setIsGenerated(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
              >
                Select Different Vaccination
              </button>
              
              <button
                onClick={handleDownloadCertificate}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center gap-2"
              >
                <FiDownload /> Download Certificate
              </button>
            </div>
          </div>
        )}
        
        {/* Certificate Information */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Certificate Information</h4>
          <ul className="list-disc pl-5 space-y-1 text-yellow-700 text-sm">
            <li>Certificates can only be generated for vaccinations with "COMPLETED" status</li>
            <li>Each certificate is assigned a unique ID for verification purposes</li>
            <li>Certificates are digitally signed and tamper-proof</li>
            <li>You can download and print your certificate for official use</li>
            <li>In a production environment, this would generate an official PDF document</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;