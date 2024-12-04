import { Toaster } from "react-hot-toast";

interface ToasterInterface {
  position?: "top-left" | "top-center" | "top-right";
  reverseOrder?: boolean;
}

const Toast = ({
  position = "top-right",
  reverseOrder = true,
}: ToasterInterface) => {
  // Set default value here
  return (
    <div>
      <Toaster position={position} reverseOrder={reverseOrder} />
    </div>
  );
};

export default Toast;
