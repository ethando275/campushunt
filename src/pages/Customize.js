import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FormText from "../components/FormText";
import ColorSelect from "../components/ColorSelect";
import DropDown from "../components/DropDown";
// import EmojiSelector from "../components/EmojiSelector";
import LogoUpload from "../components/LogoUpload";
import ButtonSelector from "../components/ButtonSelector";
import Preview from "../components/Preview";
import PublishButton from "../components/PublishButton";
import axiosInstance from "../api/axiosInstance";
import "./Customize.css";

// new commit comment

const Customize = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Customize");
  // const [customizations, setCustomizations] = useState({
  //   gameTitle: "",
  //   logoLink: "",
  //   fontSelected: "",
  //   shareMessage: "",
  //   streakEmoji: "",
  //   buttonStyle: "",
  //   colorScheme: { primary: "#ffffff", secondary: "#000000" },
  //   fontColorScheme: { primary: "#000000", secondary: "#ffffff" },
  // });
  

  useEffect(() => {
    setSelectedTab("Customize");
    loadCustoms();
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

  const loadCustoms = async () => {
    try {
        const response = await axiosInstance.get('https://campushunt.onrender.com/get_customizations');
        console.log('Customizations:', response.data);
    } catch (error) {
        console.error('Error fetching customizations:', error);
    }
};

  return (
    <div className="screen">
      <div className="left">
        <NavBar onSelectTab={handleSelectTab} selectedTab={selectedTab} />{" "}
        {/* Pass selectedTab */}
      </div>
      <div className="right">
        <div className="container-col input">
          <div className="divider"><FormText className="divider" title="Game Title" titleid="gameTitle"></FormText></div>
          <div className="divider top-padding"><LogoUpload></LogoUpload></div>
          <div className="divider top-padding"><DropDown></DropDown></div>
          <div className="divider top-padding"><FormText title="Share Message" titleid="shareMessage"></FormText></div>
          {/* <EmojiSelector></EmojiSelector> */}
          <div className="dividier top-padding">Streak Emoji</div>
          <div className="divider top-padding">Button Style 
            <div className="top-padding"><ButtonSelector></ButtonSelector></div>
          </div>
        </div>

        <div className="container-col preview">
          <div>Preview</div><div className="top-padding"><Preview></Preview></div>
          <div className="container-row">
            <div className="container-col">
              Color Scheme
              <div className="container-row top-padding">
                <ColorSelect label="Primary"></ColorSelect>
                <ColorSelect label="Secondary"></ColorSelect>
              </div>
            </div>
            <div className="container-col">
              Font Color Scheme
              <div className="container-row top-padding">
                <ColorSelect label="Primary"></ColorSelect>
                <ColorSelect label="Secondary"></ColorSelect>
              </div>
            </div>
          </div>
          <div className="container-row publish">
            <PublishButton onClick={loadCustoms}></PublishButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
