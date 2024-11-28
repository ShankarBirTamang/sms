import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icon";
import axiosInstance from "../../../../axiosConfig";

import {
  AcademicLevelInterface,
  AcademicSessionInterface,
  ApiResponseInterface,
} from "../../../Interface/Interface";
import DatePicker, {
  DateInterface,
} from "../../../components/DatePicker/DatePicker";

import Loading from "../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";

const AcademicSession = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [academicLevels, setAcademicLevels] = useState<
    AcademicLevelInterface[]
  >([]);
  const [academicSessions, setAcademicSessions] = useState<
    AcademicSessionInterface[]
  >([]);

  //for pagination
  const [pagination, setPagination] = useState<
    ApiResponseInterface<AcademicSessionInterface>["meta"] | null
  >(null);
  const [edgeLinks, setEdgeLinks] = useState<
    ApiResponseInterface<AcademicSessionInterface>["links"] | null
  >(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  //end for Pagination

  const [error, setError] = useState<string>("");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currenSessionId, setCurrenSessionId] = useState<number | null>(null);

  // get Academic LEvels

  const fetchAcademicLevels = async () => {
    try {
      const response = await axiosInstance.get<
        ApiResponseInterface<AcademicLevelInterface>
      >(`academics/academic-levels`);

      setAcademicLevels(response.data.data);
    } catch (err) {
      console.error("Error fetching academic levels:", err);
      setError("Failed to fetch academic levels. Please try again later.");
    }
  };

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
  ) => {
    if (field === "startDate") {
      console.log("Start Date changed to:", dates);
    } else if (field === "endDate") {
      console.log("End Date changed to:", dates);
    }
  };
  useEffect(() => {
    fetchAcademicLevels();
  }, []);

  //   fetchAcademicLevels();

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {/* {formMode === "create" ? "Add New Level" : "Edit Level"} */}
                  Academic Sessions
                </h1>
              </div>
            </div>
            <div className="card-body">
              <form id="addDataForm" className="form" method="POST">
                <div className="d-flex">
                  <div className="row">
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Level
                        </label>
                        <select
                          className="form-control form-control-solid mb-3 mb-lg-0 "
                          name="level"
                        >
                          <option>Select Academic Level</option>
                          {academicLevels.map((levels) => (
                            <option key={levels.id} value={levels.id}>
                              {levels.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Session Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-solid mb-3 mb-lg-0 "
                          placeholder="Ex: Academic Year 2078-79"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <DatePicker
                        onDateChange={(date) =>
                          handleDateChange(date, "startDate")
                        }
                        title="Start Date"
                      />
                      <DatePicker
                        onDateChange={(date) =>
                          handleDateChange(date, "endDate")
                        }
                        title="End Date"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center pt-15">
                  <button
                    type="reset"
                    className="btn btn-light me-3"
                    data-kt-users-modal-action="cancel"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-kt-users-modal-action="submit"
                  >
                    <span className="indicator-label">Submit</span>
                    <span className="indicator-progress">
                      Please wait...
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Academic Sessions</div>
              <div className="card-toolbar">
                <div className="d-flex justify-content-end">
                  <div className="d-flex align-items-center position-relative my-1">
                    <Icon
                      name="searchDark"
                      className="svg-icon svg-icon-1 position-absolute ms-6"
                    />

                    <input
                      type="text"
                      id="data_search"
                      className="form-control form-control-solid w-250px ps-14"
                      placeholder="Search Session"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body pt-0">
              <div
                id="table_sessions_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
              >
                <div className="table-responsive">
                  <table
                    className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                    id="table_sessions"
                    aria-describedby="table_sessions_info"
                  >
                    <thead>
                      <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                        <th
                          className="min-w-125px sorting sorting_asc"
                          aria-controls="table_sessions"
                          aria-sort="ascending"
                          aria-label="Session Name: activate to sort column descending"
                        >
                          Session Name
                        </th>
                        <th
                          className="min-w-125px sorting"
                          aria-controls="table_sessions"
                          aria-label="Level: activate to sort column ascending"
                        >
                          Level
                        </th>
                        <th
                          className="min-w-125px sorting"
                          aria-controls="table_sessions"
                          aria-label="Start Date: activate to sort column ascending"
                        >
                          Start Date
                        </th>
                        <th
                          className="min-w-125px sorting"
                          aria-controls="table_sessions"
                          aria-label="End Date: activate to sort column ascending"
                        >
                          End Date
                        </th>
                        <th
                          className="min-w-125px sorting"
                          aria-controls="table_sessions"
                          aria-label="Status: activate to sort column ascending"
                        >
                          Status
                        </th>
                        <th
                          className="text-end min-w-100px sorting"
                          aria-controls="table_sessions"
                          aria-label="Actions: activate to sort column ascending"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 fw-bold">
                      <tr className="odd">
                        <td className="sorting_1">
                          Academic Session 2081-82 [+2]
                        </td>
                        <td>Plus 2</td>
                        <td> 2081-04-03 &nbsp;(2024-07-18)</td>
                        <td>2082-03-31 &nbsp;(2025-07-15)</td>
                        <td>
                          <a href="https://publichighschool.edu.np/sms/settings/academics/sessions/2/change-status">
                            <div className="badge badge-success fw-bolder">
                              Active
                            </div>
                          </a>
                        </td>
                        <td className="text-end"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Pagination */}
            <div className="card-footer">
              {pagination && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {/* Previous Page */}
                    {edgeLinks && (
                      <li
                        className={`page-item ${
                          !edgeLinks.first ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          title="page-link"
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          disabled={!edgeLinks.first}
                        >
                          First Page
                        </button>
                      </li>
                    )}

                    {/* Page Numbers */}
                    {pagination.links.map((link, index) =>
                      link.url ? (
                        <li
                          key={index}
                          className={`page-item ${link.active ? "active" : ""}`}
                        >
                          <button
                            title="page-link"
                            className="page-link"
                            onClick={() => handlePageChange(Number(link.label))}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        </li>
                      ) : null
                    )}

                    {edgeLinks && (
                      <li
                        className={`page-item ${
                          !edgeLinks.last ? "disabled" : ""
                        }`}
                      >
                        <button
                          title="page-link"
                          className="page-link"
                          onClick={() => handlePageChange(pagination.last_page)}
                          disabled={!edgeLinks.last}
                        >
                          Last Page
                        </button>
                      </li>
                    )}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicSession;
