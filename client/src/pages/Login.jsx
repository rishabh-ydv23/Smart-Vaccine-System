import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FiMail, FiLock, FiShield } from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("📤 Sending login request with:", {
        email: form.email,
        password: form.password ? "***" : "empty"
      });
      
      const response = await api.post("/auth/login", form);
      console.log("📥 Received login response:", response.data);
      
      // Check if response has the expected structure
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error("Invalid response structure from server");
      }
      
      const { user, token } = response.data;
      
      // Validate user object
      if (!user._id || !user.email) {
        throw new Error("User data is incomplete");
      }
      
      // Create user object with proper structure for AuthContext
      const userData = {
        _id: user._id,
        name: user.name || '',
        email: user.email,
        role: user.role || 'user', // Default to 'user' if no role
        token: token
      };
      
      console.log("👤 Processed user data:", userData);
      
      // Login with properly structured data
      login(userData);
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        console.log("➡️ Redirecting to admin dashboard");
        navigate("/admin");
      } else {
        console.log("➡️ Redirecting to user dashboard");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("📄 Error response:", err.response?.data);
      console.error("🔢 Error status:", err.response?.status);
      
      if (err.response?.status === 503) {
        setError("Service temporarily unavailable. Please try again later.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.response?.status === 400) {
        setError(`Bad request: ${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        setError("Login endpoint not found. Please check the API URL.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else if (err.message.includes('Invalid response structure')) {
        setError("Server response format error. Please contact support.");
      } else {
        setError(`Login failed: ${err.response?.data?.message || err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill simple admin credentials
  const fillAdminCredentials = () => {
    setForm({
      email: "admin@vaccine.com",
      password: "CHANGE_ME_ADMIN_PASSWORD"
    });
    setIsAdminLogin(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 
      bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500">

      {/* Animated Glow Background */}
      <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl 
        w-full max-w-md border border-white/30 
        animate-[pulse_6s_ease-in-out_infinite]">

        {/* Title */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide 
            bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Vaccine Portal
          </h2>
          <p className="text-white/90 mt-2 text-xs md:text-sm">
            {isAdminLogin ? "Admin Login" : "User Login"}
          </p>
        </div>

        {/* Toggle Admin/User Login */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsAdminLogin(!isAdminLogin)}
             className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isAdminLogin 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white/30 text-white hover:bg-white/40'
            }`}
          >
            <FiShield className="mr-2" />
            {isAdminLogin ? "Admin Mode" : "Switch to Admin"}
          </button>
        </div>

        {/* Admin Credential Helper */}
        {isAdminLogin && (
          <div className="mb-4 text-center">
            <button
              onClick={fillAdminCredentials}
              className="text-xs text-yellow-200 hover:text-yellow-300 underline"
            >
              Fill simple admin credentials
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100/80 border-l-4 border-red-700 text-red-700 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-1">
              Email
            </label>
            <div className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
              border border-gray-300 focus-within:border-blue-600 
              transition-all">
              <FiMail className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
              <input
                type="email"
                name="email"
                placeholder={isAdminLogin ? "Admin email (admin@vaccine.com)" : "Enter your email"}
                className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                onChange={handleChange}
                value={form.email}
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
            <div className="flex items-center bg-white/80 p-2.5 md:p-3 rounded-xl 
              border border-gray-300 focus-within:border-blue-600 
              transition-all">
              <FiLock className="text-gray-600 mr-2 md:mr-3 text-base md:text-lg" />
              <input
                type="password"
                name="password"
                placeholder={isAdminLogin ? "Admin password (CHANGE_ME_ADMIN_PASSWORD)" : "Enter your password"}
                className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                onChange={handleChange}
                value={form.password}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 md:py-3 rounded-xl 
            bg-gradient-to-r from-blue-700 to-cyan-500 
            hover:from-blue-800 hover:to-cyan-600
            text-white font-semibold shadow-lg text-sm md:text-base
            transform transition duration-300 hover:scale-[1.03]
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              isAdminLogin ? "Admin Sign In" : "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-white/90 text-xs md:text-sm">
            Don't have an account?
            <button 
              onClick={() => navigate("/register")}
              className="text-yellow-300 hover:text-yellow-400 ml-1 font-medium hover:underline bg-transparent border-none cursor-pointer"
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;