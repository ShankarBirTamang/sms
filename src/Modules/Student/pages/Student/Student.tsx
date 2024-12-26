import useStudent from "../../hooks/useStudent";

import React, { useState } from "react";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../hooks/useDebounce";
import Loading from "../../../../components/Loading/Loading";
import Icon from "../../../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination/Pagination";

const Students = () => {
  useDocumentTitle("All Students");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const { students, isLoading, pagination, edgeLinks } = useStudent({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });
  const navigate = useNavigate();

  const addStudentRoute = () => {
    navigate("/students/create-edit");
  };

  // header functions
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

  const [imageLoadStates, setImageLoadStates] = useState<
    Record<number, boolean>
  >({});

  const handleImageLoad = (id: number) => {
    setImageLoadStates((prevStates) => ({
      ...prevStates,
      [id]: false, // Mark the image as loaded
    }));
  };

  const handleImageLoading = (id: number) => {
    setImageLoadStates((prevStates) => ({
      ...prevStates,
      [id]: true, // Mark the image as loading
    }));
  };

  const handleStudentOverviewNavigate = (studentId: number) => {
    navigate(`details/${studentId}/overview`);
  };

  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header border-0 pt-6">
              <div className="card-title">
                <h2>All Students</h2>
              </div>
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center position-relative">
                      <Icon
                        name="searchDark"
                        className="svg-icon svg-icon-1 position-absolute ms-6"
                      />

                      <input
                        type="text"
                        id="data_search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control w-250px ps-14"
                        placeholder="Search Students"
                      />
                    </div>

                    <select
                      className="form-control w-50px "
                      title="Items per Page"
                      id="itemsPerPage"
                      value={itemsPerPage ?? "all"}
                      onChange={(e) =>
                        handleItemsPerPageChange(
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="all">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="Add Student"
                      onClick={addStudentRoute}
                    >
                      <Icon name="add" className="svg-icon" />
                      Add Student
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {isLoading && <Loading />}
              {!isLoading && students.length === 0 && (
                <div className="alert alert-info">No Student Records Found</div>
              )}

              {!isLoading && students.length > 0 && (
                <table className="table align-middle table-row-dashed fs-6 gy-2">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="">S.N.</th>

                      <th className="w-300px">Name</th>
                      <th className="">Grade / Section</th>
                      <th className="w-125px">Gender</th>
                      <th className="w-125px">Contact</th>
                      <th className="w-250px">Address</th>
                      <th className="text-end min-w-175px">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>1</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {student.photo ? (
                              <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                <div className="symbol-label">
                                  {imageLoadStates[student.id] ? (
                                    <div className="loading-spinner" />
                                  ) : null}
                                  <img
                                    src={student.photo}
                                    alt={student.full_name}
                                    className={`w-100 ${
                                      imageLoadStates[student.id]
                                        ? "d-none"
                                        : ""
                                    }`}
                                    onLoad={() => handleImageLoad(student.id)}
                                    onError={() => handleImageLoad(student.id)} // Handle errors gracefully
                                    onLoadStart={() =>
                                      handleImageLoading(student.id)
                                    }
                                  />
                                </div>
                              </div>
                            ) : null}
                            <div className="d-flex flex-column">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleStudentOverviewNavigate(student.id);
                                }}
                                className="text-gray-800 text-hover-primary mb-1"
                              >
                                {student.full_name}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>
                          {student.grade?.name} (
                          {student.section?.faculty.name !== "General"
                            ? `: ${student.section?.faculty.name}`
                            : ""}
                          {student.section?.name})
                        </td>
                        <td>{student.gender}</td>
                        <td>{student.contact}</td>
                        <td>{student.address}</td>

                        <td className="text-end">
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleStudentOverviewNavigate(student.id)
                              }
                              type="button"
                              title="search"
                              className="btn btn-light-info btn-sm btn-icon"
                            >
                              <Icon name={"search"} className={"svg-icon-2"} />
                            </button>
                            <a
                              title="edit"
                              href="#"
                              className="btn btn-light-success btn-sm btn-icon"
                            >
                              <Icon name={"edit"} className={"svg-icon-2"} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card-footer">
              <Pagination
                pagination={pagination}
                edgeLinks={edgeLinks}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
