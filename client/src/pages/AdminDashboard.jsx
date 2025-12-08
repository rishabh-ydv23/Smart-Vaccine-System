import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VaccineManager from "../components/admin/VaccineManager";
import MedicineManager from "../components/admin/MedicineManager";
import AppointmentManager from "../components/admin/AppointmentManager";
import { useState } from "react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("vaccines");

  // restrict non-admin access
  if (user?.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🚫 Access Denied</h2>
        <p>You are not authorized to view this page.</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard ⚙️</h2>
        <button
          onClick={logout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <br />

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setTab("vaccines")}>Vaccines</button>
        <button onClick={() => setTab("medicines")}>Medicines</button>
        <button onClick={() => setTab("appointments")}>Appointments</button>
      </div>

      <hr />

      {/* Conditional Section */}
      {tab === "vaccines" && <VaccineManager />}
      {tab === "medicines" && <MedicineManager />}
      {tab === "appointments" && <AppointmentManager />}
    </div>
  );
};

export default AdminDashboard;
