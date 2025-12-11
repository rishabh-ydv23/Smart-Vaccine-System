import React, { useEffect, useState } from "react";
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
    <div className="space-y-5">
      {/* Form Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Add New Medicine</h3>
        
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input 
            placeholder="Medicine Name" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          />

          <select 
            value={form.type} 
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white"
          >
            <option value="tablet">Tablet</option>
            <option value="syrup">Syrup</option>
            <option value="ointment">Ointment</option>
          </select>

          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <button 
          onClick={addMed}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Add Medicine
        </button>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Medicine Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meds.map((m, index) => (
                <tr key={m._id} className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">{m.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm capitalize">{m.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.stock > 50 ? 'bg-green-100 text-green-700' :
                      m.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {m.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => deleteMed(m._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicineManager;
