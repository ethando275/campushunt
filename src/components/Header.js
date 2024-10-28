import React from "react";
import "./Header.css";
import princeton from "../assets/princeton.svg";

const Header = () => {
  return (
    <header className="header">
      <div className="header-title">
        <h1>Welcome to your dashboard,</h1>
        <h2>
          Princeton University{" "}
          <img src={princeton} alt="school" className="school-logo" />
        </h2>
      </div>
    </header>
  );
};

export default Header;
