import React, { useEffect } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface ImagePickerProps {
  errors?:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          image: FileList;
        }>
      >
    | undefined;
  onChange: (file: File | null) => void;
  value: File | null;
}

const ImagePicker = ({ errors, onChange, value }: ImagePickerProps) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  const handleCancelPreview = () => {
    setPreview(null);
    onChange(null);
  };
  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <>
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
            backgroundImage: `url(${preview})`,
            backgroundPosition: "50% 50%",
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
            onChange={handleFileChange}
          />
          <input type="hidden" name="avatar_remove" />
        </label>
        {preview && (
          <span
            className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
            aria-label="Cancel avatar"
            style={{
              position: "absolute",
              bottom: "-7%",
              right: "-7%",
            }}
            title="Cancel"
            onClick={handleCancelPreview}
          >
            <i className="bi bi-x fs-2"></i>
          </span>
        )}
      </div>
      <div className="form-text">Allowed file types: png, jpg, jpeg.</div>
      {errors?.image?.message && (
        <div className="fv-plugins-message-container mt-2 text-danger">
          {errors.image.message}
        </div>
      )}
    </>
  );
};

export default ImagePicker;
