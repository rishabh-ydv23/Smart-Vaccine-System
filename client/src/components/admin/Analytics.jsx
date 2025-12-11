import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    upcomingAppointments: [],
    vaccinationStats: [],
    vaccines: [],
    statusCounts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/appointments/analytics");
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format data for charts
  const vaccinationData = analytics.vaccinationStats.map(stat => ({
    name: stat.name,
    value: stat.count
  }));

  const statusData = analytics.statusCounts.map(status => ({
    name: status._id.charAt(0).toUpperCase() + status._id.slice(1),
    value: status.count
  }));

  const stockData = analytics.vaccines.map(vaccine => ({
    name: vaccine.name,
    stock: vaccine.availableQuantity
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{analytics.totalUsers}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Upcoming Appointments</h3>
          <p className="text-3xl font-bold mt-2">{analytics.upcomingAppointments.length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Vaccine Types</h3>
          <p className="text-3xl font-bold mt-2">{analytics.vaccines.length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Completed Vaccinations</h3>
          <p className="text-3xl font-bold mt-2">
            {analytics.vaccinationStats.reduce((sum, stat) => sum + stat.count, 0)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vaccination Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vaccination Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vaccinationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vaccinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Levels */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vaccine Stock Levels</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#8884d8" name="Available Stock">
                  {stockData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.stock > 50 ? '#00C49F' : entry.stock > 20 ? '#FFBB28' : '#FF8042'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointment Status Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Appointments">
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Pending' ? '#FFBB28' :
                        entry.name === 'Approved' ? '#0088FE' :
                        entry.name === 'Completed' ? '#00C49F' :
                        '#FF8042'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments (Next 7 Days)</h3>
        {analytics.upcomingAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Vaccine</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.upcomingAppointments.map((appointment, index) => (
                  <tr key={appointment._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-3 px-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{appointment.userId?.name}</p>
                        <p className="text-gray-500 text-xs">{appointment.userId?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {appointment.vaccineId?.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;