import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SwipeToOpen from "./components/SwipeToOpen";
import Background from "./components/Background";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import Customize from "./pages/Customize";
import Images from "./pages/Images";
import ManageUsers from "./pages/ManageUsers";
import UniversityGamePage from "./pages/UniversityGamePage";
import AllGamePages from "./pages/AllGamePages";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/home"; // Force navigation
  };

  const handleSwipeComplete = () => {
    setIsLoginVisible(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/"; // Force navigation
  };

  const handleBack = () => {
    setIsLoginVisible(false);
  };

  return (
    <div className={`screen ${isLoginVisible ? "black-background" : ""}`}>
      {isLoginVisible && (
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      )}
      <Routes>
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <HomePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            <>
              <div className="left-half">
                {!isLoginVisible ? (
                  <SwipeToOpen onSwipeComplete={handleSwipeComplete} />
                ) : (
                  <Login onLogin={handleLogin} />
                )}
                {isLoggedIn && <Navigate to="/home" replace />}
              </div>
              <div className="right-half">
                <Background
                  text={
                    isLoginVisible
                      ? "Administrator Login"
                      : "Welcome to CampusHunt!"
                  }
                  subtext={
                    isLoginVisible
                      ? "Contact campushunt@gmail.com for issues relating to your admin account"
                      : "Swipe to login"
                  }
                />
              </div>
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/images" element={<Images />} />
        <Route path="/manage_users" element={<ManageUsers />} />
        <Route path="/university_game_page" element={<UniversityGamePage />} />
        <Route path="/all_game_pages" element={<AllGamePages />} />
      </Routes>
    </div>
  );
};

export default App;
