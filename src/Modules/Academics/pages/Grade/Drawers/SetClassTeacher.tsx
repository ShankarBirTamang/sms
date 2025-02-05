import React, { useEffect, useState } from "react";
import useEmployee from "../../../../../Modules/Employee/hooks/useEmployee";
import {
  AddClassTeacher,
  Section,
  TeacherInterface,
} from "../../../services/gradeService";
import Loading from "../../../../../components/Loading/Loading";
import CustomSelect from "../../../../../components/CustomSelect/CustomSelect";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useGrade from "../../../hooks/useGrade";

const SectionTeacherSchema = z.object({
  sectionId: z.number(),
  classTeacherId: z.number(),
});

const ClassTeacherSchema = z.object({
  sections: z.array(SectionTeacherSchema),
});

type FormData = z.infer<typeof ClassTeacherSchema>;

const SetClassTeacher = ({ grade, onSave }: AddClassTeacher) => {
  const { employees } = useEmployee({});
  const { setClassTeacher } = useGrade({});
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherInterface[]>([]);

  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    const teachers = employees
      .filter((employee) => employee.employee_type?.name === "Teacher")
      .map((teacher) => ({
        value: teacher.id,
        label: `${teacher.full_name}${
          teacher.class?.grade ? ` (${teacher.class.full_grade})` : ""
        }`,
      }));
    setTeachers(teachers);

    if (teachers.length <= 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [employees]);

  const handleTeacherChange = (
    selectedOption: { value: number; label: string } | null,
    sectionId: number
  ) => {
    const currentSections: Section[] = getValues("sections") || [];

    let updatedSections: Section[];

    if (sectionId) {
      if (selectedOption) {
        updatedSections = currentSections.some(
          (section) => section.sectionId === sectionId
        )
          ? currentSections.map((section) =>
              section.sectionId === sectionId
                ? { ...section, classTeacherId: selectedOption.value }
                : section
            )
          : [
              ...currentSections,
              { sectionId, classTeacherId: selectedOption.value },
            ];
      } else {
        updatedSections = currentSections.filter(
          (section) => section.sectionId !== sectionId
        );
      }

      setValue("sections", updatedSections);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ClassTeacherSchema),
  });

  const onSubmit = async (data: FormData) => {
    setisSubmitting(true);
    await setClassTeacher({ gradeId: grade.id, data: data.sections });
    onSave();
    setisSubmitting(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table align-middle table-row-dashed fs-6 gy-1 ">
            <thead>
              <tr className="text-center text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">SN</th>
                <th className="w-105px">Faculty</th>
                <th className="w-125px">Sections</th>
                <th className="w-300px">Class Teacher</th>
              </tr>
            </thead>
            <tbody className="text-center fw-bold">
              {Object.entries(grade.sections).map(
                ([sectionGroup, sections], sci) => (
                  <React.Fragment key={sci}>
                    <tr>
                      <td rowSpan={sections.length + 1}>{sci + 1}</td>
                      <td rowSpan={sections.length + 1}>
                        {sectionGroup.split(",")[0].trim()}
                      </td>
                    </tr>

                    {sections.map((section, si) => (
                      <tr key={`${sectionGroup}-${si}`}>
                        <td className="text-center">
                          <span className="badge badge-primary badge-lg p-2 px-4 text-center">
                            {section.name}
                          </span>
                        </td>
                        <td className="text-start">
                          <CustomSelect
                            key={si}
                            options={teachers}
                            onChange={(selectedOption) =>
                              handleTeacherChange(selectedOption, section.id)
                            }
                            defaultValue={
                              teachers.find(
                                (teacher) =>
                                  teacher.value === section.teacher?.id
                              ) || null
                            }
                            placeholder={`Select Class Teacher for ${section.name}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
          <br />
          <span className="text-danger">
            <strong>Note</strong>:If a teacher is selected for a new class or
            section, they will automatically be removed from any previous class
            or section to which they were assigned.
            <br />
            यदि कुनै शिक्षकलाई नयाँ कक्षा वा सेक्सनका लागि चयन गरियो भने,
            अघिल्लो कक्षा वा सेक्सनबाट स्वचालित रूपमा हट्नेछ।
          </span>
          <br />
          <br />
          <div className="text-center pt-15">
            <button type="button" className="btn btn-light me-3">
              Discard
            </button>
            <button title="submit" type="submit" className="btn btn-primary">
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SetClassTeacher;
