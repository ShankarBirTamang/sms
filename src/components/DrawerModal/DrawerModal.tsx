import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom" | "center"; // Added "center"
  width?: string;
  height?: string;
  children: React.ReactNode;
  title?: string;
};

const DrawerModal = ({
  isOpen,
  onClose,
  position = "right",
  width = "300px",
  height = "100%",
  children,
  title = "",
}: DrawerProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const baseStyles: React.CSSProperties = {
    position: "fixed",
    top:
      position === "top"
        ? "0"
        : position === "bottom"
        ? "auto"
        : position === "center"
        ? "50%"
        : undefined,
    bottom: position === "bottom" ? "0" : undefined,
    left: position === "left" ? "0" : position === "center" ? "50%" : undefined,
    right: position === "right" ? "0" : undefined,
    width:
      position === "left" || position === "right" || position === "center"
        ? width
        : "100%",
    height:
      position === "top" || position === "bottom" || position === "center"
        ? height
        : "100%",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    overflow: "auto",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform:
      position === "left"
        ? "translateX(-100%)"
        : position === "right"
        ? "translateX(100%)"
        : position === "top"
        ? "translateY(-100%)"
        : position === "bottom"
        ? "translateY(100%)"
        : position === "center"
        ? "translate(-50%, -50%)" // Centering transform
        : undefined,
    opacity: 0,
  };

  const activeStyles: React.CSSProperties = {
    transform:
      position === "center" ? "translate(-50%, -50%)" : "translate(0, 0)",
    opacity: 1,
  };

  const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  return ReactDOM.createPortal(
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div
        style={{
          ...baseStyles,
          ...(isOpen ? activeStyles : {}),
        }}
      >
        <div className="card">
          {title && (
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>
                <h3>{title}</h3>
              </strong>
            </div>
          )}
          <div className="card-body">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default DrawerModal;
