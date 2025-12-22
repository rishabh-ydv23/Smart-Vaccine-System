import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiAward, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Mock certificates data - in real app, fetch from API
      const mockCertificates = [
        {
          _id: '1',
          vaccineName: 'COVID-19 Vaccine',
          vaccineType: 'Pfizer-BioNTech',
          doses: 2,
          completedDoses: 2,
          status: 'Fully Vaccinated',
          issueDate: '2024-01-15',
          expiryDate: '2025-01-15',
          certificateNumber: 'VAC-2024-001',
          issuedBy: 'Ministry of Health',
          qrCode: 'https://via.placeholder.com/150', // Placeholder for QR code
        },
        {
          _id: '2',
          vaccineName: 'Flu Vaccine',
          vaccineType: 'Influenza',
          doses: 1,
          completedDoses: 1,
          status: 'Fully Vaccinated',
          issueDate: '2024-02-20',
          expiryDate: '2024-08-20',
          certificateNumber: 'VAC-2024-002',
          issuedBy: 'City Health Department',
          qrCode: 'https://via.placeholder.com/150',
        },
      ];
      setCertificates(mockCertificates);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    // In real app, this would generate and download a PDF
    toast.success('Certificate download started');
    // Mock download
    const element = document.createElement('a');
    const file = new Blob([`Certificate for ${certificate.vaccineName}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `vaccination-certificate-${certificate.certificateNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = (certificate) => {
    if (navigator.share) {
      navigator.share({
        title: 'Vaccination Certificate',
        text: `My ${certificate.vaccineName} vaccination certificate`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.href} - My ${certificate.vaccineName} vaccination certificate`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vaccination Certificates</h1>
          <p className="text-gray-600">View and download your vaccination certificates</p>
        </motion.div>

        {/* Certificates List */}
        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FiAward className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates available</h3>
              <p className="text-gray-600">Complete your vaccinations to receive certificates.</p>
            </div>
          ) : (
            certificates.map((certificate, index) => (
              <motion.div
                key={certificate._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{certificate.vaccineName}</h3>
                      <p className="text-teal-100">{certificate.vaccineType}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiCheckCircle className="w-5 h-5" />
                        <span className="font-medium">{certificate.status}</span>
                      </div>
                      <p className="text-sm text-teal-100">
                        {certificate.completedDoses} of {certificate.doses} doses
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Certificate Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate Number:</span>
                          <span className="font-medium">{certificate.certificateNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issue Date:</span>
                          <span className="font-medium">{formatDate(certificate.issueDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="font-medium">{formatDate(certificate.expiryDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issued By:</span>
                          <span className="font-medium">{certificate.issuedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">QR Code</h4>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <img
                          src={certificate.qrCode}
                          alt="QR Code"
                          className="w-24 h-24"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Scan for verification
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FiShare2 className="w-4 h-4" />
                      <span>Share</span>
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
          className="mt-8 bg-blue-50 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <FiAward className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Certificate Information</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Certificates are issued upon completion of vaccination courses</li>
                <li>• Digital certificates are valid for verification purposes</li>
                <li>• Keep physical copies for official documentation</li>
                <li>• Report any issues with certificates to healthcare authorities</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;