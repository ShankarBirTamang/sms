import React from "react";
import { toast, ToastOptions } from "react-hot-toast";

interface ToastWithLinkProps {
  message: string;
  linkText: string;
  linkUrl: string;
  toastOptions?: ToastOptions;
}

const ToastWithLink: React.FC<ToastWithLinkProps> = ({
  message,
  linkText,
  linkUrl,
}) => {
  React.useEffect(() => {
    toast.success(
      <div>
        {message}{" "}
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          {linkText}
        </a>
      </div>,
      {
        duration: 5000,
        position: "top-right",
      }
    );
  }, [message, linkText, linkUrl]);

  return null;
};

export default ToastWithLink;
