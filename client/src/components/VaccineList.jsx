import { useEffect, useState } from "react";
import api from "../api/axios";

const VaccineList = ({ refreshAppointments }) => {
  const [vaccines, setVaccines] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const { data } = await api.get("/vaccines");
        setVaccines(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVaccines();
  }, []);

  const bookAppointment = async () => {
    if (!selected || !date) return alert("Please select vaccine and date.");

    try {
      await api.post("/appointments", { vaccineId: selected, date });

      alert("Appointment booked successfully!");

      // Refresh dashboard appointment list after booking
      if (refreshAppointments) refreshAppointments();

      setSelected("");
      setDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Select Vaccine</h4>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Choose a Vaccine</option>
        {vaccines.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name} (Stock: {v.availableQuantity})
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={bookAppointment}
        style={{
          width: "100%",
          padding: "10px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Book Appointment
      </button>
    </div>
  );
};

export default VaccineList;
