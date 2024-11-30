// import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon.tsx";
import Search from "./Component/Search.tsx";
import NavDropDown from "./Component/NavDropDown.tsx";
import ColorMode from "./Component/ColorMode.tsx";

interface Header {
  title?: string;
}

const Header = ({ title }: Header) => {
  return (
    <>
      <div
        id="kt_header"
        className="header py-6 py-lg-0"
        data-kt-sticky="true"
        data-kt-sticky-name="header"
        data-kt-sticky-offset="{lg: '300px'}"
      >
        <div className="header-container container-xxl">
          <div className="page-title d-flex flex-column align-items-start justify-content-center flex-wrap me-lg-20 py-3 py-lg-0 me-3">
            <h1 className="d-flex flex-column text-dark fw-bold my-1">
              <span className="text-white fs-1">
                {title ?? "Infinity School"}
              </span>
              <small className="text-gray-600 fs-6 fw-normal pt-2">
                Create a store with #YDR-124-346 code
              </small>
            </h1>
          </div>
          <div className="d-flex align-items-center flex-wrap">
            <Search />
            <div className="d-flex align-items-center py-3 py-lg-0">
              <NavDropDown title={"Notifications"} icon={"bell"}>
                Hello world
              </NavDropDown>

              <div className="me-3">
                <a
                  href="#"
                  className="btn btn-icon btn-custom btn-active-color-primary"
                  data-kt-menu-trigger="click"
                  data-kt-menu-attach="parent"
                  data-kt-menu-placement="bottom-end"
                >
                  <Icon name={"user"} className={"svg-icon-1 svg-icon-white"} />
                </a>

                <div
                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                  data-kt-menu="true"
                >
                  <div className="menu-item px-3">
                    <div className="menu-content d-flex align-items-center px-3">
                      <div className="symbol symbol-50px me-5">
                        <img alt="Logo" src="assets/media/avatars/300-1.jpg" />
                      </div>

                      <div className="d-flex flex-column">
                        <div className="fw-bold d-flex align-items-center fs-5">
                          Max Smith
                          <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                            Pro
                          </span>
                        </div>
                        <a
                          href="#"
                          className="fw-semibold text-muted text-hover-primary fs-7"
                        >
                          max@kt.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="separator my-2"></div>

                  <div className="menu-item px-5">
                    <a
                      href="../../demo9/dist/account/overview.html"
                      className="menu-link px-5"
                    >
                      My Profile
                    </a>
                  </div>

                  <div className="menu-item px-5">
                    <a
                      href="../../demo9/dist/apps/projects/list.html"
                      className="menu-link px-5"
                    >
                      <span className="menu-text">My Projects</span>
                      <span className="menu-badge">
                        <span className="badge badge-light-danger badge-circle fw-bold fs-7">
                          3
                        </span>
                      </span>
                    </a>
                  </div>

                  <div
                    className="menu-item px-5"
                    data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                    data-kt-menu-placement="right-start"
                    data-kt-menu-offset="-15px, 0"
                  >
                    <a href="#" className="menu-link px-5">
                      <span className="menu-title">My Subscription</span>
                      <span className="menu-arrow"></span>
                    </a>

                    <div className="menu-sub menu-sub-dropdown w-175px py-4">
                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/referrals.html"
                          className="menu-link px-5"
                        >
                          Referrals
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/billing.html"
                          className="menu-link px-5"
                        >
                          Billing
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/statements.html"
                          className="menu-link px-5"
                        >
                          Payments
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/statements.html"
                          className="menu-link d-flex flex-stack px-5"
                        >
                          Statements
                          <i
                            className="fas fa-exclamation-circle ms-2 fs-7"
                            data-bs-toggle="tooltip"
                            title="View your statements"
                          ></i>
                        </a>
                      </div>

                      <div className="separator my-2"></div>

                      <div className="menu-item px-3">
                        <div className="menu-content px-3">
                          <label className="form-check form-switch form-check-custom form-check-solid">
                            <input
                              className="form-check-input w-30px h-20px"
                              type="checkbox"
                              value="1"
                              name="notifications"
                            />
                            <span className="form-check-label text-muted fs-7">
                              Notifications
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="menu-item px-5">
                    <a
                      href="../../demo9/dist/account/statements.html"
                      className="menu-link px-5"
                    >
                      My Statements
                    </a>
                  </div>

                  <div className="separator my-2"></div>

                  <div
                    className="menu-item px-5"
                    data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                    data-kt-menu-placement="right-start"
                    data-kt-menu-offset="-15px, 0"
                  >
                    <a href="#" className="menu-link px-5">
                      <span className="menu-title position-relative">
                        Language
                        <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
                          English
                          <img
                            className="w-15px h-15px rounded-1 ms-2"
                            src="assets/media/flags/united-states.svg"
                            alt=""
                          />
                        </span>
                      </span>
                    </a>

                    <div className="menu-sub menu-sub-dropdown w-175px py-4">
                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/settings.html"
                          className="menu-link d-flex px-5 active"
                        >
                          <span className="symbol symbol-20px me-4">
                            <img
                              className="rounded-1"
                              src="assets/media/flags/united-states.svg"
                              alt=""
                            />
                          </span>
                          English
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/settings.html"
                          className="menu-link d-flex px-5"
                        >
                          <span className="symbol symbol-20px me-4">
                            <img
                              className="rounded-1"
                              src="assets/media/flags/spain.svg"
                              alt=""
                            />
                          </span>
                          Spanish
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/settings.html"
                          className="menu-link d-flex px-5"
                        >
                          <span className="symbol symbol-20px me-4">
                            <img
                              className="rounded-1"
                              src="assets/media/flags/germany.svg"
                              alt=""
                            />
                          </span>
                          German
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/settings.html"
                          className="menu-link d-flex px-5"
                        >
                          <span className="symbol symbol-20px me-4">
                            <img
                              className="rounded-1"
                              src="assets/media/flags/japan.svg"
                              alt=""
                            />
                          </span>
                          Japanese
                        </a>
                      </div>

                      <div className="menu-item px-3">
                        <a
                          href="../../demo9/dist/account/settings.html"
                          className="menu-link d-flex px-5"
                        >
                          <span className="symbol symbol-20px me-4">
                            <img
                              className="rounded-1"
                              src="assets/media/flags/france.svg"
                              alt=""
                            />
                          </span>
                          French
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="menu-item px-5 my-1">
                    <a
                      href="../../demo9/dist/account/settings.html"
                      className="menu-link px-5"
                    >
                      Account Settings
                    </a>
                  </div>

                  <div className="menu-item px-5">
                    <a
                      href="../../demo9/dist/authentication/layouts/corporate/sign-in.html"
                      className="menu-link px-5"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              </div>

              <ColorMode />
              <a
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_create_app"
              >
                New Goal
              </a>
            </div>
          </div>
        </div>

        <div className="header-offset"></div>
      </div>
    </>
  );
};

export default Header;
