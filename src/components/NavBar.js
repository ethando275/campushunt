import dashboard from "../assets/dashboard.png";
import customize from "../assets/customize.png";
import images from "../assets/images.png";
import manageUsers from "../assets/manage_users.png";
import universityGamePage from "../assets/university_game_page.png";
import allGamePages from "../assets/all_game_pages.png";
import logOut from "../assets/log_out.png";
import campusHunt from "../assets/campushunt.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

// Names of tabs
const tabs = [
  "Dashboard",
  "Customize",
  "Images",
  "Manage Users",
  "University Game Page",
  "All Game Pages",
  "Log Out",
];

// Pathnames of tab logos
const tabLogos = [
  dashboard,
  customize,
  images,
  manageUsers,
  universityGamePage,
  allGamePages,
  logOut,
];

function NavBar({ onSelectTab, selectedTab }) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "Log Out") {
      localStorage.removeItem("isLoggedIn");
      onSelectTab(tab);
      navigate("/");
    } else {
      onSelectTab(tab);
      const path = tab.toLowerCase().replace(/ /g, "_");
      navigate(`/${path}`);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <img src={campusHunt} alt="CampusHunt Logo" className="logo" />
      </div>
      <div className="navbar-tabs">
        {tabs.map((tab, index) => (
          <NavLink
            key={tab}
            to={
              tab === "Log Out"
                ? "/"
                : `/${tab.toLowerCase().replace(/ /g, "_")}`
            }
            className={({ isActive }) =>
              `tab ${isActive || selectedTab === tab ? "selected" : ""}`
            }
            onClick={(e) => {
              e.preventDefault(); // Prevent default navigation
              handleTabClick(tab);
            }}
          >
            <img
              src={tabLogos[index]}
              alt={`${tab} Icon`}
              className="tab-icon"
            />
            <span className="tab-text">{tab}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
