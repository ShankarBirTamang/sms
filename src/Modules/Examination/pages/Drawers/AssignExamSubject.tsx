import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExamGrade, ExamMarksScheme } from "../../services/examSessionService";
import useSubject from "../../../Academics/hooks/useSubject";
import Loading from "../../../../components/Loading/Loading";

interface AssignExamSubjectProps {
  examMarksScheme: ExamMarksScheme[];
  examGrade: ExamGrade;
  onSave: (data: any) => void;
}

// Define Zod schema for validation
const MarksSchema = z.object({
  fm: z.number().min(1, "Full Marks is required"),
  pm: z.number().min(1, "Pass Marks is required"),
});

const SubjectSchema = z.object({
  subjectId: z.number(),
  selected: z.boolean(),
  rank: z.number().min(1, "Rank is required"),
  marks: z.record(MarksSchema), // Ensure marks is a record
});

const FormSchema = z.array(SubjectSchema);

type FormValues = z.infer<typeof FormSchema>;

const AssignExamSubject = ({
  examMarksScheme,
  examGrade,
  onSave,
}: AssignExamSubjectProps) => {
  const { subjects, isLoading } = useSubject({ grade_id: examGrade.grade_id });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: subjects?.map((subject) => ({
      subjectId: subject.id,
      selected: false,
      rank: subject.rank || 1,
      marks: examMarksScheme.reduce((acc, scheme) => {
        acc[scheme.id] = { fm: 0, pm: 0 }; // Initialize marks as an object
        return acc;
      }, {} as Record<string, { fm: number; pm: number }>),
    })),
  });

  useEffect(() => {
    if (subjects) {
      reset(
        subjects.map((subject) => ({
          subjectId: subject.id,
          selected: false,
          rank: subject.rank || 1,
          marks: examMarksScheme.reduce((acc, scheme) => {
            acc[scheme.id] = { fm: 0, pm: 0 }; // Initialize marks as an object
            return acc;
          }, {} as Record<string, { fm: number; pm: number }>),
        }))
      );
    }
  }, [subjects, examMarksScheme, reset]);

  const theoryMarksSchemes = examMarksScheme?.filter(
    (scheme) => scheme.group === "Theory"
  );
  const practicalMarksScheme = examMarksScheme?.filter(
    (scheme) => scheme.group === "Practical"
  );

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", JSON.stringify(data, null, 2));
    onSave(data);
  };

  useEffect(() => {
    console.log("Errors:", JSON.stringify(errors, null, 2));
  }, [errors]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table table-row-bordered table-responsive table-hover table-bordered align-middle">
            <thead>
              <tr>
                <th rowSpan={3} className="w-30px">
                  <div className="form-check">
                    <input
                      className="form-check-input selectAll"
                      type="checkbox"
                    />
                  </div>
                </th>
                <th rowSpan={3} className="w-70px text-center">
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
                  <th key={th} colSpan={2}>
                    {scheme.name}
                  </th>
                ))}
                {practicalMarksScheme.map((scheme, pr) => (
                  <th key={pr} colSpan={2}>
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
              {subjects?.map((subject, index) => (
                <tr key={subject.id}>
                  <td>
                    <div className="form-check">
                      <Controller
                        name={`${index}.selected`}
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
                    <Controller
                      name={`${index}.rank`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step={1}
                          className={`form-control ${
                            errors[index]?.rank ? "is-invalid" : ""
                          }`}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                    {errors[index]?.rank && (
                      <div className="invalid-feedback">
                        {errors[index]?.rank?.message}
                      </div>
                    )}
                  </td>
                  <td>
                    <input type="hidden" value="3" />
                    <input type="hidden" className="form-control" value="no" />
                    {subject.name}
                  </td>
                  {theoryMarksSchemes.map((scheme) => (
                    <React.Fragment key={scheme.id}>
                      <td>
                        <Controller
                          name={`${index}.marks.${scheme.id}.fm`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step={0.01}
                              className={`form-control ${
                                errors[index]?.marks?.[scheme.id]?.fm
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              value={field.value}
                            />
                          )}
                        />
                        {errors[index]?.marks?.[scheme.id]?.fm && (
                          <div className="invalid-feedback">
                            {errors[index]?.marks?.[scheme.id]?.fm?.message}
                          </div>
                        )}
                      </td>
                      <td>
                        <Controller
                          name={`${index}.marks.${scheme.id}.pm`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step={0.01}
                              className={`form-control ${
                                errors[index]?.marks?.[scheme.id]?.pm
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              value={field.value}
                            />
                          )}
                        />
                        {errors[index]?.marks?.[scheme.id]?.pm && (
                          <div className="invalid-feedback">
                            {errors[index]?.marks?.[scheme.id]?.pm?.message}
                          </div>
                        )}
                      </td>
                    </React.Fragment>
                  ))}
                  {practicalMarksScheme.map((scheme) => (
                    <React.Fragment key={scheme.id}>
                      <td>
                        <Controller
                          name={`${index}.marks.${scheme.id}.fm`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step={0.01}
                              className={`form-control ${
                                errors[index]?.marks?.[scheme.id]?.fm
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              value={field.value}
                            />
                          )}
                        />
                        {errors[index]?.marks?.[scheme.id]?.fm && (
                          <div className="invalid-feedback">
                            {errors[index]?.marks?.[scheme.id]?.fm?.message}
                          </div>
                        )}
                      </td>
                      <td>
                        <Controller
                          name={`${index}.marks.${scheme.id}.pm`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              step={0.01}
                              className={`form-control ${
                                errors[index]?.marks?.[scheme.id]?.pm
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              value={field.value}
                            />
                          )}
                        />
                        {errors[index]?.marks?.[scheme.id]?.pm && (
                          <div className="invalid-feedback">
                            {errors[index]?.marks?.[scheme.id]?.pm?.message}
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
              onClick={() => reset()}
            >
              Discard
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AssignExamSubject;
