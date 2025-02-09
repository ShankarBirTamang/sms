import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreateExamGradeSubject,
  ExamGradeInterface,
  ExamMarksScheme,
} from "../../services/examSessionService";
import useSubject from "../../../Academics/hooks/useSubject";
import Loading from "../../../../components/Loading/Loading";
import useExam from "../../hooks/useExam";

interface AssignExamSubjectProps {
  examMarksScheme: ExamMarksScheme[];
  examGrade: ExamGradeInterface;
  onSave: (exam: ExamGradeInterface) => void;
}

const MarksSchema = z.object({
  fm: z.number().optional(),
  pm: z.number().optional(),
});

const examSubjectScheme = z
  .object({
    subjects: z.record(
      z.object({
        subjectId: z.number(),
        selected: z.boolean().default(true),
        isMarks: z.boolean().default(true),
        rank: z.coerce.number().min(1, "Rank is required"),
        marks: z.record(MarksSchema).optional(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    for (const sub in data.subjects) {
      const subject = data.subjects[sub];
      if (subject.selected && subject.isMarks) {
        if (!subject.marks) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Marks is required",
            path: ["subjects", sub, "marks"],
          });
        } else {
          for (const key in subject.marks) {
            const mark = subject.marks[key];
            if (!mark.pm) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "pm is required",
                path: ["subjects", sub, "marks", key, "pm"],
              });
            }
            if (!mark.fm) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "fm is required",
                path: ["subjects", sub, "marks", key, "fm"],
              });
            }
          }
        }
      }
    }
  });

type FormValues = z.infer<typeof examSubjectScheme>;

const AssignExamSubject = ({
  examMarksScheme,
  examGrade,
  onSave,
}: AssignExamSubjectProps) => {
  const { subjects, isLoading } = useSubject({ grade_id: examGrade.grade_id });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addExamGradeSubject } = useExam({});

  const theoryMarksSchemes = useMemo(
    () => examMarksScheme?.filter((scheme) => scheme.group === "Theory"),
    [examMarksScheme]
  );
  const practicalMarksScheme = useMemo(
    () => examMarksScheme?.filter((scheme) => scheme.group === "Practical"),
    [examMarksScheme]
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(examSubjectScheme),
    defaultValues: useMemo(
      () => ({
        subjects: Object.fromEntries(
          subjects.map((subject) => [
            subject.id,
            {
              subjectId: subject.id,
              selected: true,
              isMarks: subject?.subject_type?.marking_scheme === "marks",
              rank: subject.rank ?? 1,
              marks: Object.fromEntries(
                examMarksScheme.map((scheme) => [scheme.id, { fm: 0, pm: 0 }])
              ),
            },
          ])
        ),
      }),
      [subjects, examMarksScheme]
    ),
  });

  const resetForm = useCallback(() => {
    reset({
      subjects: Object.fromEntries(
        subjects.map((subject) => {
          const examGradeSubject = examGrade?.exam_grade_subjects?.find(
            (egs) => egs.subject_id === subject.id
          );
          console.log(examGradeSubject);
          return [
            subject.id,
            {
              subjectId: subject.id,
              selected: examGradeSubject?.status ?? true,
              isMarks: subject?.subject_type?.marking_scheme === "marks",
              rank: examGradeSubject?.rank ?? subject.rank ?? 1,
              marks: Object.fromEntries(
                examMarksScheme.map((scheme) => {
                  const examSubjectMarkScheme =
                    examGradeSubject?.exam_subject_marks_schemes.find(
                      (mk_scheme) =>
                        mk_scheme.exam_marks_scheme_id === scheme.id
                    );

                  return [
                    scheme.id,
                    {
                      fm: Number(examSubjectMarkScheme?.full_marks) || 0,
                      pm: Number(examSubjectMarkScheme?.pass_marks) || 0,
                    },
                  ];
                })
              ),
            },
          ];
        })
      ),
    });
  }, [reset, subjects, examGrade?.exam_grade_subjects, examMarksScheme]);

  useEffect(() => {
    if (subjects.length) {
      resetForm();
    }
  }, [subjects, examMarksScheme, resetForm]);

  const onSubmit = async ({ subjects }: FormValues) => {
    setIsSubmitting(true);

    const formattedData = {
      examGradeId: examGrade.exam_grade_id,
      subjects: Object.values(subjects).map((subject) => ({
        subjectId: subject.subjectId,
        selected: subject.selected,
        isMarks: subject.isMarks,
        rank: subject.rank,
        marks: Object.fromEntries(
          Object.entries(subject.marks || {}).map(([key, mark]) => [
            key,
            { fm: mark.fm || 0, pm: mark.pm || 0 },
          ])
        ),
      })),
    } as CreateExamGradeSubject;
    const response = await addExamGradeSubject(formattedData);
    onSave(response);
    setIsSubmitting(false);
  };

  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="custom-table table-border-light">
            <thead>
              <tr>
                <th rowSpan={3} className="w-30px"></th>
                <th rowSpan={3} className="w-100px text-center">
                  Rank
                </th>
                <th rowSpan={3} className="w-150px">
                  Subjects
                </th>
                <th
                  colSpan={theoryMarksSchemes?.length * 2}
                  className="text-center"
                >
                  Theory Group
                </th>
                <th
                  colSpan={practicalMarksScheme?.length * 2}
                  className="text-center"
                >
                  Practical Group
                </th>
              </tr>
              <tr className="text-center">
                {theoryMarksSchemes.map((scheme, th) => (
                  <th className="text-center" key={th} colSpan={2}>
                    {scheme.name}
                  </th>
                ))}
                {practicalMarksScheme.map((scheme, pr) => (
                  <th className="text-center" key={pr} colSpan={2}>
                    {scheme.name}
                  </th>
                ))}
              </tr>
              <tr>
                {examMarksScheme.map((scheme, s) => (
                  <React.Fragment key={s}>
                    <th className="text-center">Full Marks</th>
                    <th className="text-center">Pass Marks </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects?.map((subject) => (
                <tr key={subject.id}>
                  <td>
                    <div className="form-check">
                      <Controller
                        name={`subjects.${subject.id}.selected`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="checkbox"
                            className="form-check-input checkbox checkbox-0"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            value={undefined}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step={1}
                      {...register(`subjects.${subject.id}.rank`, {
                        valueAsNumber: true,
                      })}
                      className={`form-control ${
                        errors.subjects?.[subject.id]?.rank ? "is-invalid" : ""
                      }`}
                      defaultValue={subject.rank}
                    />
                    {errors.subjects?.[subject.id]?.rank && (
                      <div className="invalid-feedback">
                        {errors.subjects[subject.id]?.rank?.message}
                      </div>
                    )}
                  </td>
                  <td>
                    {subject.name} {subject.subject_type?.marking_scheme}
                  </td>
                  {subject.subject_type?.marking_scheme === "grade" && (
                    <td colSpan={examMarksScheme.length * 2}>
                      This Subject is Graded
                    </td>
                  )}
                  {watch(`subjects.${subject.id}.selected`) &&
                    subject.subject_type?.marking_scheme === "marks" &&
                    theoryMarksSchemes.map((scheme) => (
                      <React.Fragment key={scheme.id}>
                        <td>
                          <input
                            type="number"
                            step={0.01}
                            {...register(
                              `subjects.${subject.id}.marks.${scheme.id}.fm`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                            className={`form-control ${
                              errors.subjects?.[subject.id]?.marks?.[scheme.id]
                                ?.fm
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={`FM for ${scheme.short_name}`}
                          />
                          {errors.subjects?.[subject.id]?.marks?.[scheme.id]
                            ?.fm && (
                            <div className="invalid-feedback">
                              {
                                errors.subjects[subject.id]?.marks?.[scheme.id]
                                  ?.fm?.message
                              }
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            {...register(
                              `subjects.${subject.id}.marks.${scheme.id}.pm`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                            type="number"
                            step={0.01}
                            className={`form-control ${
                              errors.subjects?.[subject.id]?.marks?.[scheme.id]
                                ?.pm
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={`PM for ${scheme.short_name}`}
                          />
                          {errors.subjects?.[subject.id]?.marks?.[scheme.id]
                            ?.pm && (
                            <div className="invalid-feedback">
                              {
                                errors.subjects[subject.id]?.marks?.[scheme.id]
                                  ?.pm?.message
                              }
                            </div>
                          )}
                        </td>
                      </React.Fragment>
                    ))}

                  {watch(`subjects.${subject.id}.selected`) &&
                    subject.subject_type?.marking_scheme === "marks" &&
                    practicalMarksScheme.map((scheme) => (
                      <React.Fragment key={scheme.id}>
                        <td>
                          <input
                            type="number"
                            step={0.01}
                            {...register(
                              `subjects.${subject.id}.marks.${scheme.id}.fm`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                            className={`form-control ${
                              errors.subjects?.[subject.id]?.marks?.[scheme.id]
                                ?.fm
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={`FM for ${scheme.short_name}`}
                          />
                          {errors.subjects?.[subject.id]?.marks?.[scheme.id]
                            ?.fm && (
                            <div className="invalid-feedback">
                              {
                                errors.subjects[subject.id]?.marks?.[scheme.id]
                                  ?.fm?.message
                              }
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            {...register(
                              `subjects.${subject.id}.marks.${scheme.id}.pm`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                            type="number"
                            step={0.01}
                            className={`form-control ${
                              errors.subjects?.[subject.id]?.marks?.[scheme.id]
                                ?.pm
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={`PM for ${scheme.short_name}`}
                          />
                          {errors.subjects?.[subject.id]?.marks?.[scheme.id]
                            ?.pm && (
                            <div className="invalid-feedback">
                              {
                                errors.subjects[subject.id]?.marks?.[scheme.id]
                                  ?.pm?.message
                              }
                            </div>
                          )}
                        </td>
                      </React.Fragment>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center pt-15">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Discard
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting......" : "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AssignExamSubject;
