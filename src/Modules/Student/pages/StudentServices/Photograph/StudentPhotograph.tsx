import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SessionGradePicker from "../../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";
import useGrade from "../../../../../Academics/hooks/useGrade";
import { StudentInterface } from "../../../services/studentService";
import Loading from "../../../../../components/Loading/Loading";

import photos from "../../../../../constants/images";
import DrawerModal from "../../../../../components/DrawerModal/DrawerModal";
import CapturePhotograph from "./CapturePhotograph";

const StudentPhotograph = () => {
  const { getSectionStudents } = useGrade({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);
  const [capturePhotoDrawer, setCapturePhotoDrawer] = useState(true);

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const handleSessionSelectChange = useCallback(
    async (selectedValues: {
      level: number | null;
      session: number | null;
      grade: number | null;
      section: number | null;
    }) => {
      if (selectedValues.grade && !selectedValues.section) {
        setStudents([]);
        setSelectedFiles([]);
      }

      if (selectedValues.section && selectedValues.grade) {
        setIsLoading(true);
        const newStudents = await getSectionStudents(selectedValues.section);
        setStudents(newStudents);
        setIsLoading(false);
      }
    },
    [getSectionStudents]
  );

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.target.files) {
      const newFiles = [...selectedFiles];
      newFiles[index] = event.target.files[0];
      setSelectedFiles(newFiles);
    }
  };

  const toggleCapturePhotoDrawer = () => {
    setCapturePhotoDrawer(!capturePhotoDrawer);
  };

  return (
    <>
      <div className="card mb-5">
        <div className="card-header">
          <h2 className="card-title">Import Students Data</h2>
        </div>
        <div className="card-body pt-6">
          <div className="row">
            <SessionGradePicker
              onChange={handleSessionSelectChange}
              colSize={3}
            />
          </div>

          <div className="col-12 mt-3">
            {isLoading && <Loading />}

            {!isLoading && students.length > 0 && (
              <>
                <hr />

                <table className="table align-middle table-row-dashed fs-6 gy-1">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="">S.N.</th>

                      <th className="min-w-125px">Name</th>
                      <th className="">Grade / Section</th>

                      <th className="min-w-125px">Gender</th>
                      <th className="min-w-125px">Contact</th>
                      <th className="min-w-125px">Address</th>
                      <th className="text-end min-w-175px">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold">
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td>1</td>
                        <td className="d-flex align-items-center">
                          <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                            <a href="#">
                              <div className="symbol-label">
                                <img
                                  src={
                                    student.photo !== ""
                                      ? student.photo
                                      : photos.mainLogo
                                  }
                                  alt="AARAV  BASNET"
                                  className="w-100"
                                />
                              </div>
                            </a>
                          </div>
                          <div className="d-flex flex-column">
                            <a
                              href="#"
                              className="text-gray-800 text-hover-primary mb-1"
                            >
                              {student.full_name}
                            </a>
                          </div>
                        </td>
                        <td>Nursery A1</td>
                        <td>Male</td>
                        <td>9817318724</td>
                        <td>DHARAN-14</td>

                        <td className="text-end">
                          <div className="d-flex gap-3 justify-content-end">
                            <input
                              type="file"
                              accept="image/*"
                              ref={(input) => {
                                if (input) {
                                  fileInputs.current[index] = input;
                                }
                              }}
                              onChange={(event) =>
                                handleFileChange(event, index)
                              }
                              // style={{ display: "none" }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => fileInputs.current[index].click()}
                            >
                              Upload Photo
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={toggleCapturePhotoDrawer}
                            >
                              Capture Photo
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
      <DrawerModal
        isOpen={capturePhotoDrawer}
        onClose={toggleCapturePhotoDrawer}
        position="center"
        width="900px"
        height="620px"
        title="Capture Student Photo"
      >
        <CapturePhotograph />
      </DrawerModal>
    </>
  );
};

export default StudentPhotograph;
