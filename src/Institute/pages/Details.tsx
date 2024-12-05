import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import InputField from "../components/InputField";

interface FormData {
  email: string;
  name: string;
  address: string;
  contact: string;
  website: string;
  shortDesc: string;
  longDesc: string;
  logo: File | null;
  cover: File | null;
}

const Details = () => {
  const [logo, setLogo] = useState<string | null>(
    "https://sms.aanshtech.com/storage/1/PUBLIC-LOGO.nO.bACKGROUND.webp"
  );
  const [cover, setCover] = useState<string | null>(
    "https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  );
  const [isLogoSelected, setIsLogoSelected] = useState(false);
  const [isCoverSelected, setIsCoverSelected] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      address: "",
      contact: "",
      email: "",
      website: "",
      shortDesc: "",
      longDesc: "",
    },
  });

  useEffect(() => {
    return () => {
      if (logo) {
        URL.revokeObjectURL(logo);
      }
      if (cover) {
        URL.revokeObjectURL(cover);
      }
    };
  }, [logo, cover]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "cover"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (field === "logo") {
        setLogo(imageUrl);
        setValue("logo", file); // Set the file in react-hook-form
        setIsLogoSelected(true);
      } else if (field === "cover") {
        setCover(imageUrl);
        setValue("cover", file); // Set the file in react-hook-form
        setIsCoverSelected(true);
      }
    }
  };

  const handleCancelLogo = () => {
    setLogo(
      "https://sms.aanshtech.com/storage/1/PUBLIC-LOGO.nO.bACKGROUND.webp"
    );
    setIsLogoSelected(false);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setIsLogoSelected(false);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCover(imageUrl);
      setIsCoverSelected(true);
    }
  };

  const handleCancelCover = () => {
    setCover(
      "https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    );
    setIsCoverSelected(false);
  };

  const handleRemoveCover = () => {
    setCover(null);
    setIsCoverSelected(false);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();

    // Append text fields
    for (const key in data) {
      if (key !== "logo" && key !== "cover") {
        formData.append(key, data[key]);
      }
    }

    // Append file inputs if selected
    if (data.logo) {
      formData.append("logo", data.logo);
    }
    if (data.cover) {
      formData.append("cover", data.cover);
    }

    // Log all FormData key-value pairs
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3 align-items-center">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img
                  src="https://sms.aanshtech.com/storage/1/PUBLIC-LOGO.nO.bACKGROUND.webp"
                  alt="Institute Logo"
                />
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-900 text-hover-primary fs-2 fw-bold me-1"
                    >
                      Shree Public High School (S.P.H.S)
                    </a>
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
                        backgroundImage: logo ? `url(${logo})` : "none",
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
                        onChange={(event) => handleFileChange(event, "logo")}
                      />
                      <input type="hidden" name="avatar_remove" />
                    </label>
                    {logo && isLogoSelected ? (
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
                    ) : logo ? (
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        aria-label="Remove avatar"
                        style={{
                          position: "absolute",
                          bottom: "-7%",
                          right: "-7%",
                        }}
                        title="Remove"
                        onClick={handleRemoveLogo}
                      >
                        <i className="bi bi-x fs-2"></i>
                      </span>
                    ) : null}
                  </div>
                  <div className="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                </div>
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
                        backgroundImage: cover ? `url(${cover})` : "none",
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
                        onChange={(event) => handleFileChange(event, "cover")}
                      />
                      <input type="hidden" name="avatar_remove" />
                    </label>
                    {cover && isCoverSelected ? (
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
                    ) : cover ? (
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        aria-label="Remove avatar"
                        style={{
                          position: "absolute",
                          bottom: "-7%",
                          right: "-7%",
                        }}
                        title="Remove"
                        onClick={handleRemoveCover}
                      >
                        <i className="bi bi-x fs-2"></i>
                      </span>
                    ) : null}
                  </div>
                  <div className="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Institute Name
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    {...register("name", {
                      required: "Institute name is required",
                    })}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Institute Name"
                    required
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-semibold fs-6">
                  Address
                </label>
                <div className="col-lg-8">
                  <textarea
                    {...register("address", {
                      required: "Institute address is required",
                    })}
                    className="form-control form-control-lg form-control-solid"
                    rows={3}
                    placeholder="Enter Address"
                    required
                  ></textarea>
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
                </div>
              </div>

              {/* Email Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Email
                </label>
                <div className="col-lg-8">
                  <input
                    type="email"
                    {...register("email")}
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Email Address"
                  />
                </div>
              </div>

              {/* Website Input */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Website
                </label>
                <div className="col-lg-8">
                  <input
                    type="url"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter Website URL"
                    {...register("website")}
                  />
                </div>
              </div>

              <div
                className="row mb-6 h-20"
                style={{
                  height: "12rem",
                }}
              >
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Short Description
                </label>
                <div className="col-lg-8 fv-row">
                  <Controller
                    name="shortDesc"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        placeholder="Input Short Description"
                        style={{
                          height: "6rem",
                        }}
                        value={field.value} // Pass value explicitly
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div
                className="row mb-6"
                style={{
                  height: "12rem",
                }}
              >
                <label className="col-lg-4 col-form-label fw-semibold fs-6">
                  Long Description
                </label>
                <div className="col-lg-8 fv-row">
                  <Controller
                    name="longDesc"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        placeholder="Input Long Description"
                        style={{
                          height: "6rem",
                        }}
                        value={field.value} // Pass value explicitly
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="row mb-6">
                <div className="col-lg-8 offset-lg-4">
                  <button type="submit" className="btn btn-primary">
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
