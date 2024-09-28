import { ReactNode, useState } from "react";
import Icon from "../../../components/Icon/Icon.tsx";

// import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
  title: string;
  icon?: string;
  route?: string;
}

const NavDropDown = ({ children, title = "Drop", icon, route }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  // Handler function to manage dropdown visibility
  // const handleDropdownHover = (isHovering: boolean) => {
  //   setIsHovered(isHovering);
  // };

  return (
    <>
      <div
        className="me-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a
          href={route}
          className="btn btn-icon btn-custom btn-active-color-primary position-relative"
        >
          {icon ? (
            <Icon name={icon} className={"svg-icon-1 svg-icon-white"} />
          ) : null}
          {/*{title}*/}
          {/*{children}*/}
          <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"></span>
        </a>

        <div
          data-kt-search-element="content"
          style={
            isHovered
              ? {
                  zIndex: 107,
                  position: "fixed",
                  inset: "0px 0px auto auto",
                  margin: "0px",
                  transform: "translate(-307px, 107px)",
                }
              : undefined
          } // No style if isActive is false
          className={`menu menu-sub menu-sub-dropdown w-300px w-md-350px py-7 px-7 ${isHovered ? "show" : null} overflow-hidden `}
        >
          <div data-kt-search-element="wrapper">
            <div className="" data-kt-search-element="main">
              <div className="d-flex flex-stack fw-semibold mb-4">
                <span className="text-muted fs-6 me-2">
                  Current Notifications:
                </span>
              </div>
              {/*Recents*/}
              <div className="scroll-y mh-200px mh-lg-325px">
                <div className="d-flex align-items-center mb-5">
                  <div className="symbol symbol-40px me-4">
                    <span className="symbol-label bg-light">
                      <Icon
                        name={"results"}
                        className={"svg-icon-2 svg-icon-primary"}
                      />
                    </span>
                  </div>

                  <div className="d-flex flex-column">
                    <a
                      href="#"
                      className="fs-6 text-gray-800 text-hover-primary fw-semibold"
                    >
                      BoomApp by Keenthemes
                    </a>
                    <span className="fs-7 text-muted fw-semibold">#45789</span>
                  </div>
                </div>
              </div>
            </div>
            {/*No results found */}
            <div data-kt-search-element="empty" className="text-center">
              <div className="pt-10 pb-10">
                <span className="svg-icon svg-icon-4x opacity-50">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.3"
                      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                      fill="currentColor"
                    />
                    <path
                      d="M20 8L14 2V6C14 7.10457 14.8954 8 16 8H20Z"
                      fill="currentColor"
                    />
                    <rect
                      x="13.6993"
                      y="13.6656"
                      width="4.42828"
                      height="1.73089"
                      rx="0.865447"
                      transform="rotate(45 13.6993 13.6656)"
                      fill="currentColor"
                    />
                    <path
                      d="M15 12C15 14.2 13.2 16 11 16C8.8 16 7 14.2 7 12C7 9.8 8.8 8 11 8C13.2 8 15 9.8 15 12ZM11 9.6C9.68 9.6 8.6 10.68 8.6 12C8.6 13.32 9.68 14.4 11 14.4C12.32 14.4 13.4 13.32 13.4 12C13.4 10.68 12.32 9.6 11 9.6Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>

              <div className="pb-15 fw-semibold">
                <h3 className="text-gray-600 fs-5 mb-2">No Notifications</h3>
                <div className="text-muted fs-7">
                  There are currently no any new Notifications.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDropDown;
