import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icon";
import Loading from "../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useAcademicSession from "../../hooks/useAcademicSession";
import CustomSelect, {
  Option,
} from "../../../components/CustomSelect/CustomSelect";
import useGradeGroup from "../../hooks/useGradeGroup";

const AddEditGrade = () => {
  const { academicSessions } = useAcademicSession({});
  const { gradeGroups } = useGradeGroup({});
  const academicSessionOptions = academicSessions.map((session) => ({
    value: session.id,
    label: session.name,
  }));

  const gradeGroupOptions = gradeGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));
  const [renderKey, setRenderKey] = useState("");
  const [selectedAcademicLevel, setSelectedAcademicLevel] =
    useState<Option | null>(null);
  const [selectedGradeGroup, setSelectedGradeGroup] = useState<Option | null>(
    null
  );
  const generalSections = ["A", "B", "C", "D", "E", "F", "G"];
  const SectionSchema = z.object({
    name: z.string(),
  });

  const GradeSchema = z.object({
    academic_session_id: z
      .number({ message: "Academic Session is requried" })
      .refine(
        (id) => {
          return academicSessions.some((session) => session.id === id);
        },
        {
          message: "Invalid academic session ID",
        }
      ),
    grade_group_id: z.number({ message: "Grade Group is requried" }).refine(
      (id) => {
        return gradeGroups.some((group) => group.id === id);
      },
      {
        message: "Invalid Grade Group ID",
      }
    ),
    name: z.string().min(1, { message: "Grade name is required" }),
    short_name: z.string().min(1, { message: "Short Name is Required" }),
    has_faculties: z
      .string()
      .transform((val) => val === "true")
      .refine((val) => typeof val === "boolean", {
        message: "Invalid boolean value",
      }),
    section_type: z.enum(["standard", "custom"], {
      errorMap: () => ({ message: "This field is required" }),
    }),
    sections: z.array(SectionSchema),
  });
  type FormData = z.infer<typeof GradeSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(GradeSchema),
  });

  const handleAcademicSessionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_session_id", selectedOption.value); // Update form value
    }
  };

  const handleGradeGroupChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("grade_group_id", selectedOption.value); // Update form value
    }
  };

  const onSubmit = (data: FormData) => {
    alert("oops");
    console.log(data);
    // Handle the form submission logic here
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Current validation errors:", errors);
    }
  }, [errors]);

  return (
    <div className="add-grade">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Select Academic Session
              </label>
              <CustomSelect
                key={renderKey}
                options={academicSessionOptions}
                onChange={handleAcademicSessionChange}
                error={errors.academic_session_id?.message}
                defaultValue={selectedAcademicLevel}
                placeholder="Select Academic Level"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Select Grade Group
              </label>
              <CustomSelect
                key={renderKey}
                options={gradeGroupOptions}
                onChange={handleGradeGroupChange}
                error={errors.grade_group_id?.message}
                defaultValue={selectedGradeGroup}
                placeholder="Select Grade Group"
              />
            </div>
          </div>
          <div className="col-12">
            <hr />
          </div>
          <div className="col-md-6">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Grade Name</label>
              <input
                type="text"
                className={`form-control mb-3 mb-lg-0 ${
                  errors.name && "is-invalid"
                }`}
                placeholder="Ex: Lower Kindergarten or Grade 1"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Grade Short Name</label>
              <input
                type="text"
                className={`form-control mb-3 mb-lg-0 ${
                  errors.short_name && "is-invalid"
                }`}
                placeholder="Ex: LKG or 1"
                {...register("short_name")}
              />
              {errors.short_name && (
                <span className="text-danger">{errors.short_name.message}</span>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Does Grade Have Streams?
              </label>
              <div className="d-flex gap-3 mt-3">
                <div className="form-check">
                  <input
                    title="Yes"
                    className="form-check-input"
                    type="radio"
                    value="true"
                    id="has_faculties_yes"
                    {...register("has_faculties", { valueAsNumber: true })}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    title="No"
                    className="form-check-input"
                    type="radio"
                    value="false"
                    id="has_faculties_no"
                    checked
                    {...register("has_faculties", { valueAsNumber: true })}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              {errors.has_faculties && (
                <span className="text-danger">
                  {errors.has_faculties.message}
                </span>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Grade's Section Name Type:
              </label>
              <div className="d-flex gap-3 mt-3">
                <div className="form-check">
                  <input
                    title="Standard"
                    className="form-check-input"
                    type="radio"
                    value="standard"
                    id="section_type_standard"
                    {...register("section_type", {
                      required: "This field is required",
                    })}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="section_type_standard"
                  >
                    Standard A,B,C
                  </label>
                </div>
                <div className="form-check">
                  <input
                    title="Custom"
                    className="form-check-input"
                    type="radio"
                    value="custom"
                    id="section_type_custom"
                    checked
                    {...register("section_type")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="section_type_custom"
                  >
                    Custom Names
                  </label>
                </div>
              </div>
              {errors.section_type && (
                <span className="text-danger">
                  {errors.section_type.message}
                </span>
              )}
            </div>
          </div>

          <div className="col-12">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Select Sections
              </label>
              <div className="row">
                {generalSections.map((section, index) => (
                  <div className="col-1" key={index}>
                    <div className="form-check">
                      <input
                        title={section}
                        className="form-check-input sectionCheckbox"
                        type="checkbox"
                        value={section}
                        id={`section-${index}`}
                        {...register("sections")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`section-${index}`}
                      >
                        {section}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.sections && (
                <span className="text-danger">{errors.sections.message}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-center pt-15">
          <button type="button" className="btn btn-light me-3">
            Discard
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditGrade;
