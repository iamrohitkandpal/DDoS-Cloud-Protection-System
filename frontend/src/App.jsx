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

const App = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
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
        console.log(err.message);
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
