import axiosInstance, { CanceledError } from "../services/apiClient";
import { UploadPhotoInterface } from "../services/generalService";
import toast from "react-hot-toast";

const useGeneralFunction = () => {
  const uploadPhoto = async (data: UploadPhotoInterface) => {
    try {
      const response = await axiosInstance.post("general/upload-photo", data);
      toast.success("Photo Uploaded Successfully.");
      return response;
    } catch (error: unknown) {
      if (error instanceof CanceledError) return;
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return {
    uploadPhoto,
  };
};

export default useGeneralFunction;
