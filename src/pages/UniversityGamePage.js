import React, { useEffect, useState } from "react";
import "./UniversityGamePage.css";
import tigerspot from "../assets/home.png";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const UniversityGamePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          navigate("/princeton_menu");
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogin = () => {
    // Check if we're running locally
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Use the appropriate URL for login
    const loginUrl = isLocalhost
      ? "http://localhost:5000/auth/google/login"
      : "/auth/google/login";

    window.location.href = loginUrl;
  };

  const handleLogout = async () => {
    try {
      await axios.get("/auth/google/logout");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="university-game-container">
      <div className="content-wrapper">
        <img className="logo-placeholder" src={tigerspot} alt="tigerlogo" />
        {isAuthenticated ? (
          <div className="user-info">
            <p>Welcome, {user?.name}</p>
            <button className="login-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default UniversityGamePage;
