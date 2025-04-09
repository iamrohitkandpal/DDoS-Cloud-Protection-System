import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import CountUp from 'react-countup';
import {MOCK_DATA} from "../constants/index.jsx";
import { connectWebSocket, disconnectWebSocket } from '../utils/websocket.js';
import { ArrowLeft } from 'lucide-react'; // Import the back arrow icon

// Add onBack prop to receive the function that will navigate back to home
const AdvancedDashboard = ({ onBack }) => {
  const [stats, setStats] = useState({
    trafficSummary: { total: 0, blocked: 0, suspicious: 0 },
    trafficOverTime: [],
    attacksByType: [],
    topIPs: [],
    geoDistribution: [],
    systemStatus: 'operational'
  });
  const [alerts, setAlerts] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', { timeout: 5000 });
        
        // Check if this is demo data from the backend
        if (res.data.isDemo) {
          setIsDemo(true);
        } else {
          setIsDemo(res.data.isFallback || false);
        }
        
        // Always use the data from the backend (which will be mock data in demo mode)
        setStats(res.data);
        
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setIsDemo(true);
        // Set mock data for complete API failure
        setStats(MOCK_DATA);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    
    // Connect to WebSocket for real-time updates with better error handling
    let webSocketClient = null;
    
    try {
      webSocketClient = connectWebSocket((data) => {
        if (data.type === 'honeypot_triggered' || data.type === 'demo_data') {
          // Add new alerts for demo or real data
          if (data.type === 'honeypot_triggered') {
            setAlerts(prev => [data, ...prev].slice(0, 5));
          }
          
          // Refresh stats
          fetchStats();
        }
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsDemo(true);
    }
    
    return () => {
      clearInterval(interval);
      if (webSocketClient) {
        if (webSocketClient.isMock) {
          webSocketClient.close();
        } else {
          disconnectWebSocket();
        }
      }
    };
  }, []);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79'];

  return (
    <div className="p-6 bg-neutral-900 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        {/* Add back button */}
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 p-2 hover:bg-neutral-800 rounded-full transition-colors duration-200"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl">DDoS Protection Dashboard</h2>
        </div>
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
          {stats.attacksByType && stats.attacksByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.attacksByType || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats.attacksByType || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-neutral-500">
              No attack data available
            </div>
          )}
        </div>
        <div className="bg-neutral-800 p-4 rounded">
          <h3 className="mb-4 text-lg">Top Blocked IPs</h3>
          <div className="h-[200px] overflow-y-auto">
            {stats.topIPs && stats.topIPs.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-neutral-700">
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2">Requests</th>
                    <th className="pb-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.topIPs || []).map((ip, idx) => (
                    <tr key={idx} className="border-b border-neutral-700">
                      <td className="py-2">{ip.address}</td>
                      <td className="py-2">{ip.count}</td>
                      <td className="py-2">{ip.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500">
                No blocked IPs data available
              </div>
            )}
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mt-8 bg-neutral-800 p-4 rounded">
          <h3 className="mb-4 text-lg text-red-400">Security Alerts</h3>
          <div className="overflow-y-auto max-h-[200px]">
            {(alerts || []).map((alert, idx) => (
              <div key={idx} className="mb-2 p-2 bg-red-900/30 rounded-sm">
                <p className="text-sm">
                  <span className="font-semibold">{alert.type}</span> from IP {alert.ip}
                  <span className="text-xs text-neutral-400 ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isDemo && (
        <div className="mt-4 p-2 bg-orange-800/30 rounded text-sm text-center">
          ⚠️ Running in demo mode - Connect to backend for live data
        </div>
      )}
    </div>
  );
};

export default AdvancedDashboard;