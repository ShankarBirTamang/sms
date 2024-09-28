import { useState } from "react";
import Icon from "../../../components/Icon/Icon.tsx";

const ColorMode = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div
        className="d-flex align-items-center me-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a
          href="#"
          className="btn btn-icon btn-custom btn-active-color-primary"
        >
          <Icon
            name={"sun"}
            className={"svg-icon-1  theme-light-show svg-icon-2"}
          />
          <Icon
            name={"moon"}
            className={"svg-icon-1 theme-dark-show svg-icon-2"}
          />
        </a>
        {isHovered ? (
          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-color fw-semibold py-4 fs-base w-175px show"
            data-kt-menu="true"
            data-kt-element="theme-mode-menu"
            style={{
              zIndex: 107,
              position: "fixed",
              inset: "0px 0px auto auto",
              margin: "0px",
              transform: "translate(-365px, 107px)",
            }}
          >
            <div className="menu-item px-3 my-0">
              <a
                href="#"
                className="menu-link px-3 py-2"
                data-kt-element="mode"
                data-kt-value="light"
              >
                <span className="menu-icon" data-kt-element="icon">
                  <Icon name={"sun"} className={" svg-icon-3"} />
                </span>
                <span className="menu-title">Light</span>
              </a>
            </div>

            <div className="menu-item px-3 my-0">
              <a
                href="#"
                className="menu-link px-3 py-2"
                data-kt-element="mode"
                data-kt-value="dark"
              >
                <span className="menu-icon" data-kt-element="icon">
                  <Icon name={"moon"} className={" svg-icon-3"} />
                </span>
                <span className="menu-title">Dark</span>
              </a>
            </div>

            <div className="menu-item px-3 my-0">
              <a
                href="#"
                className="menu-link px-3 py-2 active"
                data-kt-element="mode"
                data-kt-value="system"
              >
                <span className="menu-icon" data-kt-element="icon">
                  <Icon name={"system"} className={" svg-icon-3"} />
                </span>
                <span className="menu-title">System</span>
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ColorMode;
