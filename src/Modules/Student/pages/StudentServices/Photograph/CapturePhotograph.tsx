import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import photos from "../../../../../constants/images";
import useGeneralFunction from "../../../../../hooks/useGeneralFunction";
import { UploadPhotoInterface } from "../../../../../services/generalService";
import { StudentInterface } from "../../../services/studentService";
import { EmployeeInterface } from "../../../../Employee/services/employeeService";
import { ApiResponseInterface } from "../../../../../Interface/Interface";

const videoConstraints = {
  width: 355,
  height: 400,
  facingMode: "user",
};
interface CapturePhotoProps {
  onSave: (photo: string) => void;
  target: StudentInterface | EmployeeInterface;
  targetFor: string;
}
const CapturePhotograph = ({
  onSave,
  target,
  targetFor,
}: CapturePhotoProps) => {
  const [isCaptureEnable] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);

  const { uploadPhoto } = useGeneralFunction();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
    });
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };
  interface UploadPhotoResponse {
    data: {
      message: string;
      photo: string;
    };
  }

  const handleUploadClick = async () => {
    if (url) {
      setIsUploading(true);
      const data: UploadPhotoInterface = {
        id: target.id,
        image: url,
        for: targetFor,
      };
      const response = await uploadPhoto(data);

      if (response) {
        const uploadResponse: UploadPhotoResponse = response;
        if (response.status == 200) {
          onSave(uploadResponse.data.photo);
        }
      }
      setIsUploading(false);
    }
  };

  return (
    <>
      {isCaptureEnable && (
        <>
          <div className="d-flex gap-3 mb-10">
            <div className="form-group">
              <select
                className="form-select"
                value={selectedDevice ?? undefined}
                onChange={handleDeviceChange}
              >
                <option value="">Select a camera</option>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-success"
              type="button"
              onClick={capture}
              disabled={isUploading}
            >
              capture
            </button>
            {url && (
              <>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading.." : "Upload"}
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    setUrl(null);
                  }}
                  disabled={isUploading}
                >
                  delete
                </button>
              </>
            )}
          </div>
          <div className="d-flex justify-content-around gap-3">
            <div className="position-relative">
              <img
                src={photos.photographS}
                alt=""
                style={{
                  position: "absolute",
                  left: 0,
                  height: 400,
                  width: 355,
                }}
              />
              <Webcam
                audio={false}
                width={355}
                height={400}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  ...videoConstraints,
                  deviceId: selectedDevice ?? undefined,
                }}
              />
            </div>

            <div>
              <img
                src={url ?? photos.kingBob}
                alt="Screenshot"
                style={{
                  height: 400,
                  width: 355,
                  objectFit: "contain",
                  boxShadow: "0 0 22px rgb(179, 228, 255)",
                  borderRadius: 9,
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CapturePhotograph;
