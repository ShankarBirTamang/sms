import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AddStudentGuardianInterface,
  StudentGuardianInterface,
} from "../../../../services/studentService";
import ImagePicker from "../../../../../../assets/ImagePicker/ImagePicker";
import useStudent from "../../../../hooks/useStudent";
import useHelpers from "../../../../../../hooks/useHelpers";

const guardianSchema = z.object({
  name: z.string().min(1, "Guardian Name is required"),
  relation: z.string().min(1, "Relation with child is required"),
  type: z.enum(["parent", "guardian"], {
    errorMap: () => ({ message: "Guardian Type is required" }),
  }),
  contact: z
    .string()
    .regex(/^(\d{10})(,\d{10})*$/, "Invalid contact number format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  education: z.string().optional(),
  occupation: z.string().optional(),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof guardianSchema>;

interface AddGuardianProps {
  studentId: number;
  onSave: (guardian: StudentGuardianInterface) => void;
}

const AddGuardian = ({ studentId, onSave }: AddGuardianProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { convertFileToBase64 } = useHelpers();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(guardianSchema),
  });
  const { createGuardian } = useStudent({});

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const base64File = await convertFileToBase64(data.photo);
    const guardianData: AddStudentGuardianInterface = {
      ...data,
      student_id: studentId,
      photo: base64File,
    };

    const guardian = await createGuardian(guardianData);
    if (guardian) {
      onSave(guardian);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Guardian Name (AS per citizenship)
            </label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.name && "is-invalid"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Relation with Child
            </label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.relation && "is-invalid"
              }`}
              {...register("relation")}
            />
            {errors.relation && (
              <span className="text-danger">{errors.relation.message}</span>
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Guardian Type</label>
            <select
              className={`form-control mb-3 mb-lg-0 ${
                errors.type && "is-invalid"
              }`}
              {...register("type")}
              defaultValue={""}
            >
              <option value="" hidden>
                Select Guardian Type
              </option>
              <option value="parent">Parent</option>
              <option value="guardian">Local Guardian</option>
            </select>
            {errors.type && (
              <span className="text-danger">{errors.type.message}</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="fw-bold fs-6 mb-2">Email</label>
            <input
              type="email"
              className={`form-control mb-3 mb-lg-0 ${
                errors.email && "is-invalid"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Contact Number (Separate by comma)
            </label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.contact && "is-invalid"
              }`}
              {...register("contact")}
            />
            {errors.contact && (
              <span className="text-danger">{errors.contact.message}</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Address</label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.address && "is-invalid"
              }`}
              {...register("address")}
            />
            {errors.address && (
              <span className="text-danger">{errors.address.message}</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Education</label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.education && "is-invalid"
              }`}
              {...register("education")}
            />
            {errors.education && (
              <span className="text-danger">{errors.education.message}</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Occupation</label>
            <input
              type="text"
              className={`form-control mb-3 mb-lg-0 ${
                errors.occupation && "is-invalid"
              }`}
              {...register("occupation")}
            />
            {errors.occupation && (
              <span className="text-danger">{errors.occupation.message}</span>
            )}
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="fv-row mb-1">
            <label className="required fw-bold fs-6 mb-2">Photo</label>
          </div>

          <Controller
            name="photo"
            control={control}
            render={({ field, fieldState }) => (
              <ImagePicker
                onChange={(file) => field.onChange(file)}
                value={field.value}
                errors={fieldState.error}
              />
            )}
          />
        </div>
        <div className="col-12 text-end position-sticky bottom-0 bg-white pb-5">
          <hr />
          {/* <button className="btn btn-secondary" type="button">
            Cancel
          </button> */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddGuardian;
