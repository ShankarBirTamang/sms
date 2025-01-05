import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import Icon from "../../../components/Icon/Icon";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import ProcessingButton from "../../../components/ProcessingButton/ProcessingButton";
import Pagination from "../../../components/Pagination/Pagination";
import useAdmitCard from "../../hooks/useAdmitCard";

const AdmitCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const {} = useAdmitCard({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  return (
    <>
      <div className="col-md-12">
        <div className="card">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                <span>Time Table</span>
                <div className="d-flex gap-2">
                  <div className="d-flex align-items-center position-relative h-100">
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
                      placeholder="Search Session"
                    />
                  </div>

                  <select
                    className="form-control w-50px"
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

                  <Link
                    to={"/academics/routine/time-table/create"}
                    className="btn btn-primary btn-sm ms-2 align-content-center"
                    title="Add TimeTable"
                  >
                    <Icon name={"add"} className={"svg-icon"} />
                    Add TimeTable
                  </Link>
                </div>
              </h1>
            </div>
          </div>

          <div className="card-body pt-0">
            <div>
              {isLoading && <Loading />}
              {!isLoading && academicLevels.length === 0 && (
                <div className="alert alert-info">
                  No Academic Sessions Found
                </div>
              )}
              {!isLoading && (
                <table
                  className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                  id="table_sessions"
                  aria-describedby="table_sessions_info"
                >
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th> #</th>
                      <th className="min-w-225px">Session Name</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold table">
                    {timeTables.map((timeTable, index) => (
                      <tr key={index} className="odd">
                        <td>
                          {currentPage * (itemsPerPage ?? 0) +
                            index +
                            1 -
                            (itemsPerPage ?? 0)}
                        </td>
                        <td className="sorting_1">{timeTable.name}</td>
                        <td>
                          <ProcessingButton
                            isProcessing={
                              processingTimeTableId === timeTable.id
                            }
                            isActive={timeTable.is_active ?? false}
                            onClick={() => toggleTimeTableStatus(timeTable.id)}
                            hoverText={
                              timeTable.is_active ? "Deactivate" : "Activate"
                            }
                            activeText="Active"
                            inactiveText="Inactive"
                          />
                        </td>
                        <td className="text-end">
                          <button
                            title="edit academic level"
                            type="button"
                            onClick={() => handleEditClick(timeTable)}
                            className="btn btn-light-info btn-icon btn-sm m-1"
                          >
                            <Icon name={"edit"} className={"svg-icon"} />
                          </button>

                          <button
                            title="view academic level"
                            type="button"
                            onClick={() => handleViewClick(timeTable)}
                            className="btn btn-success btn-icon btn-sm m-1"
                          >
                            <Icon name={"search"} className={"svg-icon"} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="card-footer">
            {pagination && (
              <Pagination
                pagination={pagination}
                edgeLinks={edgeLinks}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmitCard;
