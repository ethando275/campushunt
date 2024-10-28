import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SwipeToOpen from "./components/SwipeToOpen";
import Background from "./components/Background";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";

const App = () => {
  // State to control the visibility of the login screen
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  // State to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect to check localStorage for saved login status when the app mounts
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true); // Set the user as logged in if the status is saved as "true"
    }
  }, []);

  // Handle the login action
  const handleLogin = () => {
    setIsLoggedIn(true); // Update state to reflect user is logged in
    setIsLoginVisible(false); // Hide the login screen
    localStorage.setItem("isLoggedIn", "true"); // Save login status to localStorage
  };

  // Handle the completion of the swipe gesture (trigger to show login)
  const handleSwipeComplete = () => {
    setIsLoginVisible(true); // Show the login screen when swipe completes
  };

  // Handle the logout action
  const handleLogout = () => {
    setIsLoggedIn(false); // Update state to reflect user is logged out
    localStorage.removeItem("isLoggedIn"); // Remove login status from localStorage
  };

  // Handle the action for the back button to hide the login screen
  const handleBack = () => {
    setIsLoginVisible(false); // Hide the login screen when back button is clicked
  };

  return (
    <div className={`screen ${isLoginVisible ? "black-background" : ""}`}>
      {/* Render the back button only when the login screen is visible */}
      {isLoginVisible && (
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      )}
      <Routes>
        <Route
          path="/home"
          element={
            // If the user is logged in, render the HomePage, otherwise redirect to the root path
            isLoggedIn ? (
              <HomePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/"
          element={
            <>
              <div className="left-half">
                {/* Conditionally render either the swipe-to-login component or the login screen */}
                {!isLoginVisible ? (
                  <SwipeToOpen onSwipeComplete={handleSwipeComplete} />
                ) : (
                  <Login onLogin={handleLogin} /> // Pass login handler to Login component
                )}
              </div>
              {/* Conditionally render the background text based on whether the login screen is visible */}
              {!isLoginVisible ? (
                <div className="right-half">
                  <Background
                    text="Welcome to CampusHunt!"
                    subtext="Swipe to login"
                  />
                </div>
              ) : (
                <div className="right-half">
                  <Background
                    text="Administrator Login"
                    subtext="Contact campushunt@gmail.com for issues relating to your admin account"
                  />
                </div>
              )}
            </>
          }
        />
      </Routes>

      {/* Automatically redirect to the home page after login */}
      {isLoggedIn && <Navigate to="/home" replace />}
    </div>
  );
};

export default App;
