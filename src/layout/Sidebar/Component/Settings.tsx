import React, { useState } from "react";
import Icon from "../../../components/Icon/Icon.tsx";

// Define the type for menu items
interface MenuItem {
  title: string;
  submenu?: MenuItem[]; // Optional submenu
}

const Settings: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Define your menu items and their submenus
  const menuItems: MenuItem[] = [
    { title: "New Ticket" },
    { title: "New Customer" },
    {
      title: "New Group",
      submenu: [
        { title: "Admin Group" },
        { title: "Staff Group" },
        { title: "Member Group" },
      ],
    },
    {
      title: "Old Group",
      submenu: [
        { title: "OLD Admin Group" },
        {
          title: "Details",
          submenu: [{ title: "Detail 1" }, { title: "Detail 2" }],
        },
        {
          title: "Hello",
          submenu: [{ title: "Hello" }, { title: "Detail 2" }],
        },
        {
          title: "World",
          submenu: [{ title: "World" }, { title: "Detail 2" }],
        },
        {
          title: "John",
          submenu: [
            { title: "John" },
            { title: "Detail 2" },
            {
              title: "another",
              submenu: [{ title: "World" }, { title: "Detail 2" }],
            },
          ],
        },
      ],
    },
    { title: "New Contact" },
  ];

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Function to manage submenu visibility based on menu title
  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Toggle the submenu for the specified menu
    }));
  };

  // Function to handle mouse enter and leave for dropdown
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
    setOpenSubMenus({}); // Close all submenus when not hovering over dropdown
  };

  // Recursive component for rendering menu items
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <div
        key={index}
        className="menu-item px-3"
        onMouseEnter={() => item.submenu && toggleSubMenu(item.title)} // Show submenu on hover
        onMouseLeave={() => item.submenu && toggleSubMenu(item.title)} // Hide submenu when not hovering
      >
        <a href="#" className="menu-link px-3">
          <span className="menu-title">{item.title}</span>
          {item.submenu && <span className="menu-arrow"></span>}
        </a>

        {/* Render submenu if it exists */}
        {item.submenu && openSubMenus[item.title] && (
          <div
            className="menu-sub menu-sub-dropdown w-200px py-4"
            style={{
              display: "flex",
              zIndex: 108,
              position: "absolute",
              inset: "70px auto auto -10px",
              margin: "0px",
              transform: "translate(200px, 0)", // Adjust as needed
            }}
          >
            {renderMenuItems(item.submenu)} {/* Recursive call */}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div
      className="d-flex flex-center w-100 scroll-px"
      title="Quick actions"
      onMouseEnter={handleMouseEnter} // Show dropdown on hover
      onMouseLeave={handleMouseLeave} // Hide dropdown when not hovering
    >
      <button
        type="button"
        className="btn btn-custom show menu-dropdown"
        onClick={toggleDropdown}
      >
        <Icon name={"settings"} className={"svg-icon-2x m-0"} />
      </button>

      {isDropdownOpen && (
        <div
          className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px show"
          style={{
            zIndex: 107,
            position: "absolute",
            inset: "auto auto 0px 0px",
            margin: "0px",
            left: 110,
            bottom: 30,
          }}
          data-kt-menu="true"
        >
          <div className="menu-item px-3">
            <div className="menu-content fs-6 text-dark fw-bold px-3 py-4">
              Quick Actions
            </div>
          </div>

          <div className="separator mb-3 opacity-75"></div>

          {/* Render the menu items using the recursive function */}
          {renderMenuItems(menuItems)}

          <div className="separator mt-3 opacity-75"></div>

          <div className="menu-item px-3">
            <div className="menu-content px-3 py-3">
              <a className="btn btn-primary btn-sm px-4" href="#">
                Generate Reports
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
