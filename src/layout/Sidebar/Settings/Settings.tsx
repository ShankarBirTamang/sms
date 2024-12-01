import { useState } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  prefix?: string;
  route?: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Academic",
    prefix: "academics",
    submenu: [
      { title: "Academic Levels", route: "academic-levels" },
      { title: "Academic Sessions", route: "academic-sessions" },
      { title: "Grade Settings", route: "grade-settings" },
      { title: "Grades", route: "grades" },
      {
        title: "Routine",
        submenu: [
          { title: "Time Table", route: "time-table" },
          { title: "Setup Routine", route: "setup-routine" },
        ],
      },
    ],
  },
  {
    title: "Student Services",
    submenu: [
      { title: "Photographs", route: "photographs" },
      { title: "Student Details", route: "student-details" },
      { title: "Gate Pass", route: "gate-pass" },
      { title: "ID Cards", route: "id-cards" },
      {
        title: "Single Print Certificate",
        submenu: [
          { title: "Transfer/Character", route: "transfer-character" },
          { title: "SEE Character", route: "see-character" },
        ],
      },
      {
        title: "Bulk Print Certificate",
        submenu: [
          { title: "Transfer/Character", route: "transfer-character" },
          { title: "SEE Character", route: "see-character" },
        ],
      },
    ],
  },
  {
    title: "Transportation",
    submenu: [
      { title: "Vehicles", route: "vehicles" },
      { title: "Routes", route: "routes" },
      { title: "Students", route: "students" },
    ],
  },
  {
    title: "IEMIS",
    submenu: [{ title: "Export Photograph", route: "export-photograph" }],
  },
];

const Settings = () => {
  const [openMenu, setOpenMenu] = useState<string[]>([]);

  const toggleMenu = (currentIndex: string, isOpen: boolean) => {
    setOpenMenu((prev) =>
      isOpen
        ? [...prev, currentIndex]
        : prev.filter((index) => index !== currentIndex)
    );
  };

  const renderMenu = (menus: MenuItem[], parentPrefix: string = "") => {
    return (
      <>
        {menus.map((menu, index) => {
          const currentIndex = parentPrefix
            ? `${parentPrefix}-${index}`
            : `${index}`;

          // Construct route based on prefix and route
          const route = menu.route
            ? menu.prefix
              ? `/${menu.prefix}/${menu.route}`
              : `/${menu.route}`
            : null;

          return (
            <div
              className="menu-item px-3"
              key={currentIndex}
              style={{ position: "relative" }}
              onMouseEnter={() => toggleMenu(currentIndex, true)}
              onMouseLeave={() => toggleMenu(currentIndex, false)}
            >
              {route ? (
                <Link to={route} className="menu-link px-3">
                  <span className="menu-title">{menu.title}</span>
                  {menu.submenu && <span className="menu-arrow" />}
                </Link>
              ) : (
                <span className="menu-link px-3">
                  <span className="menu-title">{menu.title}</span>
                  {menu.submenu && <span className="menu-arrow" />}
                </span>
              )}

              {menu.submenu && openMenu.includes(currentIndex) && (
                <div
                  className="menu-submenu-card p-3 border rounded mt-2 bg-white shadow-lg"
                  style={{
                    position: "absolute",
                    left: "100%",
                    bottom: "-1rem",
                    width: "14rem",
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  {renderMenu(menu.submenu, currentIndex)}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
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
    >
      <div className="menu-item px-3">
        <div className="menu-content fs-6 text-dark fw-bold px-3 py-4">
          Setting Menu
        </div>
      </div>
      {renderMenu(menuItems)}
      <div className="separator mt-3 opacity-75" />
      <div className="menu-item px-3">
        <div className="menu-content px-3 py-3">
          <a className="btn btn-primary btn-sm px-4" href="#">
            Generate Reports
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
