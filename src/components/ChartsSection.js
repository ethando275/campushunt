import React from "react";
import "./ChartsSection.css";
// import { Line } from "react-chartjs-2";

// const data = {
//   labels: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
//   datasets: [
//     {
//       label: "Session Time (min)",
//       data: [20, 25, 30, 35, 40],
//       borderColor: "#007bff",
//       fill: false,
//     },
//   ],
// };

const Charts = () => {
  return (
    <div className="charts-container">
      <div className="chart-item">
        <h3>Amount Of Users By Month</h3>
      </div>
      <div className="chart-item">
        <h3>Average Session Time By Month</h3>
      </div>
      <div className="chart-item">
        <h3>Accuracy Rate By Month</h3>
      </div>
    </div>
  );
};

export default Charts;
