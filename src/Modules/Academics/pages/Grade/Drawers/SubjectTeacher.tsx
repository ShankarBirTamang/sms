import React, { useEffect, useState } from "react";
import {
  TeacherInterface,
  UpdateGradeInterface,
} from "../../../services/gradeService";
import Loading from "../../../../../components/Loading/Loading";
import CustomSelect from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectInterface } from "../../../services/subjectService";
import useSubject from "../../../hooks/useSubject";

const TeacherSectionSchema = z.object({
  teacherId: z.number().min(1, { message: "Subject Teacher is Required" }),
  sections: z
    .array(z.string())
    .min(1, { message: "At least one section must be selected" }),
});

const SubjectTeacherSchema = z.object({
  teachers: z.array(TeacherSectionSchema),
});
type FormData = z.infer<typeof SubjectTeacherSchema>;

interface AddSubjectTeacher {
  grade: UpdateGradeInterface;
  subject: SubjectInterface;
  teachers: TeacherInterface[];
  onSave: () => void;
}

const SubjectTeacher = ({
  grade,
  subject,
  teachers,
  onSave,
}: AddSubjectTeacher) => {
  const { assignSubjectTeacher } = useSubject({ grade_id: grade.id });
  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState("");
  const [columns, setColumns] = useState<
    { teacherId: number; sections: string[] }[]
  >([{ teacherId: 0, sections: [] }]);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SubjectTeacherSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsLoading(teachers.length <= 0);

    if (subject.teachers && subject.teachers.length > 0) {
      const initialColumns = subject.teachers.map((teacher) => ({
        teacherId: teacher.id,
        sections:
          teacher.sections?.map((section) => section.id.toString()) || [],
      }));

      setColumns(initialColumns);

      initialColumns.forEach((column, index) => {
        setValue(`teachers.${index}.teacherId`, column.teacherId);
        setValue(`teachers.${index}.sections`, column.sections);
      });
      console.log(
        "initialColumns at line 67 in Drawers/SubjectTeacher.tsx:",
        initialColumns
      );
    } else {
      setColumns([{ teacherId: 0, sections: [] }]);
    }
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [teachers, subject, setValue]);

  const handleTeacherChange = (
    index: number,
    selectedOption: { value: number; label: string } | null
  ) => {
    const newColumns = [...columns];
    newColumns[index].teacherId = selectedOption?.value ?? 0;
    setColumns(newColumns);
    setValue("teachers", newColumns);
  };

  const handleAddMore = () => {
    setColumns([...columns, { teacherId: 0, sections: [] }]);
  };

  const handleDelete = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
    setValue("teachers", columns);
  };

  const handleCheckboxChange = (index: number, sectionId: string) => {
    const newColumns = [...columns];
    const sectionIndex = newColumns[index].sections.indexOf(sectionId);
    if (sectionIndex > -1) {
      newColumns[index].sections.splice(sectionIndex, 1);
    } else {
      newColumns[index].sections.push(sectionId);
    }
    setColumns(newColumns);
    setValue("teachers", newColumns);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const validatedData = SubjectTeacherSchema.parse(data);
    if (subject.id === undefined) {
      console.error("Subject ID is undefined");
      setIsSubmitting(false);
      return;
    }
    await assignSubjectTeacher({
      subjectId: subject.id,
      data: validatedData.teachers,
    });
    onSave();
    setIsSubmitting(false);
  };

  useEffect(() => {
    setValue("teachers", columns);
  }, [columns, setValue]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table align-middle table-row-dashed fs-6 gy-1 ">
            <thead>
              <tr className="text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">SN</th>
                <th className="w-300px">Teacher</th>
                <th className="">Sections</th>
                <th className="w-150px text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-bold">
              {columns.map((column, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-start">
                    <CustomSelect
                      key={renderKey}
                      options={teachers}
                      onChange={(selectedOption) =>
                        handleTeacherChange(index, selectedOption)
                      }
                      defaultValue={
                        teachers.find(
                          (teacher) => teacher.value === column.teacherId
                        ) || null
                      }
                      error={errors.teachers?.[index]?.teacherId?.message}
                      placeholder={`Select Subject Teacher`}
                    />
                  </td>
                  <td>
                    {Object.entries(grade.sections).map(
                      ([sectionGroup, sections], sci) => (
                        <div key={`SEC-${sci}`} className="mb-1">
                          <strong>{sectionGroup.split(",")[0].trim()}:</strong>
                          <div className="row">
                            {sections.map((section, si) => (
                              <div key={si} className="col-4 mb-3">
                                <div className="form-check mt-2">
                                  <input
                                    className="form-check-input sectionCheckbox"
                                    type="checkbox"
                                    value={section.id}
                                    id={section.id.toString()}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        index,
                                        section.id.toString()
                                      )
                                    }
                                    checked={column.sections.includes(
                                      section.id.toString()
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={section.id.toString()}
                                  >
                                    {section.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                    {errors.teachers?.[index]?.sections && (
                      <span className="text-danger">
                        {errors.teachers?.[index]?.sections?.message}
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    <button
                      title="delete"
                      type="button"
                      className="btn btn-light-danger  btn-sm"
                      onClick={() => handleDelete(index)}
                    >
                      <Icon name="delete" className="svg-icon svg-icon-1" />{" "}
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-end">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm me-3"
                    title="Add"
                    onClick={handleAddMore}
                  >
                    <Icon name="add" className="svg-icon svg-icon-1" />
                    Add More
                  </button>
                  <button type="button" className="btn btn-light me-3">
                    Discard
                  </button>
                  <button
                    title="submit"
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isSubmitting ? "Saving..." : "Submit"}
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </form>
      )}
    </>
  );
};

export default SubjectTeacher;
