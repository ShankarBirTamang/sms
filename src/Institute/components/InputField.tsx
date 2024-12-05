import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

function InputField({ value, onChange, placeholder, style }: InputProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={basicModules}
      formats={formats}
      style={style}
    />
  );
}

const basicModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // Formatting options
    ["blockquote", "code-block"], // Block styles
    [{ header: 1 }, { header: 2 }], // Header sizes
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ script: "sub" }, { script: "super" }], // Sub/super scripts
    [{ indent: "-1" }, { indent: "+1" }], // Indentation
    [{ direction: "rtl" }], // Text direction
    [{ size: ["small", false, "large", "huge"] }], // Font sizes
    [{ color: [] }, { background: [] }], // Color pickers
    [{ font: [] }], // Font family
    [{ align: [] }], // Text alignment
    ["link", "image", "video"], // Media
    ["clean"], // Remove formatting
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "script",
  "align",
  "direction",
  "color",
  "background",
  "link",
  "image",
  "video",
  "code-block",
];

export default InputField;
