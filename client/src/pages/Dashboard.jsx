import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import VaccineList from "../components/VaccineList";
import React from "react";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Hello, {user?.name} 👋</h2>
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

      {/* Appointment Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Your Appointments</h3>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table width="100%" border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.vaccineId?.name || "N/A"}</td>
                  <td>{new Date(a.date).toLocaleString()}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Vaccine Booking Section */}
      <section>
        <h3>Book New Appointment</h3>
        <VaccineList refreshAppointments={fetchAppointments} />
      </section>
    </div>
  );
};

export default Dashboard;
