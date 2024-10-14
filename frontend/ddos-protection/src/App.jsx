// import React, { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from './components/Navbar';

const App = () => {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   axios.post("/api/logs", { requestPath: "/" })
  //     .then(response => {
  //       setMessage("Welcome to the DDoS protected page!");
  //     })
  //     .catch(error => {
  //       if (error.response && error.response.status === 429) {
  //         setMessage("Too many requests - you are temporarily blocked.");
  //       } else if (error.response && error.response.status === 403) {
  //         setMessage("Access temporarily blocked due to too many requests.");
  //       } else {
  //         setMessage("Failed to load content.");
  //       }
  //     });
  // }, []);

  return (
    <>
      <Navbar />
    </>
  );
};

export default App;
