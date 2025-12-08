import { useEffect, useState } from "react";
import api from "../../api/axios";

const MedicineManager = () => {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({ name: "", type: "tablet", stock: 0 });

  const fetchMeds = async () => {
    const { data } = await api.get("/medicines");
    setMeds(data);
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const addMed = async () => {
    await api.post("/medicines", form);
    setForm({ name: "", type: "tablet", stock: 0 });
    fetchMeds();
  };

  const deleteMed = async (id) => {
    if (window.confirm("Delete medicine?")) {
      await api.delete(`/medicines/${id}`);
      fetchMeds();
    }
  };

  return (
    <div>
      <h3>Manage Medicines</h3>

      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <br /><br />

      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="tablet">Tablet</option>
        <option value="syrup">Syrup</option>
        <option value="ointment">Ointment</option>
      </select>
      <br /><br />

      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      /><br /><br />

      <button onClick={addMed} style={{ background: "green", color: "white", padding: "8px" }}>
        Add Medicine
      </button>

      <hr />

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meds.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.type}</td>
              <td>{m.stock}</td>
              <td>
                <button style={{ background: "red", color: "white" }} onClick={() => deleteMed(m._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineManager;
