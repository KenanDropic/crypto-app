import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { CryptoProvider } from "./context/CryptoContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CryptoProvider>
      <>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Router>
        <ToastContainer
          autoClose={3000}
          draggable={false}
          pauseOnHover={false}
        />
      </>
    </CryptoProvider>
  );
}

export default App;
