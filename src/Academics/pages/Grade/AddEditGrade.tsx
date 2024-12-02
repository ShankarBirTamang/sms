import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icon";
import Loading from "../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, string, z } from "zod";
import { useForm } from "react-hook-form";
import useAcademicSession from "../../hooks/useAcademicSession";
import CustomSelect, {
  Option,
} from "../../../components/CustomSelect/CustomSelect";
import useGradeGroup from "../../hooks/useGradeGroup";
import useFaculty from "../../hooks/useFaculty";
import { Stringifier } from "styled-components/dist/types";
import SectionComponent from "./SectionComponent";

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
    has_faculties: z.boolean({ message: "Has Faculties Field is requred." }),
    section_type: z.enum(["standard", "custom"], {
      errorMap: () => ({ message: "This field is required" }),
    }),
    sections: z.array(SectionSchema),
    selectedFaculties: z.array(z.string()),
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
      setValue("academic_session_id", selectedOption.value);
    }
  };

  const handleGradeGroupChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("grade_group_id", selectedOption.value);
    }
  };

  const onSubmit = (data: FormData) => {
    alert("oops");
    console.log(data);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Current validation errors:", errors);
    }
  }, [errors]);

  //custom section without faculties end

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

          {/* section part start */}
          <SectionComponent />
          {/* Section part end */}
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
