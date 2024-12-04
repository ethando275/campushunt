import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import logo from "../../assets/logo.png";
import "./PrincetonMenu.css";

const PrincetonMenu = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        } else {
          window.location.href = "/university_game_page";
        }
      } catch (error) {
        // If not authenticated, redirect back to login
        window.location.href = "/university_game_page";
      }
    };

    checkAuth();
  }, []);

  // USE LOCALLY
//   const checkAuth = async () => {
//     setUser("winsice")
//   };
// }, []);


  const handleLogout = async () => {
    try {
      await axios.get("/auth/google/logout");
      // Force a full page reload to clear all states and redirect to login
      window.location.href = "/university_game_page";
    } catch (error) {
      console.error("Logout failed:", error);
      // Still try to redirect even if logout fails
      window.location.href = "/university_game_page";
    }
  };

  const handlePlayClick = async () => {
    try {
      const response = await axios.get("/api/random_picture");
      console.log("Server response:", response.data);
      navigate("/princeton_daily", {
        state: {
          dailyPicture: response.data,
        },
      });
    } catch (error) {
      console.error("Failed to fetch random picture:", error);
    }
  };

  // Extract email handle (everything before @)
  const emailHandle = user?.email ? user.email.split("@")[0] : "";

  return (
    <div className="princeton-menu-container">
      <div className="princeton-dashboard">
        <button className="princeton-dash-button">Rules</button>
        <button className="princeton-dash-button">Versus</button>
        <button className="princeton-dash-button">Leaderboard</button>
        <button className="princeton-dash-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      <div className="content-container background-overlay">
        <div className="welcome-container">
          <img src={logo} alt="school"/>
          <h1>Welcome to Princeton Hunt, {emailHandle}!</h1>
          <p>Think you have what it takes to spot a Princeton landmark? Test your skills and land yourself on top of the leaderboard!</p>
          <button className="play-button" onClick={handlePlayClick}>
            PLAY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincetonMenu;
