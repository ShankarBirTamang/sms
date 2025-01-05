import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GradeInterface,
  SectionInterface,
} from "../../../services/gradeService";
import { StudentInterface } from "../../../../Modules/Student/services/studentService";
import Loading from "../../../../components/Loading/Loading";
import useGrade from "../../../hooks/useGrade";

interface StudentRollNoProps {
  onSave: () => void;
  grade: GradeInterface;
  section: SectionInterface;
  students: StudentInterface[];
}

const rollNoSchema = z.object({
  students: z.record(
    z.object({
      rollNo: z
        .string()
        .min(1, "Roll No is required")
        .max(10, "Roll No must be at most 10 characters")
        .regex(/^\d+$/, "Roll No must contain only numbers"),
    })
  ),
});

type FormData = z.infer<typeof rollNoSchema>;

const StudentRollNo = ({
  grade,
  section,
  students,
  onSave,
}: StudentRollNoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setStudentRollNo } = useGrade({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(rollNoSchema),
    defaultValues: {
      students: students.reduce((acc, student) => {
        acc[student.id] = { rollNo: student.roll_no?.toString() ?? "" };
        return acc;
      }, {} as Record<string, { rollNo: string }>),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formattedData = Object.entries(data.students).map(
      ([id, { rollNo }]) => ({
        id: Number(id),
        roll: rollNo,
      })
    );
    await setStudentRollNo({ gradeId: grade.id ?? 0, data: formattedData });
    onSave();
    setIsSubmitting(false);
  };

  const handleAutoAssign = () => {
    students.forEach((student, index) => {
      setValue(`students.${student.id}.rollNo`, (index + 1).toString());
    });
    console.log("Roll Numbers Auto-Assigned");
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && students.length === 0 && (
        <div className="alert alert-info">No Student Records Found</div>
      )}

      {!isLoading && students.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table align-middle table-row-dashed fs-6 gy-1">
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">S.N.</th>
                <th className="w-200px">Name</th>
                <th className="w-100px">Roll No</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-bold">
              {students.map((student, index) => (
                <tr key={student.id}>
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
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center pt-15">
            <button
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
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default StudentRollNo;
