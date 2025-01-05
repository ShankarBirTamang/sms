import Icon from "../../components/Icon/Icon.tsx";
import { Link, NavLink } from "react-router-dom";
import Settings from "./Settings/Settings.tsx";
import { useRef, useState } from "react";
import images from "../../constants/images.ts";

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
      route: "/",
    },
    {
      title: "Students",
      icon: "student",
      route: "/students",
    },
    {
      title: "Employees",
      icon: "users",
      route: "/employees",
    },
  ];

  const [isOpen, setIsOpen] = useState(false); // Track dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  const handleToggle = () => {
    setIsOpen((prev) => !prev); // Toggle the dropdown
  };

  // const [isActive, setIsActive] = useState(false)
  return (
    <>
      <div id="kt_aside" className="aside">
        <div
          className="aside-logo flex-column-auto pt-10 pt-lg-20"
          id="kt_aside_logo"
        >
          <Link to={"/"}>
            <img alt="Logo" src={images.mainLogo} className="h-100px" />
          </Link>
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
                  key={item.route}
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
          ref={dropdownRef} // Attach the ref to the container
        >
          <div
            className="d-flex flex-center w-100 scroll-px"
            title="Quick actions"
          >
            <button
              type="button"
              onClick={handleToggle}
              className="btn btn-custom"
              style={{
                position: "relative",
              }}
            >
              <Icon name="settings" className={"svg-icon-2x m-0"} />
            </button>

            {isOpen && (
              <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <Settings />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
