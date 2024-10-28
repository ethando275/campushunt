import React from "react";
import Header from "../components/Header";
import StatsOverview from "../components/StatsOverview";
import ChartsSection from "../components/ChartsSection";
import DateSelector from "../components/DateSelector";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <DateSelector />
      <div className="main-content">
        <StatsOverview />
        <ChartsSection />
      </div>
    </div>
  );
};

export default Dashboard;
