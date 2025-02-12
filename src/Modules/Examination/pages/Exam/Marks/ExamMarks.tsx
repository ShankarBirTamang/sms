import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StudentInterface } from "../../../../Student/services/studentService";
import {
  ExamGradeInterface,
  ExamGradeSubjectInterface,
  ExamSectionInterface,
} from "../../../services/examSessionService";
import useDebounce from "../../../../../hooks/useDebounce";
import useGrade from "../../../../Academics/hooks/useGrade";
import useExam from "../../../hooks/useExam";
import { z } from "zod";
import Icon from "../../../../../components/Icon/Icon";
import DrawerModal from "../../../../../components/DrawerModal/DrawerModal";
import SubjectMarks from "../../Drawers/SubjectMarks";

const marksSchema = z.record(
  z.string(),
  z.record(z.string(), z.union([z.string(), z.number()]))
);

const formSchema = z.object({
  students: z.record(z.string(), marksSchema),
});

type FormValues = z.infer<typeof formSchema>;

const ExamMarks = () => {
  const { examGradeId, sectionId } = useParams<{
    examGradeId: string;
    sectionId: string;
  }>();
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [examGrade, setExamGrade] = useState<ExamGradeInterface>();
  const [subjectMarksDrawer, setSubjectMarksDrawer] = useState(false);
  const [selectedExamGradeSubject, setSelectedExamGradeSubject] =
    useState<ExamGradeSubjectInterface>();
  const [examGradeSection, setExamGradeSection] =
    useState<ExamSectionInterface>();
  const [examGradeSubjects, setExamGradeSubjects] = useState<
    ExamGradeSubjectInterface[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { getSectionStudents } = useGrade({});
  const { getExamGrade } = useExam({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      students: {},
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getSectionStudents(Number(sectionId));
      setStudents(students);
    };
    fetchStudents();
  }, [getSectionStudents, sectionId]);

  useEffect(() => {
    const fetchExamGrade = async () => {
      const examGrade = await getExamGrade(Number(examGradeId));
      setExamGrade(examGrade);
    };
    fetchExamGrade();
  }, [examGradeId, getExamGrade]);

  const sortedStudents = useMemo(() => {
    return [...students].sort(
      (a, b) => (Number(a.roll_no) || 0) - (Number(b.roll_no) || 0)
    );
  }, [students]);

  const filteredStudents = useMemo(() => {
    return sortedStudents.filter((student) =>
      student.full_name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [sortedStudents, debouncedSearchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  useMemo(() => {
    const examGradeSubjects = examGrade?.exam_grade_subjects.filter(
      (examGradeSubject) => {
        if (!examGradeSubject.is_section_specific) {
          return true;
        }

        if (
          examGradeSubject.sections?.some(
            (section) => section.id === Number(sectionId)
          )
        ) {
          return true;
        }

        return false;
      }
    );
    const section = examGrade?.sections.find((section) => {
      return section.id === Number(sectionId);
    });
    setExamGradeSection(section);

    setExamGradeSubjects(examGradeSubjects || []);
    console.log(examGradeSubjects);
  }, [examGrade?.exam_grade_subjects, examGrade?.sections, sectionId]);

  const toggleSubjectMarksDrawer = (
    examGradeSubject?: ExamGradeSubjectInterface
  ) => {
    if (examGradeSubject) {
      setSelectedExamGradeSubject(examGradeSubject);
      setSubjectMarksDrawer(!subjectMarksDrawer);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Data Submitted:", data);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h2>
              Exam Marks for the Students of {examGrade?.grade_name}{" "}
              {examGradeSection?.faculty}:{examGradeSection?.name}
            </h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end gap-2"
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control w-250px ps-14"
                    placeholder="Search Students"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="table-responsive"
              style={{ overflowX: "auto", maxWidth: "100%" }}
            >
              <table className="table align-middle table-row-dashed fs-6 gy-2 table-hover">
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th
                      className="w-30px sticky-col"
                      rowSpan={3}
                      style={{
                        position: "sticky",
                        left: 0,
                        background: "white",
                        zIndex: 2,
                      }}
                    >
                      S.N.
                    </th>
                    <th
                      className="min-w-200px sticky-col"
                      rowSpan={3}
                      style={{
                        position: "sticky",
                        left: 40,
                        background: "white",
                        zIndex: 2,
                      }}
                    >
                      Student Name
                    </th>
                    {examGradeSubjects.map((subject, sub) => (
                      <th
                        key={sub}
                        className="text-center"
                        colSpan={subject.exam_subject_marks_schemes.length}
                      >
                        {subject.name}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {examGradeSubjects.map((subject, sub) => (
                      <th
                        key={sub}
                        className="text-center"
                        colSpan={subject.exam_subject_marks_schemes.length}
                      >
                        <span
                          className="badge badge-danger  cursor-pointer  hover hover-scale"
                          style={{
                            display: "inline-block",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: 150,
                            whiteSpace: "normal",
                          }}
                          onClick={() => toggleSubjectMarksDrawer(subject)}
                        >
                          Add marks for {subject.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {examGradeSubjects.map((subject, sub) => (
                      <React.Fragment key={sub}>
                        {subject.exam_subject_marks_schemes.map(
                          (marksScheme, ms) => (
                            <th key={ms} className="text-center w-50px">
                              {subject.marking_scheme === "grade" ? (
                                <>GRD</>
                              ) : (
                                <>
                                  {marksScheme.exam_marks_scheme_short_name}{" "}
                                  <br></br>
                                  {marksScheme.full_marks}
                                </>
                              )}
                            </th>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-bold">
                  {filteredStudents.map((student, st) => (
                    <tr key={student.id}>
                      <td
                        className="sticky-col"
                        style={{
                          position: "sticky",
                          left: 0,
                          background: "white",
                          zIndex: 1,
                        }}
                      >
                        {st + 1}
                      </td>
                      <td
                        className="sticky-col"
                        style={{
                          position: "sticky",
                          left: 40,
                          background: "white",
                          zIndex: 1,
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                            {student.photo && (
                              <div className="symbol-label">
                                <img
                                  src={student.photo}
                                  alt={student.full_name}
                                />
                              </div>
                            )}
                          </div>
                          <div className="d-flex flex-column">
                            {student.full_name}
                            <span>
                              {student.roll_no &&
                                `Roll No : ${student.roll_no}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      {examGradeSubjects.map((subject, sub) => (
                        <React.Fragment key={sub}>
                          {!student.subjects?.find(
                            (studentSubject) =>
                              studentSubject.id === subject.subject_id
                          ) ? (
                            subject.exam_subject_marks_schemes.map(
                              (marksScheme, ms) => (
                                <td key={ms} className="text-center p-1">
                                  -
                                </td>
                              )
                            )
                          ) : (
                            <td
                              className="text-center"
                              colSpan={
                                subject.exam_subject_marks_schemes.length
                              }
                            >
                              Not Choosen
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr />
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      {examGrade && selectedExamGradeSubject && examGradeSection && (
        <DrawerModal
          isOpen={subjectMarksDrawer}
          onClose={toggleSubjectMarksDrawer}
          position="right"
          width={`${Math.min(
            selectedExamGradeSubject?.exam_subject_marks_schemes?.length + 1,
            9
          )}0vw`}
          title={`Add marks for ${selectedExamGradeSubject.name} of ${examGrade?.grade_name}
              ${examGradeSection?.faculty}:${examGradeSection?.name}`}
        >
          <SubjectMarks
            students={filteredStudents}
            examGradeSubject={selectedExamGradeSubject}
            examGradeSection={examGradeSection}
            examGrade={examGrade}
          />
        </DrawerModal>
      )}
    </>
  );
};

export default ExamMarks;
