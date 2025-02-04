import React, { useState } from "react";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import useDebounce from "../../../hooks/useDebounce";
import Loading from "../../../components/Loading/Loading";
import Icon from "../../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";
import useEmployee from "../hooks/useEmployee";
import { EmployeeInterface } from "../services/employeeService";

const Employee = () => {
  useDocumentTitle("All Employees");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { employees, isLoading, pagination, edgeLinks } = useEmployee({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInterface>();
  const navigate = useNavigate();

  const addEmployeeRoute = () => {
    navigate("/employees/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const [imageLoadStates, setImageLoadStates] = useState<
    Record<number, boolean>
  >({});

  const handleImageLoad = (id: number) => {
    setImageLoadStates((prevStates) => ({
      ...prevStates,
      [id]: false,
    }));
  };

  const handleImageLoading = (id: number) => {
    setImageLoadStates((prevStates) => ({
      ...prevStates,
      [id]: true,
    }));
  };

  const handleEmployeeOverviewNavigate = (employeeId: number) => {
    navigate(`details/${employeeId}/overview`);
  };

  const handleEditEmployeeNavigate = (employee: EmployeeInterface) => {
    setSelectedEmployee(employee);
    navigate(`${employee.id}/edit`);
  };

  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header border-0 pt-6">
              <div className="card-title">
                <h2>All Employees</h2>
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
                        placeholder="Search Employees"
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
                      title="Add Employee"
                      onClick={addEmployeeRoute}
                    >
                      <Icon name="add" className="svg-icon" />
                      Add Employee
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {isLoading && <Loading />}
              {!isLoading && employees.length === 0 && (
                <div className="alert alert-info">
                  No Employee Records Found
                </div>
              )}

              {!isLoading && employees.length > 0 && (
                <table className="table align-middle table-row-dashed fs-6 gy-2">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="w-40px">S.N.</th>

                      <th className="w-300px">Name</th>
                      <th className="w-125px">Gender</th>
                      <th className="w-125px">Contact</th>
                      <th className="w-250px">Address</th>
                      <th className="text-end min-w-175px">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold">
                    {employees.map((employee, index) => (
                      <tr key={employee.id}>
                        <td>
                          {(currentPage - 1) * (itemsPerPage ?? 1) + index + 1}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {employee.photo ? (
                              <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                <a
                                  href={`/employees/details/${employee.id}/overview`}
                                >
                                  <div className="symbol-label">
                                    <img
                                      src={employee.photo}
                                      alt={employee.full_name}
                                      className={`w-100`}
                                    />
                                  </div>
                                </a>
                              </div>
                            ) : null}
                            <div className="d-flex flex-column">
                              {employee.full_name}
                              <div className="d-flex gap-2">
                                <span
                                  className="badge badge-light-info fw-bold"
                                  style={{
                                    width: "fit-content",
                                  }}
                                >
                                  {employee.employee_type?.name}
                                </span>
                                <span
                                  className="badge bg-info fw-bold"
                                  style={{
                                    width: "fit-content",
                                  }}
                                >
                                  {employee.class?.faculty &&
                                  employee.class?.faculty !== "General"
                                    ? `${employee.class?.faculty} : `
                                    : ""}
                                  {employee.class?.grade}
                                  {employee.class?.section
                                    ? `: ${employee.class?.section}`
                                    : null}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{employee.gender}</td>
                        <td>{employee.contact}</td>
                        <td>{employee.current_address?.full_address}</td>

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
                                handleEmployeeOverviewNavigate(employee.id)
                              }
                              type="button"
                              title="search"
                              className="btn btn-light-info btn-sm btn-icon"
                            >
                              <Icon name={"search"} className={"svg-icon-2"} />
                            </button>
                            <button
                              title="edit"
                              onClick={() =>
                                handleEditEmployeeNavigate(employee)
                              }
                              className="btn btn-light-success btn-sm btn-icon"
                            >
                              <Icon name={"edit"} className={"svg-icon-2"} />
                            </button>
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

export default Employee;
