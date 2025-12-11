import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [alert, setAlert] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setAlert("Account Created Successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setAlert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4
    bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-500">

      {/* Glow Background */}
      <div className="absolute w-[450px] h-[450px] bg-white/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-xl p-10 rounded-3xl 
      shadow-2xl w-full max-w-md border border-white/30
      animate-[pulse_7s_ease-in-out_infinite]">

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold 
          bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-white/90 mt-2 text-sm">
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
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name
            </label>
            <div
              className="flex items-center bg-white/80 p-3 rounded-xl 
              border border-gray-300 focus-within:border-teal-600 transition-all"
            >
              <FiUser className="text-gray-600 mr-3 text-lg" />
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full bg-transparent outline-none text-gray-800"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <div
              className="flex items-center bg-white/80 p-3 rounded-xl 
              border border-gray-300 focus-within:border-teal-600 transition-all"
            >
              <FiMail className="text-gray-600 mr-3 text-lg" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-gray-800"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div
              className="flex items-center bg-white/80 p-3 rounded-xl 
              border border-gray-300 focus-within:border-teal-600 transition-all"
            >
              <FiLock className="text-gray-600 mr-3 text-lg" />
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                className="w-full bg-transparent outline-none text-gray-800"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-teal-600 to-blue-600
            hover:from-teal-700 hover:to-blue-700
            text-white font-semibold shadow-lg 
            transform transition duration-300 hover:scale-[1.03]"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            Already have an account?
            <a
              href="/login"
              className="text-yellow-200 hover:text-yellow-300 ml-1 font-medium hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
