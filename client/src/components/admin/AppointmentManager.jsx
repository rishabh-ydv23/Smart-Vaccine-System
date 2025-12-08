import { useEffect, useState } from "react";
import api from "../../api/axios";

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const { data } = await api.get("/appointments");
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status });
    fetchAppointments();
  };

  return (
    <div>
      <h3>Manage Appointments</h3>
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.userId?.name}</td>
              <td>{a.vaccineId?.name}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>
                {a.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(a._id, "approved")}>Approve</button>
                    <button onClick={() => updateStatus(a._id, "rejected")} style={{ marginLeft: "5px", color: "red" }}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentManager;
