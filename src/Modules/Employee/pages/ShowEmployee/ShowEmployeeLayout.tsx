import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../../components/Loading/Loading";
import { Outlet } from "react-router-dom";
import useEmployee from "../../hooks/useEmployee";
import { EmployeeInterface } from "../../services/employeeService";
import ImageHolder from "../../../../components/ProfilePhoto/ImageHolder";

const ShowEmployeeLayout = () => {
  const [employee, setEmployee] = useState<EmployeeInterface>();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { getSingleEmployee, isLoading } = useEmployee({});
  const [error, setError] = useState<string | null>(null);
  const fetchEmployee = useCallback(async () => {
    try {
      const data = await getSingleEmployee(Number(employeeId));
      setEmployee(data.data);
    } catch {
      setError("Failed to fetch employee data");
    }
  }, [getSingleEmployee, employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [fetchEmployee, employeeId]);

  if (isLoading) return <Loading />;
  if (error) return <div className="bg-white">{error}</div>;

  if (isLoading) return <Loading />;
  if (error) return <div>{error}</div>;
  return (
    <>
      {!employee && <Loading />}
      {employee && (
        <div className="d-flex flex-column flex-lg-row">
          <div className="flex-column flex-lg-row-auto w-lg-250px w-xl-350px mb-10">
            <div className="card mb-5 mb-xl-8">
              <div className="card-body">
                <div className="d-flex flex-center flex-column py-5">
                  <ImageHolder photo={employee.photo} />
                  <a
                    href="#"
                    className="fs-3 text-gray-800 text-hover-primary fw-bold mb-3"
                  >
                    {employee.full_name}
                  </a>
                  {employee.class?.grade && (
                    <div className="mb-9 text-center">
                      <span className="badge badge-lg badge-light-primary d-inline">
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
                  )}
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
                  </div>
                </div>
                <div className="separator"></div>
                <div id="kt_user_view_details" className="collapse show">
                  <div className="row">
                    <div className="col-md-4 pb-5 fs-6">
                      <div className="fw-bold mt-5">Employee ID</div>
                      <div className="text-gray-600">ID-{employee.id}</div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Contact</div>
                      <div className="text-gray-600">
                        <a
                          href="tel:9866798832"
                          className="text-gray-600 text-hover-primary"
                        >
                          {employee.contact}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-12 pb-5 fs-6">
                      <div className="fw-bold mt-5">Date of Birth</div>
                      <div className="text-gray-600">
                        {employee.dob_np} | {employee.dob_en}
                      </div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Gender</div>
                      <div className="text-gray-600">{employee.gender}</div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Blood Group</div>
                      <div className="text-gray-600">
                        <a
                          href="#"
                          className="text-gray-600 text-hover-primary"
                        >
                          {employee.blood_group}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Nationality</div>
                      <div className="text-gray-600">
                        {employee.nationality}
                      </div>
                    </div>
                    <div className="col-md-6 pb-5 fs-6">
                      <div className="fw-bold mt-5">Mother Tongue</div>
                      <div className="text-gray-600">
                        {employee.mother_tongue}
                      </div>
                    </div>
                    <div className="col-md-12 pb-5 fs-6">
                      <div className="fw-bold mt-5">Address</div>
                      <div className="text-gray-600">
                        Current: {employee.current_address?.full_address}
                      </div>
                      <div className="text-gray-600">
                        Permanent: {employee.permanent_address?.full_address}
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
            </ul>
            <div className="tab-content">
              <div className="tab-pane show active">
                <Outlet context={{ employee }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowEmployeeLayout;
