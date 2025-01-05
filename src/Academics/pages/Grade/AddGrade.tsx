import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useAcademicSession from "../../hooks/useAcademicSession";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import useGradeGroup from "../../hooks/useGradeGroup";
import SectionComponent from "./SectionComponent";
import {
  AddGradeInterface,
  OldGradeInterface,
  SectionData,
} from "../../services/gradeService";
import useGrade from "../../hooks/useGrade";
import Loading from "../../../components/Loading/Loading";

interface AddGradeProps {
  onSave: () => void;
  oldGrades: OldGradeInterface[];
}
const AddGrade = ({ onSave, oldGrades }: AddGradeProps) => {
  const { academicSessions } = useAcademicSession({});
  const { gradeGroups } = useGradeGroup({});
  const { saveGrade } = useGrade({});
  const [isLoading, setIsLoading] = useState(false);

  const academicSessionOptions = academicSessions
    .filter((session) => session.is_active)
    .map((session) => ({
      value: session.id,
      label: session.name,
    }));

  const gradeGroupOptions = gradeGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [renderKey, setRenderKey] = useState("");

  const FacultySectionSchema = z.object({
    facultyId: z.number().int({ message: "Faculty ID must be an integer" }),
    sections: z.array(
      z.string().min(1, { message: "Section name cannot be empty" })
    ),
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
    name: z
      .string()
      .min(1, { message: "Grade name is required" })
      .refine((name) => !oldGrades.some((grade) => grade.name === name), {
        message: "Grade name already exists",
      }),
    short_name: z
      .string()
      .min(1, { message: "Grade short name is required" })
      .refine(
        (short_name) =>
          !oldGrades.some((grade) => grade.short_name === short_name),
        { message: "Grade short name already exists" }
      ),
    has_faculties: z.boolean({ message: "Has Faculties Field is requred." }),
    section_type: z.enum(["standard", "custom"], {
      errorMap: () => ({ message: "This field is required" }),
    }),
    sections: z.array(z.string()),
    facultySections: z.array(FacultySectionSchema),
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

  useEffect(() => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [academicSessions, gradeGroups]);

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

  const handleSectionDataChange = (data: SectionData, isValid: boolean) => {
    if (isValid) {
      setValue("section_type", data.sectionType);
      setValue("has_faculties", data.hasFaculties);
      setValue("sections", data.sections ?? []);
      setValue("facultySections", data.facultySections ?? []);
    }
  };

  const onSubmit = async (data: FormData) => {
    setisSubmitting(true);

    try {
      const gradeData: AddGradeInterface = {
        name: data.name,
        short_name: data.short_name,
        academic_session_id: data.academic_session_id,
        grade_group_id: data.grade_group_id,
        hasFaculties: data.has_faculties,
        sectionType: data.section_type,
        sections: data.sections,
        facultySections: data.facultySections,
      };
      await saveGrade(gradeData);
    } catch (error) {
      console.error("Error saving academic level:", error);
    } finally {
      setisSubmitting(false);
      onSave();
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Current validation errors:", errors);
    }
  }, [errors]);

  return (
    <div className="add-grade">
      {isLoading && <Loading />}
      {!isLoading && (
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
                  <span className="text-danger">
                    {errors.short_name.message}
                  </span>
                )}
              </div>
            </div>
            <SectionComponent onSectionDataChange={handleSectionDataChange} />
          </div>
          <div className="text-center pt-15">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={onSave}
            >
              Discard
            </button>
            <button
              title="submit"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddGrade;
