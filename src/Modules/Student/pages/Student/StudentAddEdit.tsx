import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import SessionGradePicker from "../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";
import DatePicker from "../../../../components/DatePicker/DatePicker";

const StudentSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  academicSessionId: z.number(),
  gradeId: z.number(),
  sectionId: z.number(),
});
type FormData = z.infer<typeof StudentSchema>;

const StudentAddEdit = () => {
  const [renderKey, setRenderKey] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(StudentSchema),
  });

  const handleSelectedValuesChange = (selectedValues: {
    level: number | null;
    session: number | null;
    grade: number | null;
    section: number | null;
  }) => {
    if (selectedValues.session) {
      setValue("academicSessionId", selectedValues.session);
    }
    if (selectedValues.grade) {
      setValue("gradeId", selectedValues.grade);
    }
    if (selectedValues.section) {
      setValue("sectionId", selectedValues.section);
    }
    console.log("Selected Values:", selectedValues);
  };

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
  ) => {
    // setValue("dob", dates.adDate);
    // setValue("dob_np", dates.bsDate);
    // setStartValueAD(dates.adDate);
    // setStartValueBS(dates.bsDate);
  };
  return (
    <>
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
                          className="form-control mb-3 mb-lg-0"
                          placeholder="First Name"
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="fv-row mb-7">
                        <label className="fw-bold fs-6 mb-2">Middle Name</label>
                        <input
                          type="text"
                          {...register("middleName")}
                          className="form-control mb-3 mb-lg-0"
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
                          className="form-control mb-3 mb-lg-0"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 text-center">
                  <h3 className="fw-bolder text-uppercase">Admission Info</h3>
                  <hr />
                </div>
                <SessionGradePicker
                  onChange={handleSelectedValuesChange}
                  colSize={6}
                />
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-header pt-6">
              <h1>
                <strong>Additional Details</strong>
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
                          name="iemis"
                          value=""
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className=" fw-bold fs-6 mb-2">Nickname</label>
                        <input
                          type="text"
                          name="nickname"
                          value=""
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
                        // errorAD={
                        //   errors.dob ? errors.dob.message : ""
                        // }
                        // errorBS={
                        //   errors.start_date_np
                        //     ? errors.start_date_np.message
                        //     : ""
                        // }
                        // valueAD={startValueAD}
                        // valueBS={startValueBS}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label
                          className="required fw-bold fs-6 mb-2"
                          htmlFor="address"
                        >
                          Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          value=""
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                        />
                      </div>
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
                          name="email"
                          value=""
                          className="form-control mb-3 mb-lg-0"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">Photo</label>
                  </div>
                  <div
                    className="image-input image-input-outline"
                    data-kt-image-input="true"
                  >
                    <div className="image-input-wrapper w-175px h-175px"></div>
                    <label
                      className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="change"
                      data-bs-toggle="tooltip"
                      aria-label="Change avatar"
                      data-kt-initialized="1"
                    >
                      <i className="bi bi-pencil-fill fs-7"></i>
                      <input
                        type="file"
                        name="photo"
                        accept=".png, .jpg, .jpeg"
                      />
                      <input type="hidden" name="avatar_remove" />
                    </label>
                    <span
                      className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="cancel"
                      data-bs-toggle="tooltip"
                      aria-label="Cancel avatar"
                      data-kt-initialized="1"
                    >
                      <i className="bi bi-x fs-2"></i>
                    </span>
                    <span
                      className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="remove"
                      data-bs-toggle="tooltip"
                      aria-label="Remove avatar"
                      data-kt-initialized="1"
                    >
                      <i className="bi bi-x fs-2"></i>
                    </span>
                  </div>
                  <div className="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label
                      className="required fw-bold fs-6 mb-2"
                      htmlFor="gender"
                    >
                      Gender
                    </label>

                    <select name="gender" id="gender" className="form-control">
                      <option value="" hidden disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Blood Group
                    </label>

                    <select
                      name="blood_group"
                      id="blood_group"
                      className="form-control"
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value=""
                      className="form-control mb-3 mb-lg-0"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Ethnicity
                    </label>
                    <select
                      name="ethnicity"
                      id="ethnicity"
                      className="form-control"
                    >
                      <option value="" hidden disabled>
                        Select Ethnicity
                      </option>
                      <option value="Dalit">Dalit</option>
                      <option value="Janajati">Janajati</option>
                      <option value="Others" selected>
                        Others
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Mother Tongue
                    </label>
                    <input
                      type="text"
                      name="mother_tongue"
                      value=""
                      className="form-control mb-3 mb-lg-0"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value=""
                      className="form-control mb-3 mb-lg-0"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Religion
                    </label>
                    <input
                      type="text"
                      name="religion"
                      value=""
                      className="form-control mb-3 mb-lg-0"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAddEdit;
