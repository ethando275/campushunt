// import React, { useState } from "react";
import "./Preview.css";
import Logo from "../assets/logo.png";
import Home from "../assets/home.png";
import QuestionMark from "../assets/questionmark.png";
import Requests from "../assets/requests.png";
import Trophy from "../assets/trophy.png";
import Team from "../assets/team.png";
import LogOut from "../assets/logout.png";

function Preview() {

	return (
		<>
    <nav id="navbar">
      <div className="home-icon">
        <a href="/menu"
          ><img
            src={Home}
            alt="Home Page"
            width="150"
            height="50"
        /></a>
      </div>
      <div className="nav-icons">
      <a href="/rules">
        <div className="nav-item">
          <img src={QuestionMark} alt="Rules" />
          <span id="orange-rules">Rules</span>
        </div>
      </a>
      <a href="/requests">
        <div className="nav-item">
          <img src={Requests} alt="Requests" />
          <span id="orange-vs">Versus</span>
        </div>
      </a>
      <a href="/leaderboard">
        <div className="nav-item">
          <img src={Trophy} alt="Leaderboard" />
          <span data-alttext="Leader board"><span id="orange-board">Leaderboard</span></span>
        </div>
      </a>
      <a href="/team">
        <div className="nav-item">
          <img src={Team} alt="Meet the Team" />
          <span id="orange-team">Meet the Team</span>
        </div>
      </a>
      <a href="logoutcas">
        <div className="nav-item">
          <img src={LogOut} alt="Logout" />
          <span>Log Out</span>
        </div>
      </a>
      </div>
    </nav>
    <div className="body">
      <div class="home">
        <img class="logo" src={Logo} alt="Logo" />
        <p>
          <b class="text">
            Hello user. Think you have what it takes to “spot” where a Princeton landmark
            is? Test your skills with Tiger Spot and land yourself at the top
            of the leaderboard!
          </b>
        </p>
        <button class="button">
          <b>Play the Daily!</b>
        </button>
      </div>
    </div>
    </>
    
	);
}

export default Preview;
