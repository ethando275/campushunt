import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./HomePage.css";

const Customize = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Customize");

  useEffect(() => {
    setSelectedTab("Customize");
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
        customize
      </div>
    </div>
  );
};

export default Customize;
