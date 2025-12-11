import React, { useEffect, useState } from "react";
import api from "../api/axios";

const VaccineList = ({ refreshAppointments }) => {
  const [vaccines, setVaccines] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

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

      alert("Appointment booked successfully! Your slot is reserved for 5 minutes.");

      // Refresh dashboard appointment list after booking
      if (refreshAppointments) refreshAppointments();

      setSelected("");
      setDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-800 font-medium flex items-center gap-2">
          <span>⏱️</span> Each appointment slot is 5 minutes
        </p>
        <p className="text-blue-700 text-sm mt-1">
          If a slot is already booked by another user, you'll need to select a different time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Vaccine Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Vaccine</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none bg-white"
          >
            <option value="">Choose a Vaccine</option>
            {vaccines.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} (Stock: {v.availableQuantity})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <button
        onClick={bookAppointment}
        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Book Appointment (5-min slot)
      </button>

      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
        <p className="text-yellow-800 text-sm">
          💡 <strong>Tip:</strong> Choose times in 5-minute intervals (e.g., 10:00, 10:05, 10:10) for better availability.
        </p>
      </div>
    </div>
  );
};

export default VaccineList;
