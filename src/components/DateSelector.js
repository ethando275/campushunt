import React, { useState } from "react";
import "./DateSelector.css";

const DateSelector = () => {
  const [selectedTab, setSelectedTab] = useState("Month");

  const tabs = ["Today", "Month", "Year"];

  return (
    <div>
      {/* This div will have the border */}
      <div className="date-container">
        <ul className="date-horizontal">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`date-item ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DateSelector;
