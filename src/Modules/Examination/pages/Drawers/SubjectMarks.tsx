import React, { useEffect, useState } from "react";
import { StudentInterface } from "../../../Student/services/studentService";
import Loading from "../../../../components/Loading/Loading";
import {
  ExamGradeInterface,
  ExamGradeSubjectInterface,
  ExamSectionInterface,
  ExamSubjectMarksSchemeInterface,
} from "../../services/examSessionService";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useExam from "../../hooks/useExam";

interface SubjectMarksProps {
  students: StudentInterface[];
  examGrade: ExamGradeInterface;
  examGradeSubject: ExamGradeSubjectInterface;
  examGradeSection: ExamSectionInterface;
}

interface FormData {
  students: Record<string, { marks: Record<string, string> }>;
}

const SubjectMarks = ({
  students,
  examGradeSubject,
  examGradeSection,
  examGrade,
}: SubjectMarksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveExamSubjectMarks } = useExam({});

  const createSubjectMarksScheme = (
    marksSchemes: ExamSubjectMarksSchemeInterface[]
  ) => {
    return z.object({
      students: z.record(
        z.object({
          marks: z.record(
            z.string().superRefine((value, ctx) => {
              console.log("ctx.path:", ctx.path[3]);
              console.log("markschemes:", marksSchemes);
              const marksScheme = marksSchemes.find(
                (scheme) => scheme.id === Number(ctx.path[3])
              );
              console.log("marksScheme:", marksScheme);
              if (!marksScheme) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Invalid marks scheme",
                });
                return;
              }
              let allowedStrings: string[] = [];
              let errorMessage: string = "";
              if (examGradeSubject.marking_scheme === "grade") {
                allowedStrings = [
                  "A+",
                  "A",
                  "B+",
                  "B",
                  "C+",
                  "C",
                  "D",
                  "E",
                  "F",
                  "-",
                  "AB",
                  "ab",
                  "Ab",
                  "aB",
                  "NG",
                  "",
                ];
                errorMessage = "Marks must be a Grade or AB or NG or '-'";
              } else {
                allowedStrings = ["AB", "ab", "Ab", "aB", "NG", "-", ""];
                errorMessage = "Marks must be a number or AB or NG or '-'";
              }
              if (allowedStrings.includes(value)) {
                return;
              }

              const numericValue = parseFloat(value);
              if (isNaN(numericValue)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: errorMessage,
                });
                return;
              }

              if (
                numericValue < 0 ||
                numericValue > Number(marksScheme.full_marks)
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Marks must be between 0 and ${marksScheme.full_marks}`,
                });
                return;
              }
            })
          ),
        })
      ),
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      createSubjectMarksScheme(examGradeSubject.exam_subject_marks_schemes)
    ),
    defaultValues: {
      students: students?.reduce((acc, student) => {
        acc[student.id] = {
          marks: examGradeSubject?.exam_subject_marks_schemes?.reduce(
            (marksAcc, scheme) => {
              marksAcc[scheme.id] = "";
              return marksAcc;
            },
            {} as Record<string, string>
          ),
        };
        return acc;
      }, {} as Record<string, { marks: Record<string, string> }>),
    },
  });
  const onSubmit = (data: FormData) => {
    console.log("Form Data Submitted:", data);
    const formattedData = Object.entries(data.students).map(
      ([id, { marks }]) => ({
        studentId: id,
        marks: marks,
      })
    );
    saveExamSubjectMarks({
      examGradeId: examGrade.exam_grade_id,
      sectionId: examGradeSection.id,
      data: formattedData,
    });
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && students.length === 0 && (
        <div className="alert alert-info">No Student Records Found</div>
      )}

      {examGradeSubject && !isLoading && students.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table align-middle table-row-dashed fs-6 gy-1">
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">S.N.</th>
                <th className="w-200px">Name</th>
                {examGradeSubject?.exam_subject_marks_schemes?.map(
                  (marksScheme, sc) => (
                    <th key={sc} className="w-100px text-center">
                      {examGradeSubject.marking_scheme === "grade" ? (
                        <>
                          {marksScheme.exam_marks_scheme_name} <br />
                          Graded
                        </>
                      ) : (
                        <>
                          {marksScheme.exam_marks_scheme_name} <br />
                          FM: {marksScheme.full_marks} | PM :{" "}
                          {marksScheme.pass_marks}
                        </>
                      )}
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
                        (marksScheme) => (
                          <td key={marksScheme.id} className="w-100px">
                            <Controller
                              name={`students.${student.id}.marks.${marksScheme.id}`}
                              control={control}
                              render={({ field }) =>
                                examGradeSubject.marking_scheme === "marks" ? (
                                  <input
                                    type="text"
                                    className={`form-control custom-form-control text-center ${
                                      errors.students?.[student.id]?.marks?.[
                                        marksScheme.id
                                      ]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...field}
                                    placeholder={
                                      marksScheme?.exam_marks_scheme_name
                                    }
                                  />
                                ) : (
                                  <select
                                    {...field}
                                    className={`form-control custom-form-control text-center ${
                                      errors.students?.[student.id]?.marks?.[
                                        marksScheme.id
                                      ]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  >
                                    <option value="" hidden>
                                      Select
                                    </option>
                                    <option value="A+">A+</option>
                                    <option value="A">A</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="C+">C+</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="AB">AB</option>
                                    <option value="NG">NG</option>
                                    <option value="-">-</option>
                                  </select>
                                )
                              }
                            />
                            {errors.students?.[student.id]?.marks?.[
                              marksScheme.id
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  errors.students?.[student.id]?.marks?.[
                                    marksScheme.id
                                  ]?.message
                                }
                              </div>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="text-center pt-15">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SubjectMarks;
