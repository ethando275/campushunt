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

  // Handle Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/"); // Navigate to the login page
    window.location.reload(); // Force a reload to reset the state
  };

  const handleTabClick = (tab) => {
    if (tab === "Log Out") {
      handleLogout(); // Trigger logout
    } else if (tab === "University Game Page") {
      // Open University Game Page in a new tab
      window.open(`/${tab.toLowerCase().replace(/ /g, "_")}`, "_blank");
    } else {
      onSelectTab(tab);
      navigate(`/${tab.toLowerCase().replace(/ /g, "_")}`); // Navigate to the selected tab
    }
  };

  return (
    <div className="nav-bar">
      <ul className="list-group">
        <NavLink to="/home">
          <img className="campushunt" src={campusHunt} alt="Campus Hunt Logo" />
        </NavLink>
        {/* Function that goes through each tab */}
        {tabs.map((tab, index) => (
          <li
            // Highlight active tab based on selectedTab
            className={`list-group-item ${selectedTab === tab ? "active" : ""}`}
            key={tab}
            // Handle the click event for the entire tab (li element)
            onClick={() => handleTabClick(tab)}
          >
            <img className="logo" src={tabLogos[index]} alt={`${tab} logo`} />
            <span className="nav-link">{tab}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;
