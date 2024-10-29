import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./HomePage.css";
import Header from "../components/Header";
import StatsOverview from "../components/StatsOverview";
import ChartsSection from "../components/ChartsSection";
import DateSelector from "../components/DateSelector";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  useEffect(() => {
    setSelectedTab("Dashboard");
  }, []); // Reset selectedTab when the component mounts

  const onLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

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
      <div className="dashboard">
      <Header />
      <DateSelector />
      <div className="main-content">
        <StatsOverview />
        <ChartsSection />
      </div>
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
