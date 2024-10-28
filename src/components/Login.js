import React, { useState } from "react";
import "./Login.css";
import campushunt_logo from "../assets/campushunt_logo.png";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin(); // Call the onLogin prop when login is successful
      console.log("Login successful!");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-screen">
      <img src={campushunt_logo} alt="" className="campusicon" />
      <h1>CampusHunt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
