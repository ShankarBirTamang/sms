import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../hooks/useDebounce";
import { StudentInterface } from "../../../../Modules/Student/services/studentService";
import Loading from "../../../../components/Loading/Loading";
import Icon from "../../../../components/Icon/Icon";
import useGrade from "../../../hooks/useGrade";
import {
  GradeInterface,
  SectionInterface,
  UpdateGradeInterface,
} from "../../../services/gradeService";
import DrawerModal from "../../../../components/DrawerModal/DrawerModal";
import StudentRollNo from "../Drawers/StudentRollNo";

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
      if (grade && grade.sections) {
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
    if (currentSection !== undefined) {
      try {
        const students = await getSectionStudents(currentSection.id);
        setStudents(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  }, [currentSection, getSectionStudents]);

  useEffect(() => {
    fetchGrade();
  }, [fetchGrade]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (currentSection) {
        await fetchStudents();
      }

      setIsLoading(students.length === 0);
    };

    fetchData();
  }, [currentSection, fetchStudents, students.length]);

  const handleStudentOverviewNavigate = (studentId: number) => {
    navigate(`/students/details/${studentId}/overview`);
  };

  const filteredStudents = students.filter((student) =>
    student.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const toggleStudentRollDrawer = () => {
    setstudentRollDrawer(!studentRollDrawer);
    // if (studentRollDrawer) {
    //   fetchGrades();
    // }
  };
  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header border-0 pt-6">
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
                <table className="table align-middle table-row-dashed fs-6 gy-2">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="">S.N.</th>

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
                                {" "}
                                {student.grade?.name} (
                                {student.section?.faculty.name !== "General"
                                  ? `: ${student.section?.faculty.name}`
                                  : ""}
                                {student.section?.name}) | Roll : 1
                              </span>
                            </div>
                          </div>
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
          students={students}
          section={currentSection || ({} as SectionInterface)}
        />
      </DrawerModal>
    </>
  );
};

export default Student;
