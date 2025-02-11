import React, { useState } from "react";
import { StudentInterface } from "../../../Student/services/studentService";
import Loading from "../../../../components/Loading/Loading";
import { ExamGradeSubjectInterface } from "../../services/examSessionService";

interface SubjectMarksProps {
  students: StudentInterface[];
  examGradeSubject: ExamGradeSubjectInterface;
}

const SubjectMarks = ({ students, examGradeSubject }: SubjectMarksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && students.length === 0 && (
        <div className="alert alert-info">No Student Records Found</div>
      )}

      {examGradeSubject && !isLoading && students.length > 0 && (
        <form>
          <table className="table align-middle table-row-dashed fs-6 gy-1">
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">S.N.</th>
                <th className="w-200px">Name</th>
                {examGradeSubject?.exam_subject_marks_schemes?.map(
                  (marksScheme, sc) => (
                    <th key={sc} className="w-100px text-center">
                      {marksScheme.exam_marks_scheme_name}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-bold">
              {students.map((student, index) => (
                <React.Fragment key={student.id}>
                  {!student.subjects?.find(
                    (studentSubject) =>
                      studentSubject.id === examGradeSubject.subject_id
                  ) && (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {student.photo ? (
                            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                              <div className="symbol-label"></div>
                            </div>
                          ) : null}
                          <div className="d-flex flex-column">
                            <span className="text-gray-800 text-hover-primary mb-1">
                              {student.full_name}
                            </span>
                          </div>
                        </div>
                      </td>
                      {examGradeSubject?.exam_subject_marks_schemes?.map(
                        (marksScheme, sc) => (
                          <td key={sc} className="w-100px">
                            <input
                              type="text"
                              className={`form-control custom-form-control text-center`}
                              placeholder={marksScheme.exam_marks_scheme_name}
                            />
                          </td>
                        )
                      )}
                      {/* <td>
                 
                  <Controller
                        name={`students.${student.id}.rollNo`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <input
                            type="text"
                            className={`form-control custom-form-control ${
                              errors.students?.[student.id]?.rollNo
                                ? "is-invalid"
                                : ""
                            }`}
                            {...field}
                            placeholder="Roll No"
                          />
                        )}
                      />
                      {errors.students?.[student.id]?.rollNo && (
                        <div className="invalid-feedback">
                          {errors.students?.[student.id]?.rollNo?.message}
                        </div>
                      )}
                </td> */}
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="text-center pt-15">
            {/* <button
                  type="button"
                  className="btn btn-danger me-3"
                  onClick={handleAutoAssign}
                  disabled={isSubmitting}
                >
                  Auto Assign
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button> */}
          </div>
        </form>
      )}
    </>
  );
};

export default SubjectMarks;
