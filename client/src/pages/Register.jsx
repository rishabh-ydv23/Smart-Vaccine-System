import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FiUser, FiMail, FiLock, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import EmailVerification from "../components/EmailVerification";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", governmentId: "" });
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/register", form);
      
      // Check if email verification is required based on new response structure
      if (response.data.requiresVerification === true) {
        // Show email verification component
        setShowVerification(true);
      } else {
        setAlert("Account Created Successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      let errorMsg = "Something went wrong";
      if (err.response?.status === 503) {
        errorMsg = "Service temporarily unavailable. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showVerification ? (
        <EmailVerification 
          email={form.email}
          onComplete={(result) => {
            // Handle successful verification
            if (result && result.message) {
              setAlert(result.message);
            } else {
              setAlert("Email verified successfully! Please log in to continue.");
            }
            setTimeout(() => navigate("/login"), 1500);
          }}
          onCancel={() => {
            setShowVerification(false);
            setAlert("Please verify your email to complete registration.");
          }}
        />
      ) : (
        <div className="min-h-screen flex justify-center items-center p-4
        bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-500">

          {/* Glow Background */}
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative bg-white/20 backdrop-blur-xl p-6 md:p-10 rounded-3xl 
          shadow-2xl w-full max-w-md border border-white/30
          animate-[pulse_7s_ease-in-out_infinite]">

            {/* Back Button */}
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center text-white/80 hover:text-white mb-4 text-sm"
            >
              <FiArrowLeft className="mr-2" />
              Back to Login
            </button>

            {/* Heading */}
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold 
              bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-white/90 mt-2 text-xs md:text-sm">
                Join the Vaccine Management Portal
              </p>
            </div>

            {/* Alert */}
            {alert && (
              <div className={`border-l-4 p-3 rounded-lg mb-4 shadow ${
                alert.includes('Successfully') 
                  ? 'bg-green-100/80 border-green-700 text-green-800' 
                  : 'bg-red-100/80 border-red-700 text-red-800'
              }`}>
                <p className="text-sm font-medium">{alert}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-white mb-1">
                  Full Name
                </label>
                <div
                  className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
                  border border-gray-300 focus-within:border-teal-600 transition-all"
                >
                  <FiUser className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Government ID */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-white mb-1">
                  Government ID
                </label>
                <div
                  className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
                  border border-gray-300 focus-within:border-teal-600 transition-all"
                >
                  <FiCreditCard className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
                  <input
                    name="governmentId"
                    type="text"
                    placeholder="Enter your government ID"
                    className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-white/70 text-xs mt-1">Enter a unique government ID (e.g., passport, driver's license)</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-white mb-1">
                  Email
                </label>
                <div
                  className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
                  border border-gray-300 focus-within:border-teal-600 transition-all"
                >
                  <FiMail className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-white mb-1">
                  Password
                </label>
                <div
                  className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
                  border border-gray-300 focus-within:border-teal-600 transition-all"
                >
                  <FiLock className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 md:py-3 rounded-xl
                bg-gradient-to-r from-teal-600 to-blue-600
                hover:from-teal-700 hover:to-blue-700
                text-white font-semibold shadow-lg text-sm md:text-base
                transform transition duration-300 hover:scale-[1.03]
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-white/90 text-xs md:text-sm">
                Already have an account?
                <button
                  onClick={() => navigate("/login")}
                  className="text-yellow-200 hover:text-yellow-300 ml-1 font-medium hover:underline bg-transparent border-none cursor-pointer"
                  disabled={loading}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;