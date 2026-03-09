import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Simple layout for public pages with navigation
const Layout = ({ children }) => (
  <>
    <Navigation />
    {children}
  </>
);

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/book-vaccine" element={<Layout><BookVaccine /></Layout>} />
          <Route path="/doctor-consultation" element={<Layout><DoctorConsultation /></Layout>} />
          <Route path="/appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
          <Route path="/nearby-hospitals" element={<Layout><NearbyHospitals /></Layout>} />
          <Route path="/certificate" element={<Layout><Certificate /></Layout>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
