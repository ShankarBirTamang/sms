import { useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = {
  title: string;
  prefix?: string;
  route?: string;
  submenu?: MenuItem[];
};

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
        prefix: "routine",
        submenu: [
          { title: "Time Table", route: "time-table" },
          { title: "Setup Routine", route: "setup-routine" },
        ],
      },
    ],
  },
  {
    title: "Student Services",
    prefix: "students",
    submenu: [
      { title: "Photographs", route: "photographs" },
      { title: "Student Details", route: "student-details" },
      { title: "Gate Pass", route: "gate-pass" },
      { title: "ID Cards", route: "id-cards" },
      {
        title: "Single Print Certificate",
        prefix: "certificate",
        submenu: [
          { title: "Transfer/Character", route: "transfer-character" },
          { title: "SEE Character", route: "see-character" },
        ],
      },
      {
        title: "Bulk Print Certificate",
        prefix: "certificate",
        submenu: [
          { title: "Transfer/Character", route: "bulk-transfer-character" },
          { title: "SEE Character", route: "bulk-see-character" },
        ],
      },
    ],
  },

  {
    title: "Transportation",
    prefix: "transportation",
    submenu: [
      { title: "Vehicles", route: "vehicles" },
      { title: "Routes", route: "routes" },
      { title: "Students", route: "students" },
    ],
  },
  {
    title: "Institute",
    prefix: "institute",
    submenu: [
      { title: "Details", route: "details" },
      { title: "Room/Halls", route: "room-halls" },
      { title: "Laboratories", route: "laboratories" },
      { title: "Boardings", route: "boardings" },
    ],
  },
  {
    title: "IEMIS",
    route: "iemis",
    submenu: [{ title: "Export Photograph", route: "export-photograph" }],
  },
  {
    title: "Accounts",
    prefix: "accounts",
    submenu: [
      {
        title: "Masters",
        route: "masters",
        submenu: [
          { title: "Fiscal year", route: "masters/fiscal-years" },
          {
            title: "Setup Fees/Groups",
            route: "masters/group-setup",
          },

          {
            title: "Fees Structure",
            route: "masters/fee-structures",
          },
          {
            title: "Accounts",
            route: "masters/accounts",
          },
          {
            title: "Setup Student Account",
            route: "masters/student-accounts",
          },
        ],
      },
      {
        title: "Vouchers",
        route: "/*",
        submenu: [
          {
            title: "Payment",
            route: "*",
          },
          {
            title: "Receipt",
            route: "*",
          },
          {
            title: "Journal",
            route: "*",
          },
          {
            title: "Contra",
            route: "*",
          },
          {
            title: "Dr. Note",
            route: "*",
          },
          {
            title: "Cr. Note",
            route: "*",
          },
        ],
      },
    ],
  },
];

const Settings = () => {
  const [openMenu, setOpenMenu] = useState<string[]>([]);

  const toggleMenu = (currentIndex: string) => {
    setOpenMenu((prev) =>
      prev.includes(currentIndex)
        ? prev.filter((index) => index !== currentIndex)
        : [...prev, currentIndex]
    );
  };

  const notToggleMenu = (currentIndex: string) => {
    setOpenMenu((prev) => prev.filter((index) => index !== currentIndex));
  };

  const renderMenu = (
    menus: MenuItem[],
    basePath: string = ""
  ): JSX.Element[] => {
    return menus.map((menu, index) => {
      const currentIndex = `${basePath}-${index}`;
      const fullPath = `${basePath}/${menu.prefix || ""}/${
        menu.route || ""
      }`.replace(/\/+/g, "/"); // Ensure no duplicate slashes

      return (
        <div
          className="menu-item px-3"
          key={currentIndex}
          style={{ position: "relative" }}
          onMouseEnter={() => toggleMenu(currentIndex)}
          onMouseLeave={() => notToggleMenu(currentIndex)}
        >
          {menu.route || menu.submenu ? (
            <Link to={fullPath} className="menu-link px-3">
              <span className="menu-title">{menu.title}</span>
              {menu.submenu && <span className="menu-arrow" />}
            </Link>
          ) : (
            <a href="#" className="menu-link px-3">
              <span className="menu-title">{menu.title}</span>
              {menu.submenu && <span className="menu-arrow" />}
            </a>
          )}

          {menu.submenu && openMenu.includes(currentIndex) && (
            <div
              className="menu-submenu-card p-3 border rounded mt-2 bg-white shadow-lg"
              style={{
                position: "absolute",
                left: "100%",
                bottom: "-30%",
                width: "14rem",
                transition: "opacity 0.2s ease-in-out",
              }}
            >
              {renderMenu(menu.submenu, `${basePath}/${menu.prefix || ""}`)}
            </div>
          )}
        </div>
      );
    });
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
      {renderMenu(menuItems)} {/* Render the main menu */}
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
