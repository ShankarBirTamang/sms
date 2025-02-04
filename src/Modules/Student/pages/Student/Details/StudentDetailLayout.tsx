import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStudent from "../../../hooks/useStudent";
import { StudentInterface } from "../../../services/studentService";
import Loading from "../../../../../components/Loading/Loading";
import { Outlet } from "react-router-dom";
import ImageHolder from "../../../../../components/ProfilePhoto/ImageHolder";

const StudentDetailLayout = () => {
  const [student, setStudent] = useState<StudentInterface>();
  const { studentId } = useParams<{ studentId: string }>();
  const { getSingleStudent, isLoading } = useStudent({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fetchStudent = useCallback(async () => {
    try {
      const data = await getSingleStudent(Number(studentId));
      setStudent(data.data);
    } catch {
      setError("Failed to fetch student data");
    }
  }, [getSingleStudent, studentId]);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [fetchStudent, studentId]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error}</div>;

  if (isLoading) return <Loading />;
  if (error) return <div>{error}</div>;

  const handleEditStudent = (student: StudentInterface) => {
    navigate(`${student.id}/edit`);
  };
  return (
    <>
      {!student && <Loading />}
      {student && (
        <div className="d-flex flex-column flex-lg-row">
          <div className="flex-column flex-lg-row-auto w-lg-250px w-xl-350px mb-10">
            <div className="card mb-5 mb-xl-8">
              <div className="card-body">
                <div className="d-flex flex-center flex-column py-5">
                  <ImageHolder photo={student.photo} />
                  <a
                    href="#"
                    className="fs-3 text-gray-800 text-hover-primary fw-bold mb-3"
                  >
                    {student.full_name}
                  </a>
                  <div className="mb-9 text-center">
                    <span className="badge badge-lg badge-light-primary d-inline">
                      {student.grade?.name} (
                      {student.section?.faculty.name !== "General"
                        ? `: ${student.section?.faculty.name}`
                        : ""}
                      {student.section?.name})
                    </span>
                    <br />
                    <span className="badge badge-light-info mt-2 badge-lg">
                      Roll No: {student.roll_no}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-stack fs-4 py-3">
                  <div
                    className="fw-bold rotate collapsible"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="kt_user_view_details"
                  >
                    Details
                    <span className="ms-2 rotate-180">
                      <span className="svg-icon svg-icon-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </span>
                  </div>
                  <span>
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-trigger="hover"
                      data-kt-initialized="1"
                    >
                      <button
                        type="button"
                        onClick={() => handleEditStudent(student)}
                        className="btn btn-sm btn-light-primary"
                      >
                        Edit
                      </button>
                    </span>
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-trigger="hover"
                      data-kt-initialized="1"
                    >
                      <button
                        type="button"
                        className="btn btn-sm btn-light-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#changeSection"
                      >
                        Change Section
                      </button>
                    </span>
                  </span>
                </div>
                <div className="separator"></div>
                <div id="kt_user_view_details" className="collapse show">
                  <div className="row">
                    <div className="col-md-4 pb-5 fs-6">
                      <div className="fw-bold mt-5">Student ID</div>
                      <div className="text-gray-600">ID-{student.id}</div>
                    </div>
                    <div className="col-md-8 pb-5 fs-6">
                      <div className="fw-bold mt-5">IEMIS</div>
                      <div className="text-gray-600">{student.iemis}</div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Contact</div>
                      <div className="text-gray-600">
                        <a
                          href="tel:9866798832"
                          className="text-gray-600 text-hover-primary"
                        >
                          {student.contact}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-12 pb-5 fs-6">
                      <div className="fw-bold mt-5">Date of Birth</div>
                      <div className="text-gray-600">
                        {student.dob_np} | {student.dob_en}
                      </div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Gender</div>
                      <div className="text-gray-600">{student.gender}</div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Blood Group</div>
                      <div className="text-gray-600">
                        <a
                          href="#"
                          className="text-gray-600 text-hover-primary"
                        >
                          {student.blood_group}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Nationality</div>
                      <div className="text-gray-600">{student.nationality}</div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Mother Tongue</div>
                      <div className="text-gray-600">
                        {student.mother_tongue}
                      </div>
                    </div>
                    <div className="col-md-12 pb-5 fs-6">
                      <div className="fw-bold mt-5">Address</div>
                      <div className="text-gray-600">
                        Permanent : {student.permanent_address?.full_address}
                        <br />
                        Current: {student.current_address?.full_address}
                      </div>
                    </div>
                  </div>
                  <div className="pb-5 fs-6"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-lg-row-fluid ms-lg-15">
            <ul className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8">
              <li className="nav-item">
                <a
                  className="nav-link text-active-primary pb-4 active"
                  href="#"
                >
                  Overview
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-active-primary pb-4" href="#">
                  Qualification
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-active-primary pb-4" href="#">
                  Documents
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-active-primary pb-4" href="#">
                  Exam Records
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-active-primary pb-4" href="#">
                  Subjects
                </a>
              </li>

              <li className="nav-item ms-auto">
                <div
                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold py-4 w-250px fs-6"
                  data-kt-menu="true"
                >
                  <div className="menu-item px-5">
                    <div className="menu-content text-muted pb-2 px-5 fs-7 text-uppercase">
                      Payments
                    </div>
                  </div>
                  <div className="menu-item px-5">
                    <a href="#" className="menu-link px-5">
                      Create invoice
                    </a>
                  </div>
                  <div className="menu-item px-5">
                    <a href="#" className="menu-link flex-stack px-5">
                      Create payments
                      <i
                        className="fas fa-exclamation-circle ms-2 fs-7"
                        data-bs-toggle="tooltip"
                        aria-label="Specify a target name for future usage and reference"
                        data-kt-initialized="1"
                      ></i>
                    </a>
                  </div>
                  <div
                    className="menu-item px-5"
                    data-kt-menu-trigger="hover"
                    data-kt-menu-placement="left-start"
                  >
                    <a href="#" className="menu-link px-5">
                      <span className="menu-title">Subscription</span>
                      <span className="menu-arrow"></span>
                    </a>
                    <div className="menu-sub menu-sub-dropdown w-175px py-4">
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-5">
                          Apps
                        </a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-5">
                          Billing
                        </a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-5">
                          Statements
                        </a>
                      </div>
                      <div className="separator my-2"></div>
                      <div className="menu-item px-3">
                        <div className="menu-content px-3">
                          <label className="form-check form-switch form-check-custom form-check-solid">
                            <input
                              className="form-check-input w-30px h-20px"
                              type="checkbox"
                              value=""
                              name="notifications"
                              id="kt_user_menu_notifications"
                            />
                            <span className="form-check-label text-muted fs-6">
                              Notifications
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator my-3"></div>
                  <div className="menu-item px-5">
                    <div className="menu-content text-muted pb-2 px-5 fs-7 text-uppercase">
                      Account
                    </div>
                  </div>
                  <div className="menu-item px-5">
                    <a href="#" className="menu-link px-5">
                      Reports
                    </a>
                  </div>
                  <div className="menu-item px-5 my-1">
                    <a href="#" className="menu-link px-5">
                      Account Settings
                    </a>
                  </div>
                  <div className="menu-item px-5">
                    <a href="#" className="menu-link text-danger px-5">
                      Delete customer
                    </a>
                  </div>
                </div>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane show active">
                <Outlet context={{ student }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDetailLayout;
