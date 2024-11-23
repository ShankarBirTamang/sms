import Icon from "../../components/Icon/Icon.tsx";
import { NavLink } from "react-router-dom";
import Settings from "./Component/Settings.tsx";
// import {useState} from "react";

interface MenuItems {
  title: string;
  icon: string;
  route: string;
}

const Sidebar = () => {
  const menuItems: MenuItems[] = [
    {
      title: "Dashboard",
      icon: "dashboard",
      route: "",
    },
    {
      title: "Students",
      icon: "student",
      route: "students",
    },
    {
      title: "Employees",
      icon: "users",
      route: "employees",
    },
  ];

  // const [isActive, setIsActive] = useState(false)
  return (
    <>
      <div id="kt_aside" className="aside">
        <div
          className="aside-logo flex-column-auto pt-10 pt-lg-20"
          id="kt_aside_logo"
        >
          <a href="../../demo9/dist/index.html">
            <img
              alt="Logo"
              src="assets/media/logos/demo9.svg"
              className="h-40px"
            />
          </a>
        </div>

        <div
          className="aside-menu flex-column-fluid pt-0 pb-7 py-lg-10"
          id="kt_aside_menu"
        >
          <div
            id="kt_aside_menu_wrapper"
            className="w-100 hover-scroll-overlay-y scroll-ps d-flex"
          >
            <div
              id="kt_aside_menu"
              className="menu menu-column menu-title-gray-600 menu-state-primary menu-state-icon-primary menu-state-bullet-primary menu-icon-gray-400 menu-arrow-gray-400 fw-semibold fs-6 my-auto"
            >
              {menuItems.map((item) => (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    ["menu-item py-2", isActive ? "here" : ""].join(" ")
                  }
                >
                  <span className="menu-link menu-center">
                    <span className="menu-icon me-0">
                      <Icon name={item.icon} className={"svg-icon-2x"} />
                    </span>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div
          className="aside-footer flex-column-auto pb-5 pb-lg-10"
          id="kt_aside_footer"
        >
          <Settings />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
