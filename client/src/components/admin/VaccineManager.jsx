import { useEffect, useState } from "react";
import api from "../../api/axios";

const VaccineManager = () => {
  const [vaccines, setVaccines] = useState([]);
  const [form, setForm] = useState({ name: "", doseRequired: 1, availableQuantity: 0 });

  const fetchVaccines = async () => {
    const { data } = await api.get("/vaccines");
    setVaccines(data);
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post("/vaccines", form);
      setForm({ name: "", doseRequired: 1, availableQuantity: 0 });
      fetchVaccines();
    } catch (err) {
      alert("Error adding vaccine");
    }
  };

  const deleteVaccine = async (id) => {
    if (window.confirm("Delete vaccine?")) {
      await api.delete(`/vaccines/${id}`);
      fetchVaccines();
    }
  };

  return (
    <div>
      <h3>Manage Vaccines</h3>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br /><br />

      <input
        type="number"
        placeholder="Dose Required"
        value={form.doseRequired}
        onChange={(e) => setForm({ ...form, doseRequired: e.target.value })}
      /><br /><br />

      <input
        type="number"
        placeholder="Stock"
        value={form.availableQuantity}
        onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
      /><br /><br />

      <button onClick={handleSubmit} style={{ padding: "8px", background: "green", color: "white" }}>
        Add Vaccine
      </button>

      <hr />

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Doses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((v) => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.availableQuantity}</td>
              <td>{v.doseRequired}</td>
              <td>
                <button onClick={() => deleteVaccine(v._id)} style={{ background: "red", color: "white" }}>
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

export default VaccineManager;
