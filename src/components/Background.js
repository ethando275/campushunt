import React from "react";
import "./Background.css";
import squiggle from "../assets/squiggle.png";


const Background = ({ text, subtext }) => {
  return (
    <div className="background">
      <img src={squiggle} alt="" className="background-image" />
      <div className="container">
        <h2>{text}</h2>
        <h3>{subtext}</h3>
      </div>
    </div>
  );
};

export default Background;
