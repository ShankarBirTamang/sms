import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import { StudentInterface } from "../../../../../Modules/Student/services/studentService";
import Loading from "../../../../../components/Loading/Loading";
import Icon from "../../../../../components/Icon/Icon";
import {
  GradeInterface,
  SectionInterface,
} from "../../../services/gradeService";
import DrawerModal from "../../../../../components/DrawerModal/DrawerModal";
import StudentRollNo from "../Drawers/StudentRollNo";
import useGrade from "../../../hooks/useGrade";

const Student = () => {
  const navigate = useNavigate();
  const { gradeId } = useParams<{ gradeId: string }>();

  const { getSectionStudents, getGrade } = useGrade({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [currentGrade, setCurrentGrade] = useState<GradeInterface | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionInterface>();

  const [studentRollDrawer, setstudentRollDrawer] = useState(false);

  useDocumentTitle("All Grade Students");

  const fetchGrade = useCallback(async () => {
    try {
      const grade = await getGrade(Number(gradeId));
      setCurrentGrade(grade);

      if (grade?.sections) {
        const firstSection = Object.values(grade.sections)?.[0]?.[0];
        setCurrentSection(firstSection);
      } else {
        setCurrentSection(undefined);
      }
    } catch (error) {
      console.error("Error fetching grade:", error);
    }
  }, [gradeId, getGrade]);

  const fetchStudents = useCallback(async () => {
    if (currentSection) {
      try {
        setIsLoading(true);
        const students = await getSectionStudents(currentSection.id);
        setStudents(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentSection, getSectionStudents]);

  useEffect(() => {
    fetchGrade();
  }, [fetchGrade]);

  useEffect(() => {
    if (currentSection) {
      fetchStudents();
    } else {
      setStudents([]); // Clear students if no section is selected
    }
  }, [currentSection, fetchStudents]);

  const handleStudentOverviewNavigate = (studentId: number) => {
    navigate(`/students/details/${studentId}/overview`);
  };

  const sortedStudents = [...students].sort(
    (a, b) => (Number(a.roll_no) || 0) - (Number(b.roll_no) || 0)
  );

  const maleStudents = sortedStudents.filter((student) => {
    return student.gender?.toLowerCase() === "male";
  });
  const femaleStudents = sortedStudents.filter((student) => {
    return student.gender?.toLowerCase() === "female";
  });

  const filteredStudents = sortedStudents.filter((student) =>
    student.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const toggleStudentRollDrawer = () => {
    setstudentRollDrawer(!studentRollDrawer);
    if (studentRollDrawer) {
      setIsLoading(true);
      fetchStudents();
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header pt-6">
              <div className="card-title">
                <h2>All Students of {currentGrade?.name}</h2>
              </div>
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end gap-2"
                  data-kt-user-table-toolbar="base"
                >
                  <div className="d-flex align-items-center gap-2">
                    <label className=" required fw-bold fs-6 mb-2">
                      Select Section
                    </label>
                    <select
                      className="form-control w-200px"
                      title="Items per Page"
                      id="itemsPerPage"
                      value={currentSection?.id || ""}
                      onChange={(e) => {
                        const selectedSectionId = Number(e.target.value);
                        const selectedSection = currentGrade?.sections
                          ? Object.values(currentGrade.sections)
                              .flat()
                              .find(
                                (section) => section.id === selectedSectionId
                              )
                          : undefined;
                        setCurrentSection(selectedSection);
                      }}
                    >
                      <option value="" hidden>
                        Select Section
                      </option>

                      {currentGrade?.sections &&
                        Object.entries(currentGrade.sections).map(
                          ([sectionGroup, sections], sci) => (
                            <React.Fragment key={`SG-${sci}`}>
                              {sections.map((section, si) => (
                                <option
                                  key={`SEC-${sci}-${si}`}
                                  value={section.id}
                                >
                                  {sectionGroup.split(",")[0].trim()}
                                  {":"}
                                  {section.name}
                                </option>
                              ))}
                            </React.Fragment>
                          )
                        )}
                    </select>
                  </div>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control w-250px ps-14"
                        placeholder="Search Students"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary me-3 h-auto"
                    onClick={toggleStudentRollDrawer}
                  >
                    Assign Roll No
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {isLoading && <Loading />}
              {!isLoading && filteredStudents.length === 0 && (
                <div className="alert alert-info">No Student Records Found</div>
              )}

              {!isLoading && filteredStudents.length > 0 && (
                <div>
                  <div className="d-flex flex-wrap flex-stack">
                    <div className="d-flex flex-column flex-grow-1 pe-8">
                      <div className="d-flex flex-wrap">
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="fs-2 fw-bolder counted">
                              {students.length}
                            </div>
                          </div>
                          <div className="fw-bold fs-6 text-gray-400">
                            Total Students
                          </div>
                        </div>
                        <div className="border border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="fs-2 fw-bolder counted">
                              {maleStudents.length}
                            </div>
                          </div>
                          <div className="fw-bold fs-6 text-gray-400">Male</div>
                        </div>
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="fs-2 fw-bolder counted">
                              {femaleStudents.length}
                            </div>
                          </div>
                          <div className="fw-bold fs-6 text-gray-400">
                            Female
                          </div>
                        </div>
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="fs-2 fw-bolder counted">0</div>
                          </div>
                          <div className="fw-bold fs-6 text-gray-400">
                            Day Boarders
                          </div>
                        </div>
                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="fs-2 fw-bolder counted">0</div>
                          </div>
                          <div className="fw-bold fs-6 text-gray-400">Bus</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="border border-gray-300 border-dashed" />
                  <table className="table align-middle table-row-dashed fs-6 gy-2">
                    <thead>
                      <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                        <th className="w-30px">S.N.</th>

                        <th className="w-300px">Name</th>
                        <th className="w-125px">Gender</th>
                        <th className="w-125px">Contact</th>
                        <th className="w-250px">Address</th>
                        <th className="text-end min-w-175px">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 fw-bold">
                      {filteredStudents.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {student.photo ? (
                                <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                  <div className="symbol-label"></div>
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
                                <span>
                                  {student.grade?.name} (
                                  {student.section?.faculty.name !== "General"
                                    ? `: ${student.section?.faculty.name}`
                                    : ""}
                                  {student.section?.name})
                                  {student.roll_no &&
                                    ` | Roll No : ${student.roll_no}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{student.gender}</td>
                          <td>{student.contact}</td>
                          <td>{student.current_address?.full_address}</td>

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
                                <Icon
                                  name={"search"}
                                  className={"svg-icon-2"}
                                />
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DrawerModal
        isOpen={studentRollDrawer}
        onClose={toggleStudentRollDrawer}
        position="right"
        width="500px"
        title={`Set Roll No for ${currentGrade?.name} - ${currentSection?.name}`}
      >
        <StudentRollNo
          onSave={toggleStudentRollDrawer}
          grade={currentGrade || ({} as GradeInterface)}
          students={sortedStudents}
          section={currentSection || ({} as SectionInterface)}
        />
      </DrawerModal>
    </>
  );
};

export default Student;
