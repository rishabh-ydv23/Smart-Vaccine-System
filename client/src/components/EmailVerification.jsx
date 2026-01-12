import React, { useState } from 'react';
import { emailVerificationApi } from '../api/emailVerificationApi';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

const EmailVerification = ({ email, onComplete, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await emailVerificationApi.verifyOtp(email, otp);
      setSuccess(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      await emailVerificationApi.resendOtp(email);
      setCountdown(60); // 60 seconds countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 
      bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500">

      {/* Animated Glow Background */}
      <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl 
        w-full max-w-md border border-white/30 
        animate-[pulse_6s_ease-in-out_infinite]">

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-white/80 hover:text-white mb-4 text-sm"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        {/* Title */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide 
            bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Verify Your Email
          </h2>
          <p className="text-white/90 mt-2 text-xs md:text-sm">
            We've sent a 6-digit OTP to <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/80 border-l-4 border-red-700 text-red-700 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100/80 border-l-4 border-green-700 text-green-700 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium">Email verified successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          
          {/* OTP Input */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-1">
              Enter OTP
            </label>
            <div className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
              border border-gray-300 focus-within:border-blue-600 
              transition-all">
              <FiLock className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                disabled={loading || success}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || success || otp.length !== 6}
              className={`w-full py-2.5 md:py-3 rounded-xl 
              bg-gradient-to-r from-blue-700 to-cyan-500 
              hover:from-blue-800 hover:to-cyan-600
              text-white font-semibold shadow-lg text-sm md:text-base
              transform transition duration-300 hover:scale-[1.03]
              disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || countdown > 0}
              className={`w-full py-2.5 md:py-3 rounded-xl 
              ${(resendLoading || countdown > 0) 
                ? 'bg-gray-400 text-white' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'}
              font-semibold shadow-lg text-sm md:text-base
              transform transition duration-300 hover:scale-[1.03]
              disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {resendLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                `Resend OTP ${countdown > 0 ? `(${countdown}s)` : ''}`
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 md:py-3 rounded-xl 
              bg-gradient-to-r from-gray-500 to-gray-600 
              hover:from-gray-600 hover:to-gray-700
              text-white font-semibold shadow-lg text-sm md:text-base
              transform transition duration-300 hover:scale-[1.03]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;