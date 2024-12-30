import React, { useEffect, useState } from "react";
import {
  AddClassTeacher,
  TeacherInterface,
} from "../../../services/gradeService";
import useEmployee from "../../../../Modules/Employee/hooks/useEmployee";
import Loading from "../../../../components/Loading/Loading";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../components/Icon/Icon";
import { z } from "zod";

const SubjectTeacherSchema = z.object({
  teacher: z.number(),
  sections: z.array(z.string()),
});

const SubjectTeacher = ({ grade, onSave }: AddClassTeacher) => {
  const { employees } = useEmployee({});
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherInterface[]>([]);
  const [renderKey, setRenderKey] = useState("");

  const [columns, setColumns] = useState<
    { teacherId: number | null; sections: string[] }[]
  >([{ teacherId: null, sections: [] }]);

  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    const teachers = employees
      .filter((employee) => employee.employee_type?.name === "Teacher")
      .map((teacher) => ({
        value: teacher.id,
        label: teacher.full_name,
      }));
    setTeachers(teachers);

    if (teachers.length <= 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [employees]);

  const handleTeacherChange = (
    index: number,
    selectedOption: { value: number; label: string } | null
  ) => {
    const newColumns = [...columns];
    newColumns[index].teacherId = selectedOption?.value ?? null;
    setColumns(newColumns);
  };

  const handleAddMore = () => {
    setColumns([...columns, { teacherId: null, sections: [] }]);
  };
  const handleDelete = (index: number) => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
    setColumns(columns.filter((_, i) => i !== index));
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
  };

  interface Column {
    teacherId: number | null;
    sections: string[];
  }

  interface ValidationResult {
    success: boolean;
    error?: z.ZodError;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResults: ValidationResult[] = columns.map(
      (column: Column) => SubjectTeacherSchema.safeParse(column)
    );
    const isValid = validationResults.every(
      (result: ValidationResult) => result.success
    );

    if (isValid) {
      console.log("Form is valid:", columns);
    } else {
      console.log("Form is invalid:", validationResults);
    }
  };

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit}>
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
                  <td>1</td>
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
                      placeholder={`Select Subject Teacher`}
                    />
                  </td>
                  <td>
                    {Object.entries(grade.sections).map(
                      ([sectionGroup, sections], sci) => (
                        <div key={`SEC-${sci}`} className="mb-1">
                          <strong>{sectionGroup.split(",")[0].trim()}:</strong>
                          <div className=" d-flex flex-wrap gap-3">
                            {sections.map((section, si) => (
                              <div key={si} className="form-check mt-2">
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
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={section.id.toString()}
                                >
                                  {section.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
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
                    className="btn btn-primary btn-sm me-3"
                    title="Add"
                    onClick={handleAddMore}
                  >
                    <Icon name="add" className="svg-icon svg-icon-1" />
                    Add More
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    title="Add"
                    onClick={handleAddMore}
                  >
                    <Icon name="add" className="svg-icon svg-icon-1" />
                    Save
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
