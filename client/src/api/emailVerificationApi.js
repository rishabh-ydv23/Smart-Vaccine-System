import api from './axios';

export const emailVerificationApi = {
  // Send OTP to user's email
  sendOtp: async (email) => {
    try {
      const response = await api.post('/email-verification/send-otp', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to send OTP');
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post('/email-verification/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Invalid or expired OTP');
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  // Resend OTP
  resendOtp: async (email) => {
    try {
      const response = await api.post('/email-verification/resend-otp', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to resend OTP');
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }
};