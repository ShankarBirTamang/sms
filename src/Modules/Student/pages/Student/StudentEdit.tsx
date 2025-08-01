import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import AddressSelector from "../../../../components/AddressSelector/AddressSelector";
import ImagePicker from "../../../../assets/ImagePicker/ImagePicker";
import {
  EditStudentInterface,
  StudentInterface,
} from "../../services/studentService";
import useStudent from "../../hooks/useStudent";
import ToastWithLink from "../../../../components/ToastWithLink/ToastWithLink";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../../../components/Loading/Loading";
import useHelpers from "../../../../hooks/useHelpers";

const StudentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  iemis: z.string().optional(),
  nickname: z.string().optional(),
  dob_en: z.string().optional(),
  dob_np: z.string().optional(),
  email: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) =>
        value === null || value === "" || /.+@.+\..+/.test(value ?? ""),
      { message: "Invalid email address" }
    ),
  photo: z.any().optional(), // Assuming photo is a file input
  permanentAddress: z.object({
    countryId: z.number().optional(),
    provinceId: z.number().optional(),
    districtId: z.number().optional(),
    municipalityId: z.number().optional(),
    ward: z.string().optional(),
    street: z.string().optional(),
  }),
  currentAddress: z.object({
    countryId: z.number().optional(),
    provinceId: z.number().optional(),
    districtId: z.number().optional(),
    municipalityId: z.number().optional(),
    ward: z.string().optional(),
    street: z.string().optional(),
  }),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  ethnicity: z.string().optional(),
  motherTongue: z.string().optional(),
  contact: z.string().optional(),
  religion: z.string().optional(),
});
type FormData = z.infer<typeof StudentSchema>;

const StudentEdit = () => {
  const [renderKey, setRenderKey] = useState("");
  const [student, setStudent] = useState<StudentInterface>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastStudent, setLastStudent] = useState<StudentInterface>();
  const { getSingleStudent, updateStudent, isLoading } = useStudent({});
  const { convertFileToBase64 } = useHelpers();
  const { studentId } = useParams<{ studentId: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(StudentSchema),
  });

  const fetchStudent = useCallback(async () => {
    try {
      const data = await getSingleStudent(Number(studentId));
      setStudent(data.data);
    } catch {
      toast.error("Error fetching student");
    }
  }, [getSingleStudent, studentId]);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [fetchStudent, studentId]);

  const handleCurrentAddressValuesChange = (selectedValues: {
    country: number | null;
    province: number | null;
    district: number | null;
    municipality: number | null;
    ward: string | null;
  }) => {
    setValue("currentAddress.countryId", selectedValues.country || 0);
    setValue("currentAddress.provinceId", selectedValues.province || 0);
    setValue("currentAddress.districtId", selectedValues.district || 0);
    setValue("currentAddress.municipalityId", selectedValues.municipality || 0);
    setValue("currentAddress.ward", selectedValues.ward || "");
  };

  const handlePermanentAddressValuesChange = (selectedValues: {
    country: number | null;
    province: number | null;
    district: number | null;
    municipality: number | null;
    ward: string | null;
  }) => {
    setValue("permanentAddress.countryId", selectedValues.country || 0);
    setValue("permanentAddress.provinceId", selectedValues.province || 0);
    setValue("permanentAddress.districtId", selectedValues.district || 0);
    setValue(
      "permanentAddress.municipalityId",
      selectedValues.municipality || 0
    );
    setValue("permanentAddress.ward", selectedValues.ward || "");
  };

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
  ) => {
    setValue("dob_en", dates.adDate);
    setValue("dob_np", dates.bsDate);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    const base64File = await convertFileToBase64(data.photo);
    const saveData: EditStudentInterface = {
      id: student!.id,
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      nickname: data.nickname,
      iemis: data.iemis,
      dob_en: data.dob_en,
      don_np: data.dob_np,
      contact: data.contact,
      email: data.email ?? undefined,
      gender: data.gender,
      blood_group: data.bloodGroup,
      nationality: data.nationality,
      mother_tongue: data.motherTongue,
      religion: data.religion,
      ethnicity: data.ethnicity,
      permanent_country_id: data.permanentAddress.countryId,
      permanent_province_id: data.permanentAddress.provinceId,
      permanent_district_id: data.permanentAddress.districtId,
      permanent_municipality_id: data.permanentAddress.municipalityId,
      permanent_ward_no: data.permanentAddress.ward,
      permanent_street_address: data.permanentAddress.street,
      current_country_id: data.currentAddress.countryId,
      current_province_id: data.currentAddress.provinceId,
      current_district_id: data.currentAddress.districtId,
      current_municipality_id: data.currentAddress.municipalityId,
      current_ward_no: data.currentAddress.ward,
      current_street_address: data.currentAddress.street,
    };

    const lastStudent: StudentInterface = await updateStudent({
      ...saveData,
      photo: base64File,
    });
    setIsSubmitting(false);
    setIsSuccess(true);
    setLastStudent(lastStudent);
  };

  useEffect(() => {
    console.log("main", errors);
  }, [errors]);

  return (
    <>
      {!student && (
        <div className="card">
          <div className="card-body">
            <Loading />
          </div>
        </div>
      )}
      {student && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-5">
              <div className="card mb-5">
                <div className="card-header pt-6">
                  <h1>
                    <strong>Basic Details</strong>
                  </h1>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-4">
                          <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              {...register("firstName")}
                              className={`form-control ${
                                errors.firstName && "is-invalid"
                              } form-control mb-3 mb-lg-0`}
                              placeholder="First Name"
                              defaultValue={student.first_name}
                            />
                            {errors.firstName && (
                              <span className="text-danger">
                                {errors.firstName.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="fv-row mb-7">
                            <label className="fw-bold fs-6 mb-2">
                              Middle Name
                            </label>
                            <input
                              type="text"
                              {...register("middleName")}
                              className={`form-control ${
                                errors.middleName && "is-invalid"
                              } form-control mb-3 mb-lg-0`}
                              placeholder="Middle name"
                              defaultValue={student.middle_name}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              {...register("lastName")}
                              className={`form-control ${
                                errors.lastName && "is-invalid"
                              } form-control mb-3 mb-lg-0`}
                              placeholder="Last Name"
                              defaultValue={student.last_name}
                            />
                            {errors.lastName && (
                              <span className="text-danger">
                                {errors.lastName.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "SUBMIT"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="card">
                <div className="card-header pt-6">
                  <h1>
                    <strong>Additional Details (Can be Filled later)</strong>
                  </h1>
                </div>
                <div className="card-body pt-4">
                  <div className="row">
                    <div className="col-8">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2">
                              IEMIS-No.
                            </label>
                            <input
                              type="text"
                              {...register("iemis")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
                              defaultValue={student.iemis}
                            />
                            {errors.iemis && (
                              <span className="text-danger">
                                {errors.iemis.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="fv-row mb-7">
                            <label className="fw-bold fs-6 mb-2">
                              Nickname
                            </label>
                            <input
                              type="text"
                              {...register("nickname")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
                              defaultValue={student.nickname}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-7">
                          <DatePicker
                            key={renderKey}
                            onDateChange={(date) =>
                              handleDateChange(date, "startDate")
                            }
                            title="Date of Birth"
                            errorAD={errors.dob_en?.message}
                            errorBS={errors.dob_np?.message}
                            valueAD={student.dob_en ?? undefined}
                            valueBS={student.dob_np ?? undefined}
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="fv-row mb-7">
                            <label
                              className="required fw-bold fs-6 mb-2"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              {...register("email")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
                              defaultValue={student.email}
                            />
                            {errors.email && (
                              <span className="text-danger">
                                {errors.email.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2">
                              Contact
                            </label>
                            <input
                              type="text"
                              {...register("contact")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
                              defaultValue={student.contact}
                            />
                            {errors.contact && (
                              <span className="text-danger">
                                {errors.contact.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 text-center">
                      <div className="fv-row mb-1">
                        <label className="required fw-bold fs-6 mb-2">
                          Photo
                        </label>
                      </div>

                      <Controller
                        name="photo"
                        control={control}
                        render={({ field, fieldState }) => (
                          <ImagePicker
                            onChange={(file) => field.onChange(file)}
                            value={field.value ?? student.photo}
                            errors={fieldState.error}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-12">
                              <label className="fw-bold fs-6 mb-1">
                                Permanent <br /> Address
                              </label>
                              <hr className="my-2" />
                              <AddressSelector
                                colSize={6}
                                onChange={handlePermanentAddressValuesChange}
                                errors={errors.permanentAddress}
                                value={{
                                  country:
                                    student.permanent_address?.country_id,
                                  province:
                                    student.permanent_address?.province_id,
                                  district:
                                    student.permanent_address?.district_id,
                                  municipality:
                                    student.permanent_address?.municipality_id,
                                  ward: student.permanent_address?.ward_no,
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <div className="fv-row mb-7">
                                <label
                                  className="required fw-bold fs-6 mb-2"
                                  htmlFor="address"
                                >
                                  Permanent Street
                                </label>
                                <input
                                  id="address"
                                  type="text"
                                  {...register("permanentAddress.street")}
                                  className="form-control mb-3 mb-lg-0"
                                  placeholder=""
                                  defaultValue={
                                    student.permanent_address?.street_address
                                  }
                                />
                                {errors.permanentAddress?.street && (
                                  <span className="text-danger">
                                    {errors.permanentAddress.street.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <label className="fw-bold fs-6 mb-1">
                                  Current <br /> Address
                                </label>
                                <div className="">
                                  <label className="form-check form-switch form-switch-sm form-check-custom flex-stack">
                                    <span className="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                      Same as Permanent Address
                                    </span>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value="1"
                                    />
                                  </label>
                                </div>
                              </div>
                              <hr className="my-2" />
                              <AddressSelector
                                colSize={6}
                                onChange={handleCurrentAddressValuesChange}
                                errors={errors.currentAddress}
                                value={{
                                  country: student.current_address?.country_id,
                                  province:
                                    student.current_address?.province_id,
                                  district:
                                    student.current_address?.district_id,
                                  municipality:
                                    student.current_address?.municipality_id,
                                  ward: student.current_address?.ward_no,
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <div className="fv-row mb-7">
                                <label
                                  className="required fw-bold fs-6 mb-2"
                                  htmlFor="address"
                                >
                                  Current Street
                                </label>
                                <input
                                  id="address"
                                  type="text"
                                  {...register("currentAddress.street")}
                                  className="form-control mb-3 mb-lg-0"
                                  placeholder=""
                                  defaultValue={
                                    student.current_address?.street_address
                                  }
                                />
                                {errors.currentAddress?.street && (
                                  <span className="text-danger">
                                    {errors.currentAddress.street.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label
                          className="required fw-bold fs-6 mb-2"
                          htmlFor="gender"
                        >
                          Gender
                        </label>

                        <select
                          id="gender"
                          {...register("gender")}
                          className="form-control"
                          defaultValue={student.gender ?? ""}
                        >
                          <option value="" hidden disabled>
                            Select Gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors.gender && (
                          <span className="text-danger">
                            {errors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Blood Group
                        </label>

                        <select
                          id="bloodGroup"
                          {...register("bloodGroup")}
                          className="form-control"
                          defaultValue={student.blood_group ?? ""}
                        >
                          <option value="" hidden disabled>
                            Select Blood Group
                          </option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && (
                          <span className="text-danger">
                            {errors.bloodGroup.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Nationality
                        </label>
                        <input
                          type="text"
                          {...register("nationality")}
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                          defaultValue={student.nationality ?? ""}
                        />
                        {errors.nationality && (
                          <span className="text-danger">
                            {errors.nationality.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Ethnicity
                        </label>
                        <select
                          id="ethnicity"
                          {...register("ethnicity")}
                          className="form-control"
                          defaultValue={student.ethnicity ?? ""}
                        >
                          <option value="" hidden disabled>
                            Select Ethnicity
                          </option>
                          <option value="Dalit">Dalit</option>
                          <option value="Janajati">Janajati</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors.ethnicity && (
                          <span className="text-danger">
                            {errors.ethnicity.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Mother Tongue
                        </label>
                        <input
                          type="text"
                          {...register("motherTongue")}
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                          defaultValue={student.mother_tongue ?? ""}
                        />
                        {errors.motherTongue && (
                          <span className="text-danger">
                            {errors.motherTongue.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Religion
                        </label>
                        <input
                          type="text"
                          {...register("religion")}
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                          defaultValue={student.religion ?? ""}
                        />
                        {errors.religion && (
                          <span className="text-danger">
                            {errors.religion.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "SUBMIT"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!isSubmitting && isSuccess && lastStudent && (
            <ToastWithLink
              message="Student Updated Successfully. Visit Profile of:"
              linkText={lastStudent.full_name ?? "Student"}
              linkUrl={`/students/details/${lastStudent.id}/overview`}
            />
          )}
        </form>
      )}
    </>
  );
};

export default StudentEdit;
