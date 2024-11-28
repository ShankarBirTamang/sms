import { useState } from "react";
import Icon from "../../../components/Icon/Icon.tsx";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  route?: string;
  submenu?: MenuItem[];
}

const Settings = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Academic",
      submenu: [
        { title: "Academic Levels", route: "academics/academic-levels" },
        { title: "Academic Sessions", route: "academics/academic-sessions" },
        { title: "Grade Groups", route: "academics/grade-groups" },
        { title: "Grades", route: "" },
        {
          title: "Routine",
          route: "",
          submenu: [
            { title: "Time Table", route: "" },
            { title: "Setup Routine", route: "" },
          ],
        },
      ],
    },
    {
      title: "Student Services",
      submenu: [
        {
          title: "Photographs",
          route: "",
        },
        {
          title: "Student Details",
          route: "",
        },
        {
          title: "Gate Pass",
          route: "",
        },
        {
          title: "ID Cards",
          route: "",
        },
        {
          title: "Single Print Certificate",
          route: "",
          submenu: [
            { title: "Transfer/Character", route: "" },
            { title: "SEE Character", route: "" },
          ],
        },
        {
          title: "Bulk Print Certificate",
          route: "",
          submenu: [
            { title: "Transfer/Character", route: "" },
            { title: "SEE Character", route: "" },
          ],
        },
      ],
    },

    {
      title: "Transportation",
      submenu: [
        { title: "Vehicles", route: "" },
        { title: "Routes", route: "" },
        { title: "Students", route: "" },
      ],
    },
    {
      title: "IEMIS",
      route: "",
      submenu: [
        {
          title: "Export Photograph",
          route: "",
        },
      ],
    },
  ];

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleSubMenu = (menu: string) => {
    setHoveredMenu(menu);
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
    setHoveredMenu(null);
    setOpenSubMenus({});
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <div
        key={index}
        className="menu-item px-3"
        onMouseEnter={() => item.submenu && toggleSubMenu(item.title)}
        onMouseLeave={() => item.submenu && toggleSubMenu(item.title)}
        style={{
          position: hoveredMenu === item.title ? "relative" : "initial",
        }}
      >
        {item.route ? (
          <Link to={item.route} className="menu-link px-3">
            {" "}
            <span className="menu-title">{item.title}</span>{" "}
            {item.submenu && <span className="menu-arrow"></span>}{" "}
          </Link>
        ) : (
          <span className="menu-link px-3">
            {" "}
            <span className="menu-title">{item.title}</span>{" "}
            {item.submenu && <span className="menu-arrow"></span>}{" "}
          </span>
        )}

        {item.submenu && openSubMenus[item.title] && (
          <div
            className="menu-sub menu-sub-dropdown w-200px py-4"
            style={{
              display: "block",
              zIndex: 108,
              position: "absolute",
              left: 190,
              top: 0,
              height: "fit-content",
            }}
          >
            {renderMenuItems(item.submenu)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div
      className="d-flex flex-center w-100 scroll-px"
      title="Quick actions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
              Settings Menu
            </div>
          </div>

          <div className="separator mb-3 opacity-75"></div>

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
