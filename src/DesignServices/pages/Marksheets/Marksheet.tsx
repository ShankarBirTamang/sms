import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import Icon from "../../../components/Icon/Icon";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import Pagination from "../../../components/Pagination/Pagination";
import useMarksheet from "../../hooks/useMarksheet";
import { GetMarksheetInterface } from "../../services/marksheetService";

const Marksheet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const navigate = useNavigate();
  const { isLoading, marksheetList, pagination, edgeLinks } = useMarksheet({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (marksheet: GetMarksheetInterface) => {
    navigate(`/design-services/marksheets/${marksheet.id}/edit`);
  };
  const handleViewClick = (marksheet: GetMarksheetInterface) => {};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="col-md-12">
        <div className="card">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                <span>Marksheet List</span>
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
                    to={"/design-services/marksheets/create"}
                    className="btn btn-primary btn-sm ms-2 align-content-center"
                    title="Add Marksheet"
                  >
                    <Icon name={"add"} className={"svg-icon"} />
                    Add Marksheet
                  </Link>
                </div>
              </h1>
            </div>
          </div>

          <div className="card-body pt-0">
            <div>
              {isLoading && <Loading />}
              {!isLoading && marksheetList.length === 0 && (
                <div className="alert alert-info">No Marksheet Found</div>
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
                      <th className="min-w-225px">Marksheet Name</th>
                      <th className="min-w-225px">Background</th>
                      <th>Signers</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold table">
                    {marksheetList.map((marksheet, index) => (
                      <tr key={index} className="odd">
                        <td>
                          {currentPage * (itemsPerPage ?? 0) +
                            index +
                            1 -
                            (itemsPerPage ?? 0)}
                        </td>
                        <td className="sorting_1">{marksheet.name}</td>
                        <td>
                          <img
                            style={{ width: "auto", height: "10rem" }}
                            src={marksheet.background}
                          ></img>
                        </td>
                        <td>
                          {marksheet.signers.map((signer) => (
                            <span
                              key={signer.id}
                              className="badge rounded-pill bg-primary p-2 fs-7 me-1"
                            >
                              {signer.name}
                            </span>
                          ))}
                        </td>
                        <td className="text-end">
                          <button
                            title="Delete"
                            type="button"
                            onClick={() => handleEditClick(marksheet)}
                            className="btn btn-light-info btn-sm m-1"
                          >
                            <Icon name={"edit"} className={"svg-icon"} />
                            Edit
                          </button>
                          <button
                            title="Edit"
                            type="button"
                            onClick={() => handleViewClick(marksheet)}
                            className="btn btn-light-success btn-sm m-1"
                          >
                            <Icon name={"search"} className={"svg-icon"} />
                            View
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

export default Marksheet;
