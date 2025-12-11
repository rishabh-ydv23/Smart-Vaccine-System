import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid Credentials");
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

        {/* Title */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide 
            bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Vaccine Portal
          </h2>
          <p className="text-white/90 mt-2 text-xs md:text-sm">Sign in to continue</p>
        </div>

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
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                onChange={handleChange}
                required
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
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-gray-800 text-sm md:text-base"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 md:py-3 rounded-xl 
            bg-gradient-to-r from-blue-700 to-cyan-500 
            hover:from-blue-800 hover:to-cyan-600
            text-white font-semibold shadow-lg text-sm md:text-base
            transform transition duration-300 hover:scale-[1.03]"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-white/90 text-xs md:text-sm">
            Don’t have an account?
            <a className="text-yellow-300 hover:text-yellow-400 ml-1 font-medium hover:underline" 
              href="/register">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
