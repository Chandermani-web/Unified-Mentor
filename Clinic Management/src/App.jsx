import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { Provider } from "react-redux";

const App = () => {
  return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <Outlet />
      </div>
  );
};

export default App;
