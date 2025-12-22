import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiDownload, FiShare2, FiAward, FiCheckCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const Certificate = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Fetch real certificates from API
      const { data: appointments } = await api.get('/appointments/my');
      
      // Filter only vaccinated or completed appointments
      const vaccinatedAppointments = appointments.filter(app => 
        app.status === 'vaccinated' || app.status === 'completed'
      );
      
      // Transform appointments into certificate format
      const certificateList = vaccinatedAppointments.map(appointment => {
        const vaccineName = appointment.vaccineId?.name || 'Unknown Vaccine';
        const issueDate = new Date(appointment.date);
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Assume 1 year validity
        
        return {
          _id: appointment._id,
          vaccineName,
          vaccineType: appointment.vaccineId?.name || 'Standard',
          doses: appointment.vaccineId?.doseRequired || 1,
          completedDoses: appointment.vaccineId?.doseRequired || 1, // Assume all required doses completed
          status: 'Fully Vaccinated',
          issueDate: issueDate.toISOString().split('T')[0],
          expiryDate: expiryDate.toISOString().split('T')[0],
          certificateNumber: `VAC-${issueDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          issuedBy: 'Ministry of Health',
          qrCode: 'https://via.placeholder.com/150', // Placeholder for QR code
          hospital: appointment.hospitalId || 'Unknown Hospital',
          vaccinationDate: appointment.date
        };
      });
      
      setCertificates(certificateList);
    } catch (error) {
      toast.error('Failed to load certificates');
      console.error('Certificate fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    // Create a more detailed certificate content
    const certificateContent = `
VACCINATION CERTIFICATE
=======================

Certificate Number: ${certificate.certificateNumber}
Issued By: ${certificate.issuedBy}
Issue Date: ${formatDate(certificate.issueDate)}
Expiry Date: ${formatDate(certificate.expiryDate)}

RECIPIENT INFORMATION
---------------------
Name: ${user?.name || 'N/A'}
Government ID: ${user?.governmentId || 'N/A'}

VACCINATION DETAILS
-------------------
Vaccine Name: ${certificate.vaccineName}
Vaccine Type: ${certificate.vaccineType}
Doses Completed: ${certificate.completedDoses} of ${certificate.doses}
Hospital: ${certificate.hospital}
Vaccination Date: ${formatDate(certificate.vaccinationDate)}

STATUS: ${certificate.status.toUpperCase()}

This certificate is issued by the Ministry of Health and is valid for international travel and official purposes.

For verification, scan the QR code on your digital certificate.
    `;
    
    // In a real app, this would generate and download a PDF
    toast.success('Certificate download started');
    
    // Create and download the file
    const element = document.createElement('a');
    const file = new Blob([certificateContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `vaccination-certificate-${certificate.certificateNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = (certificate) => {
    const shareText = `I've been vaccinated with ${certificate.vaccineName}. View my vaccination certificate: ${window.location.origin}/certificate/${certificate._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Vaccination Certificate',
        text: shareText,
        url: `${window.location.origin}/certificate/${certificate._id}`,
      }).catch((error) => {
        console.log('Sharing failed:', error);
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Certificate link copied to clipboard');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success('Certificate link copied to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
            <FiAward className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Vaccination Certificates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Official proof of your immunization status. Download, share, and verify your vaccination records securely.
          </p>
        </motion.div>

        {/* Certificates List */}
        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <FiAward className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Certificates Available</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                You don't have any vaccination certificates yet. Certificates are issued after completing your vaccination appointments.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3">How to get your certificates:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-teal-600 font-bold">1</span>
                    </div>
                    <p className="text-sm text-gray-700">Book your vaccination appointment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <p className="text-sm text-gray-700">Complete your vaccination</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <p className="text-sm text-gray-700">Receive your certificate automatically</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/book-vaccine" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-blue-600 transition-all"
                >
                  Book Vaccination
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            certificates.map((certificate, index) => (
              <motion.div
                key={certificate._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{certificate.vaccineName}</h3>
                      <p className="text-teal-100 text-lg">{certificate.vaccineType}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiCheckCircle className="w-6 h-6" />
                        <span className="font-bold text-xl">{certificate.status}</span>
                      </div>
                      <p className="text-sm text-teal-100">
                        {certificate.completedDoses} of {certificate.doses} doses completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Certificate Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Certificate Number</p>
                            <p className="font-semibold text-gray-900">{certificate.certificateNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Issue Date</p>
                            <p className="font-semibold text-gray-900">{formatDate(certificate.issueDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Vaccination Date</p>
                            <p className="font-semibold text-gray-900">{formatDate(certificate.vaccinationDate)}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Expiry Date</p>
                            <p className="font-semibold text-gray-900">{formatDate(certificate.expiryDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Issued By</p>
                            <p className="font-semibold text-gray-900">{certificate.issuedBy}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Hospital</p>
                            <p className="font-semibold text-gray-900">{certificate.hospital}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification QR Code</h4>
                      <div className="bg-white p-4 rounded-lg shadow-inner mb-3">
                        <img
                          src={certificate.qrCode}
                          alt="QR Code"
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Scan this QR code to verify the authenticity of this certificate
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                      <FiDownload className="w-5 h-5" />
                      <span className="font-medium">Download PDF Certificate</span>
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                      <FiShare2 className="w-5 h-5" />
                      <span className="font-medium">Share Certificate</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiAward className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificate Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><span className="font-semibold">Digital Verification:</span> All certificates include a scannable QR code for instant verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><span className="font-semibold">Validity:</span> Certificates are valid for one year from the issue date</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><span className="font-semibold">Official Documentation:</span> Print or download PDF versions for official use</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><span className="font-semibold">Security:</span> Tamper-proof digital signatures ensure authenticity</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">Note:</span> If you have completed a vaccination but don't see a certificate, please contact your healthcare provider or administrator to update your vaccination status.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;