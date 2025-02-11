import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../../../components/Icon/Icon.tsx";
import { SearchData } from "../../Services/searchServices.ts";
import useDebounce from "../../../hooks/useDebounce.ts";
import axiosInstance from "../../../services/apiClient.ts";
import Loading from "../../../components/Loading/Loading.tsx";

const Search: React.FC = () => {
  const [startSearch, setStartSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<SearchData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = useCallback(() => {
    setStartSearch((prev) => !prev);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const performSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/general/global-search?search=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setStartSearch(false);
      setSearchQuery("");
      setSearchResults(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  const renderResults = () => {
    if (isLoading) return <Loading />;

    const hasStudents = (searchResults?.Student?.length ?? 0) > 0;
    const hasEmployees = (searchResults?.Employee?.length ?? 0) > 0;

    if (!hasStudents && !hasEmployees) {
      return (
        <div data-kt-search-element="empty" className="text-center">
          <div className="pt-10 pb-10">
            <Icon name="search" className="svg-icon-4x opacity-50" />
          </div>
          <div className="pb-15 fw-semibold">
            {searchQuery ? (
              <>
                <h3 className="text-gray-600 fs-5 mb-2">No result found</h3>
                <div className="text-muted fs-7">
                  Please try again with a different query
                </div>
              </>
            ) : (
              <>
                <h3 className="text-gray-600 fs-5 mb-2">
                  Enter a Search Term to Continue
                </h3>
                <div className="text-muted fs-7">Eg.: Name, Phone,</div>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        {hasStudents && (
          <>
            <h3
              className="fs-5 text-muted m-0 pb-5"
              data-kt-search-element="category-title"
            >
              Students
            </h3>
            {searchResults?.Student.map((result) => (
              <a
                key={result.id}
                target="_blank"
                href={`/students/details/${result.id}/overview`}
                className="d-flex text-dark text-hover-primary align-items-center mb-5"
              >
                <div className="symbol symbol-40px me-4">
                  <img src={result.photo} alt={result.full_name} />
                </div>
                <div className="d-flex flex-column justify-content-start fw-semibold">
                  <span className="fs-6 fw-semibold">{result.full_name}</span>
                  <span className="fs-7 fw-semibold text-muted">
                    {result.grade}
                  </span>
                </div>
              </a>
            ))}
          </>
        )}
        {hasEmployees && (
          <>
            <h3
              className="fs-5 text-muted m-0 pb-5"
              data-kt-search-element="category-title"
            >
              Employees
            </h3>
            {searchResults?.Employee.map((result) => (
              <a
                key={result.id}
                target="_blank"
                href={`/employees/details/${result.id}/overview`}
                className="d-flex text-dark text-hover-primary align-items-center mb-5"
              >
                <div className="symbol symbol-40px me-4">
                  <img src={result.photo} alt={result.full_name} />
                </div>
                <div className="d-flex flex-column justify-content-start fw-semibold">
                  <span className="fs-6 fw-semibold">{result.full_name}</span>
                  <span className="fs-7 fw-semibold text-muted">
                    {result.type}
                  </span>
                </div>
              </a>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="header-search py-3 py-lg-0 me-3" ref={inputRef}>
      <div
        id="kt_header_search"
        className={`header-search d-flex align-items-center w-lg-250px ${
          startSearch ? "show menu-dropdown" : ""
        }`}
      >
        <form
          data-kt-search-element="form"
          className="w-100 position-relative"
          autoComplete="off"
        >
          <input type="hidden" />
          <Icon
            name="search"
            className="svg-icon-2 search-icon position-absolute top-50 translate-middle-y ms-4"
          />
          <input
            type="text"
            className="form-control custom-form-control ps-13"
            name="search"
            onClick={handleSearchClick}
            onChange={handleInputChange}
            placeholder="Search"
            data-kt-search-element="input"
            value={searchQuery}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-5"
            data-kt-search-element="spinner"
          >
            <span className="spinner-border h-15px w-15px align-middle text-gray-400"></span>
          </span>
          {startSearch && (
            <span
              onClick={handleSearchClick}
              className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4"
            >
              <Icon name="close" className="svg-icon-2 svg-icon-lg-1 me-0" />
            </span>
          )}
        </form>
        <div
          data-kt-search-element="content"
          className={`menu menu-sub menu-sub-dropdown w-300px w-md-350px py-7 px-7 ${
            startSearch ? "show" : ""
          } overflow-hidden`}
          style={
            startSearch
              ? {
                  zIndex: 107,
                  position: "absolute",
                  inset: "0px 0px auto auto",
                  margin: "0px",
                  transform: "translate(-307px, 107px)",
                }
              : undefined
          }
        >
          <div data-kt-search-element="wrapper">
            <div data-kt-search-element="results">
              <div className="scroll-y mh-200px mh-lg-350px">
                {renderResults()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
