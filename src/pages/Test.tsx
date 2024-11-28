import React, { useState } from "react";
import useAcademicLevels from "../hooks/useAcademicLevels";
import useDebounce from "../hooks/useDebounce"; // Import the debounce hook
import Pagination from "../components/Pagination/Pagination";
import Loading from "../components/Loading/Loading";

const Test = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const { academicLevels, isLoading, pagination, edgeLinks } =
    useAcademicLevels({
      search: debouncedSearchTerm,
      currentPage,
      itemsPerPage,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  return (
    <>
      <div className="card">
        {isLoading && <Loading />}
        <div className="card-body">Test</div>
        <div>
          <label htmlFor="search">Search: </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search academic levels..."
          />
        </div>
        <div>
          <label htmlFor="itemsPerPage">Items per page: </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage ?? "all"}
            onChange={(e) =>
              handleItemsPerPageChange(
                e.target.value === "all" ? null : parseInt(e.target.value)
              )
            }
          >
            <option value="all">All</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <ul>
          {!isLoading &&
            academicLevels.map((level) => <li key={level.id}>{level.name}</li>)}
        </ul>
      </div>
      <Pagination
        pagination={pagination}
        edgeLinks={edgeLinks}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Test;
