import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import CountUp from "react-countup";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    blockedRequests: 0,
    trafficData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/stats");
        setStats({
          totalRequests: res.data.totalRequests,
          blockedRequests: res.data.blockedRequests,
          trafficData: res.data.hourlyRequests
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-neutral-900 rounded-lg">
      <h2 className="text-2xl mb-4">Traffic Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-neutral-800 rounded">
          <h3>Total Requests</h3>
          <CountUp end={stats.totalRequests} duration={2} className="text-3xl" />
        </div>
        <div className="p-4 bg-neutral-800 rounded">
          <h3>Blocked Requests</h3>
          <CountUp end={stats.blockedRequests} duration={2} className="text-3xl" />
        </div>
      </div>
      <BarChart width={600} height={300} data={stats.trafficData}>
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#f97316" />
      </BarChart>
    </div>
  );
};

export default Dashboard;