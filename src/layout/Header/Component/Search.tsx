import Icon from "../../../components/Icon/Icon.tsx";
import { useEffect, useRef, useState } from "react";

const Search = () => {
  const [startSearch, setStartSearch] = useState(false);
  // const [searchResult, setSearchResult] = useState(false)

  const handleSearchClick = () => {
    setStartSearch(!startSearch);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // Function to handle click events
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setStartSearch(false); // Remove active class if clicked outside
    }
  };

  // Add event listener to detect clicks outside input
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="header-search py-3 py-lg-0 me-3" ref={inputRef}>
        <div
          id="kt_header_search"
          className={`header-search d-flex align-items-center w-lg-250px ${
            startSearch ? "show menu-dropdown" : null
          }`}
        >
          <form
            data-kt-search-element="form"
            className="w-100 position-relative"
            autoComplete="off"
          >
            <input type="hidden" />
            <Icon
              name={"search"}
              className={
                "svg-icon-2 search-icon position-absolute top-50 translate-middle-y ms-4"
              }
            />
            <input
              type="text"
              className="form-control custom-form-control ps-13"
              name="search"
              onClick={handleSearchClick}
              placeholder="Search"
              data-kt-search-element="input"
            />

            <span
              className="position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-5"
              data-kt-search-element="spinner"
            >
              <span className="spinner-border h-15px w-15px align-middle text-gray-400"></span>
            </span>
            {startSearch ? (
              <span
                onClick={handleSearchClick}
                className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4"
              >
                <Icon
                  name={"close"}
                  className={"svg-icon-2 svg-icon-lg-1 me-0"}
                />
              </span>
            ) : null}
          </form>

          <div
            data-kt-search-element="content"
            style={
              startSearch
                ? {
                    zIndex: 107,
                    position: "fixed",
                    inset: "0px 0px auto auto",
                    margin: "0px",
                    transform: "translate(-307px, 107px)",
                  }
                : undefined
            } // No style if isActive is false
            className={`menu menu-sub menu-sub-dropdown w-300px w-md-350px py-7 px-7 ${
              startSearch ? "show" : null
            } overflow-hidden `}
          >
            <div data-kt-search-element="wrapper">
              {/*Search Results*/}
              <div data-kt-search-element="results">
                <div className="scroll-y mh-200px mh-lg-350px">
                  <h3
                    className="fs-5 text-muted m-0 pb-5"
                    data-kt-search-element="category-title"
                  >
                    Search Results
                  </h3>

                  <a
                    href="#"
                    className="d-flex text-dark text-hover-primary align-items-center mb-5"
                  >
                    <div className="symbol symbol-40px me-4">
                      <img src="assets/media/avatars/300-6.jpg" alt="" />
                    </div>

                    <div className="d-flex flex-column justify-content-start fw-semibold">
                      <span className="fs-6 fw-semibold">Karina Clark</span>
                      <span className="fs-7 fw-semibold text-muted">
                        Marketing Manager
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="" data-kt-search-element="main">
                <div className="d-flex flex-stack fw-semibold mb-4">
                  <span className="text-muted fs-6 me-2">
                    Recently Searched:
                  </span>
                </div>
                {/*Recents*/}
                <div className="scroll-y mh-200px mh-lg-325px">
                  <div className="d-flex align-items-center mb-5">
                    <div className="symbol symbol-40px me-4">
                      <span className="symbol-label bg-light">
                        <span className="svg-icon svg-icon-2 svg-icon-primary">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 16C2 16.6 2.4 17 3 17H21C21.6 17 22 16.6 22 16V15H2V16Z"
                              fill="currentColor"
                            />
                            <path
                              opacity="0.3"
                              d="M21 3H3C2.4 3 2 3.4 2 4V15H22V4C22 3.4 21.6 3 21 3Z"
                              fill="currentColor"
                            />
                            <path
                              opacity="0.3"
                              d="M15 17H9V20H15V17Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </span>
                    </div>

                    <div className="d-flex flex-column">
                      <a
                        href="#"
                        className="fs-6 text-gray-800 text-hover-primary fw-semibold"
                      >
                        BoomApp by Keenthemes
                      </a>
                      <span className="fs-7 text-muted fw-semibold">
                        #45789
                      </span>
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
                  <h3 className="text-gray-600 fs-5 mb-2">No result found</h3>
                  <div className="text-muted fs-7">
                    Please try again with a different query
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
