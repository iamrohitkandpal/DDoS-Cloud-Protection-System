import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import AdvancedDashboard from "./components/AdvancedDashboard";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast, Toaster } from "sonner";
// import { API_URL } from './config.js';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        toast.loading('Connecting to backend...');
        const response = await axios.get("http://localhost:5000/api/data", { timeout: 5000 });
        // const response = await axios.get(`${API_URL}/api/data`, { timeout: 5000 });
        toast.dismiss();

        if (response.data.message) {
          console.log(response.data.message);
          toast.success(response.data.message); 
        } else if (response.data.warning) {
          toast.error(response.data.warning); 
        } else {
          throw new Error("No message received from the API");
        }        
      } catch (err) {
        toast.dismiss();
        console.error("Backend connection error:", err.message);
        toast.error("Could not connect to backend. Running in demo mode.");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Toaster richColors />
      <Navbar onDashboardClick={() => setShowDashboard(!showDashboard)} />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        {showDashboard ? (
          <AdvancedDashboard />
        ) : (
          <>
            <HeroSection />
            <FeatureSection />
            <Workflow />
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default App;
