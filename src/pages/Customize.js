import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FormText from "../components/FormText";
import ColorSelect from "../components/ColorSelect";
import DropDown from "../components/DropDown";
import "./Customize.css";
// import EmojiSelector from "../components/EmojiSelector";
import LogoUpload from "../components/LogoUpload";
import ButtonSelector from "../components/ButtonSelector";
import Preview from "../components/Preview";

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
        <div className="container-col">
          <FormText title="Game Title" titleid="gameTitle"></FormText>
          <LogoUpload></LogoUpload>
          <DropDown></DropDown>
          <FormText title="Share Message" titleid="shareMessage"></FormText>
          {/* <EmojiSelector></EmojiSelector> */}
          <ButtonSelector></ButtonSelector>

        </div>

        <div className="container-row">
          <Preview></Preview>
          <ColorSelect label="Primary"></ColorSelect>
          <ColorSelect label="Secondary"></ColorSelect>
          <ColorSelect label="Primary"></ColorSelect>
          <ColorSelect label="Secondary"></ColorSelect>
        </div>

      </div>
    </div>
  );
};

export default Customize;
