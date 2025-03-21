import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import CountUp from 'react-countup';

const AdvancedDashboard = () => {
  const [stats, setStats] = useState({
    trafficSummary: { total: 0, blocked: 0, suspicious: 0 },
    trafficOverTime: [],
    attacksByType: [],
    topIPs: [],
    geoDistribution: [],
    systemStatus: 'operational'
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79'];

  return (
    <div className="p-6 bg-neutral-900 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl">DDoS Protection Dashboard</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            stats.systemStatus === 'operational' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm capitalize">{stats.systemStatus}</span>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-neutral-800 rounded">
          <h3 className="text-neutral-400 mb-2">Total Requests</h3>
          <CountUp end={stats.trafficSummary.total} duration={2} separator="," className="text-3xl" />
        </div>
        <div className="p-4 bg-neutral-800 rounded">
          <h3 className="text-neutral-400 mb-2">Blocked Requests</h3>
          <CountUp end={stats.trafficSummary.blocked} duration={2} separator="," className="text-3xl text-orange-500" />
        </div>
        <div className="p-4 bg-neutral-800 rounded">
          <h3 className="text-neutral-400 mb-2">Suspicious Requests</h3>
          <CountUp end={stats.trafficSummary.suspicious} duration={2} separator="," className="text-3xl text-yellow-500" />
        </div>
      </div>
      
      {/* Traffic Over Time Chart */}
      <div className="mb-8 bg-neutral-800 p-4 rounded">
        <h3 className="mb-4 text-lg">Traffic Volume</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={stats.trafficOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
            <Area type="monotone" dataKey="normal" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="blocked" stackId="1" stroke="#ff8042" fill="#ff8042" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Attack Type and Top IPs */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-800 p-4 rounded">
          <h3 className="mb-4 text-lg">Attack Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.attacksByType}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.attacksByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-neutral-800 p-4 rounded">
          <h3 className="mb-4 text-lg">Top Blocked IPs</h3>
          <div className="h-[200px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-neutral-700">
                  <th className="pb-2">IP Address</th>
                  <th className="pb-2">Requests</th>
                  <th className="pb-2">Country</th>
                </tr>
              </thead>
              <tbody>
                {stats.topIPs.map((ip, idx) => (
                  <tr key={idx} className="border-b border-neutral-700">
                    <td className="py-2">{ip.address}</td>
                    <td className="py-2">{ip.count}</td>
                    <td className="py-2">{ip.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;