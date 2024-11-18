import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    navigate("/home");
  };

  const handleSwipeComplete = () => {
    setIsLoginVisible(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleBack = () => {
    setIsLoginVisible(false);
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
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
            <ProtectedRoute>
              <HomePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <>
                <div className="left-half">
                  {!isLoginVisible ? (
                    <SwipeToOpen onSwipeComplete={handleSwipeComplete} />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )}
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
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customize"
          element={
            <ProtectedRoute>
              <Customize />
            </ProtectedRoute>
          }
        />
        <Route
          path="/images"
          element={
            <ProtectedRoute>
              <Images />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage_users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university_game_page"
          element={
            <ProtectedRoute>
              <UniversityGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all_game_pages"
          element={
            <ProtectedRoute>
              <AllGamePages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
