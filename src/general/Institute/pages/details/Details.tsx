import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../../../../axiosConfig";
const baseUrl = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultLogo from "../../../../../src/img/logo.png";

interface FormData {
  email: string;
  name: string;
  short_name: string;
  latitude: string;
  longitude: string;
  address: string;
  contact: string;
  website: string;
  short_desc: string;
  long_desc: string;
  logo: FileList | null;
  cover: FileList | null;
}

const Details = () => {
  const [backendLogo, setBackendLogo] = useState<string>(defaultLogo); // State for backend logo URL
  const [previewLogo, setPreviewLogo] = useState<string>(""); // Set to default logo URL
  const [previewCover, setPreviewCover] = useState<string>(""); // Set to default cover URL
  const [instituteDetails, setInstituteDetails] = useState<null | FormData>(
    null
  );

  const schema = z.object({
    name: z
      .string()
      .min(5, "Institute name must be at least 5 characters long"),
    short_name: z.string().min(1, "Short name is required"),
    email: z.string().email("Invalid email address").optional(),
    address: z.string().min(3, "Institute address is required"),
    contact: z.string().min(3, "Institute contact number is required"),
    website: z.string().url("Invalid website URL").optional(),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
    short_desc: z.string().optional(),
    long_desc: z.string().optional(),
    logo: z.instanceof(FileList).nullable().optional(),
    cover: z.instanceof(FileList).nullable().optional(),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      short_name: "",
      latitude: "",
      longitude: "",
      address: "",
      contact: "",
      email: "",
      short_desc: "",
      long_desc: "",
    },
  });

  const getInstituteDetails = async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/general/institute`);
      const details = response.data.data;
      setInstituteDetails(details);

      if (details.logo) {
        setPreviewLogo(details.logo);
        setBackendLogo(details.logo);
      } else {
        setBackendLogo(""); // Reset to empty if no logo
      }

      if (details.cover) {
        setPreviewCover(details.cover); // Set cover URL from details
      } else {
        setPreviewCover(""); // Reset to empty if no cover
      }
    } catch (error) {
      console.error("Error fetching Institute Details:", error);
    } finally {
      console.log(
        "Institute Details from getInstitute state",
        instituteDetails
      );
    }
  };

  useEffect(() => {
    getInstituteDetails();
  }, []);

  const watchLogo = watch("logo");
  useEffect(() => {
    console.log("watchlogo", watchLogo);
    if (watchLogo && watchLogo[0]) {
      const file = watchLogo[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewLogo(objectUrl);
    }
  }, [watchLogo]);

  const watchCover = watch("cover");
  useEffect(() => {
    console.log("watchcover", watchCover);

    if (watchCover && watchCover[0]) {
      const file = watchCover[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewCover(objectUrl);
    }
  }, [watchCover]);

  const handleCancelLogo = () => {
    setPreviewLogo(""); // Reset to default logo
    setValue("logo", null);
    console.log("logo cancelled");
  };

  const handleCancelCover = () => {
    setPreviewCover("");
    setValue("cover", null);
    console.log("cover cancelled");
  };

  const onSubmit = async (data: any) => {
    console.log("raw data", data);
    const formData = new FormData();

    // Append non-file fields to FormData
    for (const key in data) {
      if (key !== "logo" && key !== "cover") {
        formData.append(key, data[key]);
      }
    }

    // Handle logo file
    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]);
    }

    // Handle cover file
    if (data.cover && data.cover[0]) {
      formData.append("cover", data.cover[0]);
    }

    console.log("formdata entries", formData.entries);
    // Log all FormData key-value pairs

    try {
      const response = await axiosInstance.post(
        `${baseUrl}/general/institute/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Institute Details submitted successfully");
      console.log("Response from Details:", response.data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3 align-items-center">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img src={backendLogo ?? defaultLogo} alt="Institute Logo" />
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <Link
                      to={"/institute/pages"}
                      className="text-gray-900 text-hover-primary fs-2 fw-bold me-1"
                    >
                      {instituteDetails?.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
            <li className="nav-item mt-2">
              <a
                className="nav-link text-active-primary ms-0 me-10 py-5 active"
                href="https://sms.aanshtech.com/sms/settings/institute"
              >
                Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="card mb-5 mb-xl-10">
        <div className="card-header border-0 cursor-pointer">
          <div className="card-title m-0">
            <h3 className="fw-bold m-0">Profile Details</h3>
          </div>
        </div>
        <div>
          <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="_method" value="PUT" />
            <input
              type="hidden"
              name="_token"
              value="RpkUjQhYJdbS6ND1sCrK5xCXAttcZJ1wjhFpyslV"
            />
            <div className="card-body border-top p-9">
              {/* Logo Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Logo
                </label>
                <div className="col-lg-8">
                  <div
                    className="image-input image-input-outline"
                    style={{
                      backgroundImage:
                        "url(https://sms.aanshtech.com/main/media/svg/avatars/blank.svg)",
                      position: "relative",
                    }}
                  >
                    <div
                      className="image-input-wrapper w-125px h-125px"
                      style={{
                        backgroundImage: `url(${previewLogo})`,
                      }}
                    ></div>
                    <label
                      className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      aria-label="Change avatar"
                      style={{
                        position: "absolute",
                        top: "-5%",
                        right: "-7%",
                      }}
                    >
                      <i className="bi bi-pencil-fill fs-7"></i>
                      <input
                        id="logo"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: "none" }}
                        {...register("logo")}
                      />
                      <input type="hidden" name="avatar_remove" />
                    </label>
                    {previewLogo ? (
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        aria-label="Cancel avatar"
                        style={{
                          position: "absolute",
                          bottom: "-7%",
                          right: "-7%",
                        }}
                        title="Cancel"
                        onClick={handleCancelLogo}
                      >
                        <i className="bi bi-x fs-2"></i>
                      </span>
                    ) : null}
                  </div>
                  <div className="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                </div>
                {
                  <div className="fv-plugins-message-container mt-2 text-danger">
                    {errors.logo?.message}
                  </div>
                }
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Cover Image
                </label>
                <div className="col-lg-8">
                  <div
                    className="image-input image-input-outline"
                    style={{
                      backgroundImage:
                        "url(https://sms.aanshtech.com/main/media/svg/avatars/blank.svg)",
                      position: "relative",
                    }}
                  >
                    <div
                      className="image-input-wrapper w-125px h-125px"
                      style={{
                        backgroundImage: `url(${previewCover})`,
                      }}
                    ></div>
                    <label
                      className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      aria-label="Change avatar"
                      style={{
                        position: "absolute",
                        top: "-5%",
                        right: "-7%",
                      }}
                    >
                      <i className="bi bi-pencil-fill fs-7"></i>
                      <input
                        id="cover"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: "none" }}
                        {...register("cover")}
                      />
                      <input type="hidden" name="avatar_remove" />
                    </label>
                    {previewCover ? (
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        aria-label="Cancel avatar"
                        style={{
                          position: "absolute",
                          bottom: "-7%",
                          right: "-7%",
                        }}
                        title="Cancel"
                        onClick={handleCancelCover}
                      >
                        <i className="bi bi-x fs-2"></i>
                      </span>
                    ) : null}
                  </div>
                  <div className="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                </div>
                {
                  <div className="fv-plugins-message-container mt-2 text-danger">
                    {errors.cover?.message}
                  </div>
                }
              </div>

              {/* Name Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Institute Name
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    {...register("name")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Institute Name"
                    required
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.name?.message}
                    </div>
                  }
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Short Name
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    {...register("short_name")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Institute Short Name"
                    required
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.short_name?.message}
                    </div>
                  }
                </div>
              </div>

              {/* Contact Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Contact Number
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    {...register("contact", {
                      required: "Institute contact number is required",
                    })}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Contact Number"
                    required
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.contact?.message}
                    </div>
                  }
                </div>
              </div>

              {/* Email Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold required fs-6">
                  Email
                </label>
                <div className="col-lg-8">
                  <input
                    required
                    type="email"
                    {...register("email")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Email Address"
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.email?.message}
                    </div>
                  }
                </div>
              </div>

              {/* Address Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Address
                </label>
                <div className="col-lg-8">
                  <textarea
                    {...register("address")}
                    className="form-control form-control-lg form-control-solid"
                    rows={3}
                    placeholder="Enter Address"
                    required
                  ></textarea>
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.address?.message}
                    </div>
                  }
                </div>
              </div>

              {/* Latitude  */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Latitude
                </label>
                <div className="col-lg-8">
                  <input
                    {...register("latitude")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Latitude"
                    required
                  ></input>
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.latitude?.message}
                    </div>
                  }
                </div>
              </div>

              {/* longitude  */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Longitude
                </label>
                <div className="col-lg-8">
                  <input
                    {...register("longitude")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Longitude"
                    required
                  ></input>
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.longitude?.message}
                    </div>
                  }
                </div>
              </div>

              <div
                className="row mb-6"
                // style={{
                //   height: "12rem",
                // }}
              >
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Short Description
                </label>
                <div className="col-lg-8 fv-row">
                  <Controller
                    name="short_desc"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        placeholder="Input Short Description"
                        // style={{
                        //   height: "6rem",
                        // }}
                        value={field.value} // Pass value explicitly
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.short_desc?.message}
                    </div>
                  }
                </div>
              </div>

              <div
                className="row mb-6"
                // style={{
                //   height: "12rem",
                // }}
              >
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Long Description
                </label>
                <div className="col-lg-8 fv-row text-editor">
                  <Controller
                    name="long_desc"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        placeholder="Input Long Description"
                        // style={{
                        //   height: "6rem",
                        // }}
                        value={field.value} // Pass value explicitly
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.long_desc?.message}
                    </div>
                  }
                </div>
              </div>

              {/* Submit Button */}
              <div className="row mb-6">
                <div className="col-lg-8 offset-lg-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Details;
