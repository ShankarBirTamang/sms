import React, { useState } from "react";

interface ProcessingButtonProps {
  isProcessing: boolean;
  isActive: boolean;
  onClick: () => void;
  hoverText: string;
  activeText: string;
  inactiveText: string;
}

const ProcessingButton: React.FC<ProcessingButtonProps> = ({
  isProcessing,
  isActive,
  onClick,
  hoverText,
  activeText,
  inactiveText,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!isProcessing) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <button
      className={`btn btn-sm ${
        isActive ? "btn-success" : "btn-danger"
      } w-100px`}
      onClick={onClick}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isProcessing} // Disable button while processing
    >
      {isProcessing
        ? "Processing..."
        : isHovered
        ? hoverText
        : isActive
        ? activeText
        : inactiveText}
    </button>
  );
};

export default ProcessingButton;
