import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.post("/api/logs", { requestPath: "/" })
      .then(response => {
        setMessage("Welcome to the DDoS protected page!");
      })
      .catch(error => {
        if (error.response && error.response.status === 429) {
          setMessage("Too many requests - you are temporarily blocked.");
        } else if (error.response && error.response.status === 403) {
          setMessage("Access temporarily blocked due to too many requests.");
        } else {
          setMessage("Failed to load content.");
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <nav className="w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-4 shadow-lg flex justify-between items-center">
        <div className="text-3xl font-bold">Your Logo</div>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-lg text-blue-300 hover:text-blue-500">Home</a></li>
          <li><a href="/about" className="text-lg text-blue-300 hover:text-blue-500">About</a></li>
          <li><a href="/contact" className="text-lg text-blue-300 hover:text-blue-500">Contact</a></li>
        </ul>
      </nav>
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-4xl font-serif">{message}</h2>
      </main>
      <footer className="p-4">
        <p className="text-center text-gray-500">&copy; 2023 Your Company</p>
      </footer>
    </div>
  );
};

export default App;
