import { useState } from "react";
import { CheckCircle2, Maximize2, X } from "lucide-react";
import oldArchImg from "../assets/code.png";
import newArchImg from "../assets/PBL-II Architecture.png";
import { checklistItems } from "../constants";

const Workflow = () => {
  const [fullScreenImage, setFullScreenImage] = useState(null);
  
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
        Evolution of our{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          architecture.
        </span>
      </h2>
      
      {/* Architecture comparison */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center mt-10 mb-12">
        {/* Old Architecture */}
        <div className="relative group w-full lg:w-1/2 rounded-lg border border-neutral-700 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
            <button 
              onClick={() => setFullScreenImage(oldArchImg)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <Maximize2 size={18} className="mr-2" /> View Full Screen
            </button>
          </div>
          <div className="p-3 bg-neutral-800">
            <h3 className="text-lg text-center">Initial Architecture</h3>
          </div>
          <img src={oldArchImg} alt="Initial Architecture" className="w-full" />
        </div>
        
        {/* New Architecture */}
        <div className="relative group w-full lg:w-1/2 rounded-lg border border-neutral-700 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
            <button 
              onClick={() => setFullScreenImage(newArchImg)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <Maximize2 size={18} className="mr-2" /> View Full Screen
            </button>
          </div>
          <div className="p-3 bg-neutral-800">
            <h3 className="text-lg text-center">Improved Architecture</h3>
          </div>
          <img src={newArchImg} alt="Improved Architecture" className="w-full" />
        </div>
      </div>
      
      {/* Checklist items - updated to 2-column layout */}
      <div className="pt-6 w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex">
              <div className="text-green-400 mr-4 bg-neutral-900 h-10 w-10 p-2 flex-shrink-0 flex justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                <p className="text-md text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Full Screen Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div 
            className="relative max-w-7xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setFullScreenImage(null)} 
              className="absolute top-2 right-2 bg-neutral-800 rounded-full p-2 hover:bg-neutral-700"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img 
              src={fullScreenImage} 
              alt="Architecture Diagram" 
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflow;
