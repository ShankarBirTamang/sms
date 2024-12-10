import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { GradeInterface } from "../../../services/gradeService";
import {
  SubjectInterface,
  UpdateSubjectInterface,
} from "../../../services/subjectService";
import useSubject from "../../../hooks/useSubject";
import useSubjectType from "../../../hooks/useSubjectType";

const SubjectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code_th: z.string().min(1, { message: "Subject Code TH is required," }),
  code_pr: z.string().min(1, { message: "Subject Code PR is required," }),
  credit_hour: z.number(),
  subject_type_id: z.number(),
  is_chooseable: z.boolean().default(false),
  is_section_specific: z.boolean().default(false),
  sections: z.array(z.number()).optional(),
});
type FormData = z.infer<typeof SubjectSchema>;

interface AddSubjectProps {
  grade?: GradeInterface;
  onSave: () => void;
  formMode: "create" | "edit";
  subject?: UpdateSubjectInterface;
}
const AddSubject = ({ grade, onSave, formMode, subject }: AddSubjectProps) => {
  const { saveSubject, updateSubject } = useSubject({
    grade_id: grade?.id ?? -1,
  });

  const { subjectTypes } = useSubjectType({});
  const [isChooseable, setIsChooseable] = useState<boolean>(false);
  const [isSectionSpecific, setIsSectionSpecific] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SubjectSchema),
  });

  const handleIsChooseableChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setIsChooseable(value);
    setValue("is_chooseable", value);
  };

  const handleIsSectionSpecificChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setIsSectionSpecific(value);
    setValue("is_section_specific", value);
  };

  useEffect(() => {
    if (formMode === "edit" && subject) {
      console.log(subject);

      setValue("name", subject.name);
      setValue("credit_hour", subject.credit_hour ?? 0);
      const code = subject.code.split(",");
      setValue("code_th", code[0] ?? null);
      setValue("code_pr", code[1] ?? null);
      setValue("subject_type_id", subject.subject_type?.id ?? -1);
      if (subject.is_chooseable) {
        setValue("is_chooseable", true);
        setIsChooseable(true);
      } else {
        setValue("is_chooseable", false);
        setIsChooseable(false);
      }

      if (subject.is_section_specific) {
        setValue("is_section_specific", true);
        setIsSectionSpecific(true);
      } else {
        setValue("is_section_specific", false);
        setIsSectionSpecific(false);
      }
    }
  }, [formMode, subject, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted", data);
    try {
      const subjectData: SubjectInterface = {
        name: data.name,
        code: [data.code_th, data.code_pr].join(","),
        credit_hour: data.credit_hour,
        subject_type_id: data.subject_type_id,
        is_chooseable: data.is_chooseable,
        is_section_specific: data.is_section_specific,
        sections: data.sections,
      };

      if (formMode === "create") {
        await saveSubject(subjectData);
      } else if (formMode === "edit" && subject) {
        const updateData: UpdateSubjectInterface = {
          id: subject.id as number,
          ...subjectData,
        };
        console.log(subjectData);
        await updateSubject(updateData);
      }
      onSave(); // Callback after save
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };
  // if (Object.keys(errors).length > 0) {
  //   console.log("Form has validation errors:", errors);
  //   return; // Prevent submission if there are errors
  // }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-6">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Subject Name</label>
              <input
                type="text"
                className={`form-control mb-3 mb-lg-0 ${
                  errors.name && "is-invalid"
                }`}
                placeholder="Ex: Science"
                {...register("name")}
              />
            </div>
          </div>
          <div className="col-3">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Subject Code</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  {...register("code_th")}
                  className={`form-control mb-3 mb-lg-0 ${
                    errors.code_th && "is-invalid"
                  }`}
                  placeholder="TH"
                />
                <input
                  type="text"
                  {...register("code_pr")}
                  className={`form-control mb-3 mb-lg-0 ${
                    errors.code_pr && "is-invalid"
                  }`}
                  placeholder="PR"
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Total Credit Hours
              </label>
              <input
                type="text"
                {...register("credit_hour", {
                  valueAsNumber: true,
                })}
                className={`form-control mb-3 mb-lg-0 ${
                  errors.code_pr && "is-invalid"
                }`}
                placeholder="4"
              />
            </div>
          </div>
          <div className="col-4">
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2" htmlFor="subject_educator">
                Select Subject Educator
              </label>
              <select
                className={`form-control form-select mb-3 mb-lg-0`}
                id="subject_educator"
                name="select"
              >
                <option value="1">Default User</option>
                <option value="2">Default User2</option>
              </select>
            </div>
          </div>
          <div className="col-4">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Select Subject Type
              </label>
              <Controller
                name="subject_type_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`form-control form-select mb-3 mb-lg-0 ${
                      errors.subject_type_id ? "is-invalid" : ""
                    }`}
                    // Ensure the value is treated as a number by setting valueAsNumber
                    value={field.value ? Number(field.value) : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {subjectTypes.map((type, t) =>
                      type.is_active ? (
                        <option key={t} value={type.id}>
                          {type.name}
                        </option>
                      ) : null
                    )}
                  </select>
                )}
              />

              {errors.subject_type_id && (
                <span>{errors.subject_type_id.message}</span>
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Is Subject chooseable by Students?
              </label>
              <div className="d-flex gap-3 mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="true"
                    id="is_chooseable_yes"
                    checked={isChooseable === true}
                    onChange={handleIsChooseableChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="is_chooseable_yes"
                  >
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="false"
                    id="is_chooseable_no"
                    onChange={handleIsChooseableChange}
                    checked={isChooseable === false}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="is_chooseable_no"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Is Subject Section Specific?
              </label>
              <div className="d-flex gap-3 mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="true"
                    id="is_section_yes"
                    onChange={handleIsSectionSpecificChange}
                    checked={isSectionSpecific === true}
                  />
                  <label className="form-check-label" htmlFor="is_section_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="false"
                    onChange={handleIsSectionSpecificChange}
                    checked={isSectionSpecific === false}
                    id="is_section_no"
                  />
                  <label className="form-check-label" htmlFor="is_section_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          {isSectionSpecific && (
            <div className="col-12">
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Select Associated Sections For Subject
                </label>
                <div className="d-flex mt-3">
                  {grade &&
                    Object.entries(grade.sections).map(
                      ([sectionGroup, sections], sci) => (
                        <div key={`SEC-${sci}`} className="mb-1">
                          <strong>{sectionGroup.split(",")[0].trim()}:</strong>
                          <div className="d-flex flex-wrap gap-3 mt-3">
                            {sections.map((section, si) => (
                              <div key={`${sectionGroup}-${si}`}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    {...register("sections")}
                                    value={section.id}
                                    id={section.name}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={section.name}
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
                </div>
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="d-flex gap-3">
          <button type="button" className="btn btn-secondary">
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Assign Subject
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSubject;
