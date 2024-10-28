import dashboard from "../assets/dashboard.png";
import customize from "../assets/customize.png";
import images from "../assets/images.png";
import manageUsers from "../assets/manage_users.png";
import universityGamePage from "../assets/university_game_page.png";
import allGamePages from "../assets/all_game_pages.png";
import logOut from "../assets/log_out.png";
import campusHunt from "../assets/campushunt.png";
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
  return (
    <div className="nav-bar">
      <ul className="list-group">
        <img className="campushunt" src={campusHunt} alt="Campus Hunt Logo" />
        {/* Function that goes through each tab */}
        {tabs.map((tab, index) => (
          <li
            // Highlight active tab based on selectedTab
            className={`list-group-item ${selectedTab === tab ? "active" : ""}`}
            key={tab}
            // Updates the selected tab
            onClick={() => onSelectTab(tab)}
          >
            <img className="logo" src={tabLogos[index]} alt={`${tab} logo`} />
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;
