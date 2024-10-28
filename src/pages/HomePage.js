import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./HomePage.css";
import Dashboard from "./Dashboard";
import Images from "./Images";

const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  useEffect(() => {
    setSelectedTab("Dashboard");
  }, []); // Reset selectedTab when the component mounts

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleSelectTab = (tab) => {
    if (tab === "Log Out") {
      handleLogout();
    } else {
      setSelectedTab(tab);
    }
  };

  return (
    <div className="screen">
      <div className="left">
        <NavBar onSelectTab={handleSelectTab} selectedTab={selectedTab} />{" "}
        {/* Pass selectedTab */}
      </div>
      <div className="right">
        {selectedTab === "Dashboard" && <Dashboard />}
        {selectedTab === "Images" && <Images />}

        {/* Add other components here based on selectedTab */}
      </div>
    </div>
  );
};

export default HomePage;
