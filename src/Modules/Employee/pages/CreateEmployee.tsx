import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import useHelpers from "../../../hooks/useHelpers";
import ToastWithLink from "../../../components/ToastWithLink/ToastWithLink";
import useEmployee from "../hooks/useEmployee";
import {
  AddEmployeeInterface,
  EmployeeInterface,
} from "../services/employeeService";
import DatePicker from "../../../components/DatePicker/DatePicker";
import ImagePicker from "../../../assets/ImagePicker/ImagePicker";
import AddressSelector from "../../../components/AddressSelector/AddressSelector";
import useEmployeeTypes from "../hooks/useEmployeeType";
import useRoles from "../../../General/hooks/useRoles";

const CreateEmployee = () => {
  const [renderKey, setRenderKey] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEmployee, setLastEmployee] = useState<EmployeeInterface>();
  const [allowLogin, setAllowLogin] = useState(false);
  const { convertFileToBase64 } = useHelpers();
  const { saveEmployee } = useEmployee({});
  const { employeeTypes } = useEmployeeTypes({});
  const { roles } = useRoles({});
  const employeeTypeValues = employeeTypes.map((type) => type.id.toString());
  const roleValues = roles.map((role) => role.name.toString());

  const EmployeeSchema = z
    .object({
      firstName: z.string().min(1, "First Name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Last Name is required"),
      type: z.enum(employeeTypeValues as [string, ...string[]], {
        message: "Employee Type is Required",
      }),
      email: z.string().optional(),
      password: z.string().optional(),
      role: z
        .enum(roleValues as [string, ...string[]], { message: "Required" })
        .optional()
        .nullable(),
      allowLogin: z.boolean().default(false),
      nickname: z.string().optional(),
      dob_en: z.string().optional(),
      dob_np: z.string().optional(),
      photo: z.any().optional(),
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
    })
    .superRefine((data, ctx) => {
      if (data.allowLogin) {
        if (!data.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required",
            path: ["email"],
          });
        }
        if (!data.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password is required",
            path: ["password"],
          });
        }
        if (!data.role) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Role is Required",
            path: ["role"],
          });
        }
      }
    });
  type FormData = z.infer<typeof EmployeeSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(EmployeeSchema),
  });

  const handleAllowLoginChange = (value: boolean) => {
    setAllowLogin(value);
    setValue("allowLogin", value);

    if (!value) {
      // Reset role, email, and password fields
      setValue("role", null);
      setValue("email", "");
      setValue("password", "");
      // Clear validation errors
      clearErrors(["email", "password", "role"]);
    }
  };
  const watchAllowLogin = watch("allowLogin"); // Watch for changes

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
    setValue("currentAddress.ward", selectedValues.ward || undefined);
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
    setValue("permanentAddress.ward", selectedValues.ward || undefined);
  };

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
  ) => {
    console.log(dates);

    setValue("dob_en", dates.adDate);
    setValue("dob_np", dates.bsDate);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    const base64File = await convertFileToBase64(data.photo);
    const saveData: AddEmployeeInterface = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      type: data.type,
      allowLogin: data.allowLogin,
      email: data.email,
      password: data.password,
      role: data.role ?? undefined,
      nickname: data.nickname,
      dob_en: data.dob_en,
      don_np: data.dob_np,
      contact: data.contact,
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
    const lastEmployee: EmployeeInterface = await saveEmployee({
      ...saveData,
      photo: base64File,
    });
    setIsSubmitting(false);
    setIsSuccess(true);
    console.log("Last Employee", lastEmployee);

    setLastEmployee(lastEmployee);
    console.log("Form Data Submitted:", JSON.stringify(saveData, null, 2));
  };

  useEffect(() => {
    if (!watchAllowLogin) {
      clearErrors(["email", "password", "role"]); // Clear specific errors
    }
    console.log(watchAllowLogin);
  }, [clearErrors, watchAllowLogin]);

  useEffect(() => {
    console.log("main", errors);
  }, [errors]);

  return (
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
                        <label className="fw-bold fs-6 mb-2">Middle Name</label>
                        <input
                          type="text"
                          {...register("middleName")}
                          className={`form-control ${
                            errors.middleName && "is-invalid"
                          } form-control mb-3 mb-lg-0`}
                          placeholder="Middle name"
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
                        />
                        {errors.lastName && (
                          <span className="text-danger">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="fv-row mb-7">
                        <label
                          className="required fw-bold fs-6 mb-2"
                          htmlFor="type"
                        >
                          Employee Type
                        </label>

                        <select
                          id="type"
                          {...register("type")}
                          className={`form-control ${
                            errors.type && "is-invalid"
                          } form-control mb-3 mb-lg-0`}
                          defaultValue={""}
                        >
                          <option value="" hidden disabled>
                            Select Emp. Type
                          </option>
                          {employeeTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        {errors.type && (
                          <span className="text-danger">
                            {errors.type.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <hr />
                      <div className="row">
                        <div className="col-12 mb-5">
                          <label className="form-check form-switch form-switch-sm form-check-custom">
                            <input
                              className="form-check-input me-4"
                              type="checkbox"
                              onChange={(e) =>
                                handleAllowLoginChange(e.target.checked)
                              }
                            />
                            <span className="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">
                              Allow user to login?
                            </span>
                          </label>
                        </div>
                        {allowLogin && (
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12 text-center">
                                <h3 className="fw-bolder text-uppercase">
                                  Login INfo
                                </h3>
                                <hr />
                              </div>
                              <div className="col-5">
                                <div className="fv-row mb-7">
                                  <label className="required fw-bold fs-6 mb-2">
                                    Email
                                  </label>
                                  <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="email"
                                        className={`form-control ${
                                          errors.email && "is-invalid"
                                        } form-control mb-3 mb-lg-0`}
                                        placeholder="Ex: admin@email.com"
                                      />
                                    )}
                                  />
                                  {errors.email && (
                                    <span className="text-danger">
                                      {errors.email.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-5">
                                <div className="fv-row mb-7">
                                  <label className="required fw-bold fs-6 mb-2">
                                    Password
                                  </label>
                                  <input
                                    type="text"
                                    {...register("password")}
                                    className={`form-control ${
                                      errors.password && "is-invalid"
                                    } form-control mb-3 mb-lg-0`}
                                  />
                                  {errors.password && (
                                    <span className="text-danger">
                                      {errors.password.message}
                                    </span>
                                  )}
                                </div>
                              </div>{" "}
                              <div className="col-md-2">
                                <div className="fv-row mb-7">
                                  <label
                                    className="required fw-bold fs-6 mb-2"
                                    htmlFor="role"
                                  >
                                    Role
                                  </label>

                                  <select
                                    id="role"
                                    {...register("role")}
                                    className={`form-control ${
                                      errors.role && "is-invalid"
                                    } form-control mb-3 mb-lg-0`}
                                    defaultValue={""}
                                  >
                                    <option value="" hidden disabled>
                                      Sel. Role
                                    </option>
                                    {roles
                                      .filter((role) => {
                                        return role.name !== "Super Admin";
                                      })
                                      .map((role) => (
                                        <option key={role.id} value={role.name}>
                                          {role.name}
                                        </option>
                                      ))}
                                  </select>
                                  {errors.role && (
                                    <span className="text-danger">
                                      {errors.role.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
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
                        <label className="fw-bold fs-6 mb-2">Nickname</label>
                        <input
                          type="text"
                          {...register("nickname")}
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
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
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Email
                        </label>
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              type="email"
                              className={`form-control ${
                                errors.email && "is-invalid"
                              } form-control mb-3 mb-lg-0`}
                              placeholder="Ex: admin@email.com"
                            />
                          )}
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
                            idPrefix="permanent"
                            colSize={6}
                            onChange={handlePermanentAddressValuesChange}
                            errors={errors.permanentAddress}
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
                              id="perm_address"
                              type="text"
                              {...register("permanentAddress.street")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
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
                            idPrefix="current"
                            colSize={6}
                            onChange={handleCurrentAddressValuesChange}
                            errors={errors.currentAddress}
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
                              id="curr_address"
                              type="text"
                              {...register("currentAddress.street")}
                              className="form-control mb-3 mb-lg-0"
                              placeholder=""
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
                      defaultValue={""}
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
                      defaultValue={""}
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
                      defaultValue={""}
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
      {!isSubmitting && isSuccess && lastEmployee && (
        <ToastWithLink
          message="Employee Added Successfully. Visit Profile of:"
          linkText={lastEmployee.full_name ?? "Employee"}
          linkUrl={`/employees/details/${lastEmployee.id}/overview`}
        />
      )}
    </form>
  );
};

export default CreateEmployee;
