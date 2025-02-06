import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuill } from "react-quilljs"; // Import react-quilljs
import "quill/dist/quill.snow.css"; // Import the styles
import { z } from "zod";
import axiosInstance from "../../../../../axiosConfig";
const baseUrl = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultLogo from "../../../../../src/img/logo.png";
import useHelpers from "../../../../hooks/useHelpers";

interface DetailsInterface {
  name: string;
  short_name: string;
  address: string;
  contact: string;
  email: string;
  latitude: string;
  longitude: string;
  website: string;
  short_desc: string;
  long_desc: string;
  logo: FileList | File | string | null;
  cover: FileList | File | string | null;
}

const schema = z.object({
  name: z.string().min(5, "Institute name must be at least 5 characters long"),
  short_name: z.string().min(1, "Short name is required"),
  email: z.string().email("Invalid email address").optional(),
  address: z.string().min(3, "Institute address is required"),
  contact: z.string().min(3, "Institute contact number is required"),
  website: z.string().url("Invalid website URL").optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  short_desc: z.string().min(1, "Short Description is required"),
  long_desc: z.string().min(1, "Long Description is required"),
  logo: z.string().min(1, "Logo is required"),
  cover: z.string().min(1, "Cover is required"),
});

const Details = () => {
  const [loading, setLoading] = useState(false);
  const [previewLogoBackend, setPreviewLogoBackend] = useState<string>(""); // Set to default logo URL from Api
  const [previewCoverBackend, setPreviewCoverBackend] = useState<string>(""); // Set to default cover URL from Api
  const [previewLogo, setPreviewLogo] = useState<string>(""); // Set to default logo URL
  const [previewCover, setPreviewCover] = useState<string>(""); // Set to default cover URL
  const [instituteDetails, setInstituteDetails] =
    useState<null | DetailsInterface>(null);
  const { convertFileToBase64 } = useHelpers();
  const { quill: quill1, quillRef: quillRef1 } = useQuill();
  const { quill: quill2, quillRef: quillRef2 } = useQuill();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DetailsInterface>({
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
      logo: "",
      cover: "",
    },
  });

  //Get institute details from api
  useEffect(() => {
    const getInstituteDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseUrl}/general/institute`
        );
        const details = response.data.data;
        setInstituteDetails(details);
        reset({
          name: details?.name || "",
          short_name: details?.short_name || "",
          latitude: details?.latitude || "",
          longitude: details?.longitude || "",
          address: details?.address || "",
          contact: details?.contact || "",
          email: details?.email || "",
          short_desc: details?.short_desc || "",
          long_desc: details?.long_desc || "",
          logo: details?.logo || "",
          cover: details?.cover || "",
        });
        setPreviewLogoBackend(
          typeof details?.logo === "string" ? details.logo : ""
        );
        setPreviewCoverBackend(
          typeof details?.cover === "string" ? details.cover : ""
        );
      } catch (error) {
        console.error("Error fetching Institute Details:", error);
      }
    };

    getInstituteDetails();
  }, []);

  console.log("instituteDetails", instituteDetails);

  //Set the inputs of quill text editor in hook-form state
  useEffect(() => {
    if (quill1) {
      quill1.on("text-change", () => {
        setValue("short_desc", quill1.root.innerHTML);
      });
    }
  }, [quill1]);

  useEffect(() => {
    if (quill2) {
      quill2.on("text-change", () => {
        setValue("long_desc", quill2.root.innerHTML);
      });
    }
  }, [quill2]);

  //View short_desc and long_desc from api in text_editor field
  useEffect(() => {
    console.log("quill oneeeee", quill1);
    quill1?.clipboard.dangerouslyPasteHTML(instituteDetails?.short_desc || "");
    quill2?.clipboard.dangerouslyPasteHTML(instituteDetails?.long_desc || "");
  }, [instituteDetails]);

  //Watching to convert Image file to it's respectiive url To Preview and setValue
  const watchLogo = watch("logo");
  async function uploadLogo() {
    if (watchLogo instanceof FileList && watchLogo[0]) {
      const file = watchLogo[0];
      try {
        const logoBase64 = await convertFileToBase64(file);
        setPreviewLogo(logoBase64);
        setValue("logo", logoBase64);
      } catch (error) {
        console.log("Error uploading logo", error);
      }
    }
  }

  const watchCover = watch("cover");
  async function uploadCover() {
    if (watchCover instanceof FileList && watchCover[0]) {
      const file = watchCover[0];
      try {
        const coverBase64 = await convertFileToBase64(file);
        setPreviewCover(coverBase64);
        setValue("cover", coverBase64);
        console.log("inside");
      } catch (error) {
        console.log("Error uploading cover", error);
      }
    }
  }

  useEffect(() => {
    uploadLogo();
  }, [watchLogo]);

  useEffect(() => {
    uploadCover();
  }, [watchCover]);

  const handleCancelLogo = () => {
    setPreviewLogo(""); // Reset to default logo
    setPreviewLogoBackend("");
    setValue("logo", "");
    console.log("logo cancelled");
  };

  const handleCancelCover = () => {
    setPreviewCover("");
    setPreviewCoverBackend("");
    setValue("cover", "");
    console.log("cover cancelled");
  };

  const onSubmit = async (data: any) => {
    console.log("raw data", data);

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/general/institute/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Institute Details submitted successfully");
      console.log("Response from Details:", response.data.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div
            className="d-flex flex-wrap flex-sm-nowrap mb-3 align-items-center border border-rounded"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundImage: `url(${previewCoverBackend})`,
            }}
          >
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img
                  src={previewLogoBackend ? previewLogoBackend : defaultLogo}
                  alt="Institute Logo"
                />
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
                className="nav-link text-active-primary ms-0 me-10 py-1 active"
                href=""
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
                        backgroundImage: `url(${
                          previewLogo ? previewLogo : previewLogoBackend
                        })`,
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
                        backgroundImage: `url(${
                          previewCover ? previewCover : previewCoverBackend
                        })`,
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
                    {...register("contact")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Contact Number"
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
                  ></input>
                  {
                    <div className="fv-plugins-message-container mt-2 text-danger">
                      {errors.longitude?.message}
                    </div>
                  }
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Short Description
                </label>
                <div className="col-lg-8 fv-row">
                  <Controller
                    name="short_desc"
                    control={control}
                    render={({ field }) => (
                      <div
                        {...field}
                        ref={quillRef1}
                        style={{
                          height: "8rem",
                        }}
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

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Long Description
                </label>
                <div className="col-lg-8 fv-row text-editor">
                  <Controller
                    name="long_desc"
                    control={control}
                    render={({ field }) => (
                      <div
                        {...field}
                        ref={quillRef2}
                        style={{
                          height: "12rem",
                        }}
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
                    disabled={loading}
                  >
                    {loading ? "............" : "Save Changes"}
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
