import React, { useEffect, useState } from "react";
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
    <div className="space-y-5">
      {/* Form Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Add New Vaccine</h3>
        
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input
            placeholder="Vaccine Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
          />

          <input
            type="number"
            placeholder="Dose Required"
            value={form.doseRequired}
            onChange={(e) => setForm({ ...form, doseRequired: e.target.value })}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.availableQuantity}
            onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Add Vaccine
        </button>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Vaccine Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Doses Required</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vaccines.map((v, index) => (
                <tr key={v._id} className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">{v.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      v.availableQuantity > 50 ? 'bg-green-100 text-green-700' :
                      v.availableQuantity > 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {v.availableQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{v.doseRequired}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => deleteVaccine(v._id)}
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

export default VaccineManager;
