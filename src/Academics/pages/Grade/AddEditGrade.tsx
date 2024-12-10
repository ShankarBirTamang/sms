import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useAcademicSession from "../../hooks/useAcademicSession";
import CustomSelect, {
  Option,
} from "../../../components/CustomSelect/CustomSelect";
import useGradeGroup from "../../hooks/useGradeGroup";
import SectionComponent from "./SectionComponent";
import {
  AddGradeInterface,
  SectionData,
  UpdateGradeInterface,
} from "../../services/gradeService";
import useGrade from "../../hooks/useGrade";
import EditSectionComponent, {
  EditSectionDataInterface,
} from "./EditSectionComponent";

interface AddEditGradeProps {
  onSave: () => void;
  editData: AddGradeInterface;
  formType: "create" | "edit";
}
const AddEditGrade = ({ onSave, editData, formType }: AddEditGradeProps) => {
  const { academicSessions } = useAcademicSession({});
  const { gradeGroups } = useGradeGroup({});
  const { saveGrade } = useGrade({});
  const [formMode, setFormMode] = useState<"create" | "edit">(formType);

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
  const [selectedAcademicLevel, setSelectedAcademicLevel] =
    useState<Option | null>(null);
  const [selectedGradeGroup, setSelectedGradeGroup] = useState<Option | null>(
    null
  );

  const FacultySectionSchema = z.object({
    facultyId: z.number().int({ message: "Faculty ID must be an integer" }),
    sections: z.array(
      z.string().min(1, { message: "Section name cannot be empty" })
    ),
  });
  // const EditSectionSchema = z.object({
  //   id: z.number(),
  //   name: z.string(),
  // });

  // const EditFacultySectionSchema = z.object({
  //   facultyId: z.number().int({ message: "Faculty ID must be an integer" }),
  //   sections: z.array(EditSectionSchema),
  // });

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
    if (formType === "edit" && editData) {
      setValue("academic_session_id", 1);
      setValue("grade_group_id", editData.grade_group_id);
      setValue("name", editData.name);
      setValue("short_name", editData.short_name);

      const academicSession = academicSessions.find(
        (session) => session.id === 1
      );
      const gradeGroup = gradeGroups.find(
        (group) => group.id === editData.grade_group_id
      );

      setSelectedAcademicLevel(
        academicSession
          ? { value: academicSession.id, label: academicSession.name }
          : null
      );
      setSelectedGradeGroup(
        gradeGroup ? { value: gradeGroup.id, label: gradeGroup.name } : null
      );
      setFormMode("edit");
    }
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [editData, formType, academicSessions, gradeGroups, setValue]);

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
      setValue("sections", data.sections);
      setValue("facultySections", data.facultySections);
    }
  };

  // const handleEditSectionDataChange = (
  //   data: EditSectionDataInterface,
  //   isValid: boolean
  // ) => {
  //   if (isValid) {
  //     setValue("section_type", data.sectionType);
  //     setValue("has_faculties", data.hasFaculties);
  //   }
  // };
  const onSubmit = async (data: FormData) => {
    setisSubmitting(true);

    try {
      if (formMode === "create") {
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
      } else if (formMode === "edit") {
        console.log(data);
      }
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
          {formType === "create" && (
            <SectionComponent onSectionDataChange={handleSectionDataChange} />
          )}
          {/* {formType === "edit" && (
            // <EditSectionComponent
            //   editData={editData}
            //   onSectionDataChange={handleEditSectionDataChange}
            // />
          )} */}
        </div>
        <div className="text-center pt-15">
          <button type="button" className="btn btn-light me-3" onClick={onSave}>
            Discard
          </button>
          <button
            title="submit"
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : formMode === "create"
              ? "Submit"
              : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditGrade;
