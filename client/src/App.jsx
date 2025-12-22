import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookVaccine from "./pages/BookVaccine";
import DoctorConsultation from "./pages/DoctorConsultation";
import MyAppointments from "./pages/MyAppointments";
import NearbyHospitals from "./pages/NearbyHospitals";
import Certificate from "./pages/Certificate";
import Profile from "./pages/Profile";
import Navigation from "./components/Navigation";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const UserRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  // Redirect based on role
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<UserRoute><Dashboard /></UserRoute>} />
          <Route path="/book-vaccine" element={<UserRoute><BookVaccine /></UserRoute>} />
          <Route path="/doctor-consultation" element={<UserRoute><DoctorConsultation /></UserRoute>} />
          <Route path="/appointments" element={<UserRoute><MyAppointments /></UserRoute>} />
          <Route path="/nearby-hospitals" element={<UserRoute><NearbyHospitals /></UserRoute>} />
          <Route path="/certificate" element={<UserRoute><Certificate /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
