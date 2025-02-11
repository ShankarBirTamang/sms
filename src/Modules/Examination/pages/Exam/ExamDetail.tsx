import React, { useCallback, useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useNavigate, useParams } from "react-router-dom";
import examSessionService, {
  ExamGradeInterface,
  ExamSessionInterface,
} from "../../services/examSessionService";
import Loading from "../../../../components/Loading/Loading";
import DrawerModal from "../../../../components/DrawerModal/DrawerModal";
import AssignExamSubject from "../Drawers/AssignExamSubject";

const ExamDetail = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<ExamSessionInterface>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [assignExamSubjectDrawer, setAssignExamSubjectDrawer] = useState(false);

  const [selectedExamGrade, setSelectedExamGrade] =
    useState<ExamGradeInterface>();

  const toggleAssignExamSubjectDrawer = (examGrade?: ExamGradeInterface) => {
    setSelectedExamGrade(examGrade);
    setAssignExamSubjectDrawer(!assignExamSubjectDrawer);
  };

  const fetchExam = useCallback(async () => {
    if (examId !== undefined) {
      const id = Number(examId);
      if (!isNaN(id)) {
        const result = await examSessionService.item<{ id: number }>({
          id,
        });
        setExam(result.data.data);
      } else {
        navigate("/404");
      }
    } else {
      navigate("/404");
    }
  }, [examId, navigate]);

  useEffect(() => {
    const loadExam = async () => {
      setIsLoading(true);
      try {
        await fetchExam();
      } catch (error) {
        console.error("Error fetching exam:", error);
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [fetchExam, navigate]);

  const handleAssignExamSubjectSave = (examGrade: ExamGradeInterface) => {
    if (exam) {
      const updatedExamGrades = exam.exam_grades.map((exam_Grade) =>
        exam_Grade.exam_grade_id === examGrade.exam_grade_id
          ? examGrade
          : exam_Grade
      );

      setExam({
        ...exam,
        exam_grades: updatedExamGrades,
      });
    }

    setSelectedExamGrade(undefined);
    setAssignExamSubjectDrawer(false);
    document.body.classList.remove("no-scroll");
  };

  const navigateExamGradeMarks = (examGradeId: number, sectionId: number) => {
    navigate(
      `/examination/session/exam-grade-marks/${examGradeId}/${sectionId}`
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="card">
          <div className="card-body">
            <Loading />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h2>{exam?.name}</h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end gap-2"
              data-kt-user-table-toolbar="base"
            >
              <a
                href="h"
                className="btn btn-primary btn-sm"
                type="link"
                title="Edit Exam"
              >
                <Icon name="edit" />
                Edit Exam
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-end pe-10 pb-2 pt-3">
          <a
            href="ht"
            className="btn btn-danger btn-sm mb-2"
            type="link"
            title="Print Teacher Entry Slip"
            target="_blank"
          >
            Print Teacher Entry Slip
          </a>
          <a
            href="htt"
            className="btn btn-info btn-sm mb-2"
            type="link"
            title="Print Blank Admit Cards"
            target="_blank"
          >
            Print Blank Admit Cards
          </a>

          <a
            href="h"
            className="btn btn-info btn-sm mb-2"
            type="link"
            title="Print Admit Cards"
            target="_blank"
          >
            Print Admit Cards
          </a>
          <a
            href="htts"
            className="btn btn-primary btn-sm mb-2"
            type="link"
            title="Print Student Results"
            target="_blank"
          >
            <Icon name="results" />
            Print Student Results
          </a>
        </div>
        <hr className="m-0 border-gray-400" />
        <div className="card-body">
          <table className="table align-middle table-row-bordered fs-6 gy-1 w-100">
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-30px">SN</th>
                <th className="w-200px">Grade Name</th>
                <th className="w-250px">Subjects</th>
                <th className="text-center w-100px"> Sections</th>
                <th className="min-w-200px"> Ledger</th>
                <th className="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-bold">
              {exam?.exam_grades.map((examGrade, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td rowSpan={examGrade.sections.length + 1}>{index + 1}</td>
                    <td rowSpan={examGrade.sections.length + 1}>
                      {examGrade.grade_name}
                    </td>
                    <td rowSpan={examGrade.sections.length + 1}>
                      <div className="d-flex flex-wrap gap-2">
                        {examGrade.exam_grade_subjects
                          .filter((subject) => subject.status === true)
                          .map((examGradeSubject, egs) => (
                            <span key={egs} className="badge badge-primary">
                              {examGradeSubject.name}
                            </span>
                          ))}
                        {examGrade.exam_grade_subjects.length > 0 ? (
                          <span
                            className="badge badge-danger cursor-pointer hover hover-scale"
                            onClick={() =>
                              toggleAssignExamSubjectDrawer(examGrade)
                            }
                          >
                            Edit Exam Subjects
                          </span>
                        ) : (
                          <span
                            className="badge badge-success cursor-pointer hover hover-scale"
                            onClick={() =>
                              toggleAssignExamSubjectDrawer(examGrade)
                            }
                          >
                            Add Exam Subjects
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {examGrade.sections.map((section, s) => (
                    <tr key={s}>
                      <td className="text-center"> {section.name}</td>
                      <td>
                        <span className="badge badge-success cursor-pointer  hover hover-scale">
                          Result Ledger for {examGrade.grade_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          {section.name}
                        </span>
                      </td>
                      <td className="text-end">
                        <span
                          className="badge badge-primary cursor-pointer hover hover-scale"
                          onClick={() =>
                            navigateExamGradeMarks(
                              examGrade.exam_grade_id,
                              section.id
                            )
                          }
                        >
                          Add Marks for {examGrade.grade_short_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          {section.name}
                        </span>
                        <br />
                        <span className="badge badge-primary cursor-pointer  hover hover-scale">
                          Add Result Remarks of {examGrade.grade_short_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          {section.name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {exam && selectedExamGrade && (
        <DrawerModal
          isOpen={assignExamSubjectDrawer}
          onClose={toggleAssignExamSubjectDrawer}
          position="right"
          width={`${Math.min(exam.exam_marks_schemes.length + 3, 9)}0vw`}
          title={`Assign Exam Subjectes for ${selectedExamGrade.grade_name}`}
        >
          <AssignExamSubject
            examMarksScheme={exam.exam_marks_schemes}
            examGrade={selectedExamGrade}
            onSave={(examGrade: ExamGradeInterface) =>
              handleAssignExamSubjectSave(examGrade)
            }
          />
        </DrawerModal>
      )}
    </>
  );
};

export default ExamDetail;
