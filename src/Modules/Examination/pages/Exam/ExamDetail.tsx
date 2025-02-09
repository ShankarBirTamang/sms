import React, { useCallback, useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useNavigate, useParams } from "react-router-dom";
import examSessionService, {
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

  const toggleAssignExamSubjectDrawer = () => {
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
                        <span
                          className="badge badge-danger cursor-pointer"
                          onClick={toggleAssignExamSubjectDrawer}
                        >
                          Edit
                        </span>
                      </div>
                    </td>
                  </tr>
                  {examGrade.sections.map((section, s) => (
                    <tr key={s}>
                      <td className="text-center"> {section.name}</td>
                      <td>
                        <a href="#" className="badge badge-success">
                          Result Ledger for {examGrade.grade_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          ({section.name})
                        </a>
                      </td>
                      <td className="text-end">
                        <a href="#" className="badge badge-danger">
                          Update Marks for {examGrade.grade_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          ({section.name})
                        </a>
                        <br />
                        <a href="#" className="badge badge-danger">
                          Update Result Remarks of {examGrade.grade_name} :
                          {section.faculty.name !== "General" &&
                            section.faculty.name}
                          ({section.name})
                        </a>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DrawerModal
        isOpen={assignExamSubjectDrawer}
        onClose={toggleAssignExamSubjectDrawer}
        position="right"
        width="80vw"
        title="Assign Exam Subjects"
      >
        <AssignExamSubject />
      </DrawerModal>
    </>
  );
};

export default ExamDetail;
