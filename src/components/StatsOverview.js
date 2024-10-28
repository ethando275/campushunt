import React from "react";
import "./StatsOverview.css"; // Assuming the CSS is in a separate file

const StatsOverview = () => {
  return (
    <div className="stats-overview">
      {/* Stat card for Total Users */}
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>
          <span className="increase">▲</span> 237
        </p>
      </div>

      {/* Stat card for Daily Players */}
      <div className="stat-card">
        <h3>Daily Players</h3>
        <p>
          <span className="decrease">▼</span> 104
        </p>
      </div>

      {/* Stat card for Versus Players */}
      <div className="stat-card">
        <h3>Versus Players</h3>
        <p>
          <span className="decrease">▼</span> 75
        </p>
      </div>

      {/* Stat card for Average Time Per Session */}
      <div className="stat-card">
        <h3>Avg Time per Session</h3>
        <p>05:36</p>
      </div>

      {/* Stat card for Accuracy Rate */}
      <div className="stat-card">
        <h3>Accuracy Rate</h3>
        <p>70.67%</p>
      </div>
    </div>
  );
};

export default StatsOverview;
