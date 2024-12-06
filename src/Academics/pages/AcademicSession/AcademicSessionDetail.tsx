import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icon";
import { MenuItem } from "../../../Interface/Interface";
import { useNavigate, useParams } from "react-router-dom";
import academicSessionService, {
  ChangeAcademicSessionStatusInterface,
  UpdateAcademicSessionInterface,
} from "../../services/academicSessionService";
import Loading from "../../../components/Loading/Loading";

const AcademicSessionDetail = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [academicSession, setAcademicSession] =
    useState<UpdateAcademicSessionInterface>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    if (sessionId !== undefined) {
      const id = Number(sessionId);
      if (!isNaN(id)) {
        const request =
          academicSessionService.item<ChangeAcademicSessionStatusInterface>({
            id,
          });
        request.then((result) => {
          setAcademicSession(result.data.data);
        });
      } else {
        navigate("/404");
      }
    } else {
      navigate("/404");
    }
  }, [sessionId, navigate]);
  const menuItems: MenuItem[] = [
    {
      title: "Grade",
      icon: "grades",
      route: "",
    },
    {
      title: "Employee",
      icon: "users",
      route: "",
    },
    {
      title: "Students",
      icon: "student",
      route: "",
    },
    {
      title: "Examination",
      icon: "exam",
      route: "",
    },
  ];
  return (
    <>
      <div className="row g-5 g-xl-10">
        <div className="col-xl-4 mb-xl-10">
          <div className="card card-flush">
            <div
              className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-start"
              style={{
                backgroundImage:
                  "https://sms.aanshtech.com/main/media/svg/shapes/abstract-9.svg",
              }}
            >
              <h3 className="card-title align-items-start flex-column pt-12 pb-12">
                <span className="fw-bold fs-2x">
                  {academicSession?.name} Walkthrough
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div className="col-xl-5 mb-5 mb-xl-10">
          <div className="row mb-5 mb-xl-8 g-5 g-xl-8">
            {menuItems.map((item: MenuItem, index: number) => (
              <div key={index} className="col-4">
                <div className="card card-stretch h-100">
                  <a
                    href={item.route}
                    className="btn btn-flex btn-text-gray-800 btn-icon-gray-400 btn-active-color-primary bg-body flex-column justfiy-content-between align-items-center text-start w-100 p-10"
                  >
                    <Icon name={item.icon} className={"svg-icon-4x mb-5"} />

                    <span className="fs-4 fw-bolder text-center">
                      {item.title}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header pt-6">
          <h2>Academic Session Associated Grades</h2>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed fs-6 gy-5"
            id="kt_table_users"
          >
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="min-w-125px">Grade Name</th>
                <th className="min-w-125px">Sections</th>
                <th className="text-center min-w-125px">Total Students</th>
                <th className="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-bold">
              {academicSession && academicSession.grades ? (
                academicSession.grades.length > 0 ? (
                  academicSession.grades.map((grade, index) => (
                    <tr key={index}>
                      <td>{grade.name}</td> {}
                      <td>
                        <div className="w-300px">
                          {Object.entries(grade.sections).map(
                            ([sectionGroup, sections], sci) => (
                              <div key={`SEC-${sci}`} className="mb-1">
                                <strong>
                                  {sectionGroup.split(",")[0].trim()}:
                                </strong>
                                <div className="d-flex flex-wrap gap-3">
                                  {sections.map((section, si) => (
                                    <span
                                      key={`${sectionGroup}-${si}`}
                                      className="badge badge-primary badge-lg p-2 px-4 mb-1"
                                    >
                                      {section.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        {grade.total_students ?? 0}
                      </td>
                      {}
                      <td className="text-end">
                        <a
                          href="#"
                          className="btn btn-light-info btn-active-light-primary btn-sm"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No grades available.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    <Loading />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AcademicSessionDetail;
