import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    } catch {
      setAlert("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        {alert && <p className="text-green-500 text-center">{alert}</p>}

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded mb-3"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-3"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
          />

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Register
          </button>
        </form>

        <p className="text-center mt-3 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-500 underline ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
