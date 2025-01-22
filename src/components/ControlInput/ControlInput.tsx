import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  Path,
  PathValue,
} from "react-hook-form";

interface ControlInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  type?: string;
  placeholder?: string;
  step?: string;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>; // Ensure defaultValue matches the field type
  onChange?: (value: string | number) => void;
}

const ControlInput = <TFieldValues extends FieldValues>({
  name,
  control,
  errors,
  type = "text",
  placeholder = "",
  step,
  className = "",
  style,
  defaultValue,
  onChange,
}: ControlInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          step={step}
          placeholder={placeholder}
          className={`form-control ${className} ${
            errors[name] ? "is-invalid" : ""
          }`}
          style={style}
          onChange={(e) => {
            const value =
              type === "number" ? parseFloat(e.target.value) : e.target.value;
            field.onChange(value);
            if (onChange) {
              onChange(value);
            }
          }}
        />
      )}
    />
  );
};

export default ControlInput;
