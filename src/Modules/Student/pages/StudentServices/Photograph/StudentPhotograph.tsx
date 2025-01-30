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
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import Icon from "../../../../../components/Icon/Icon";
import useGeneralFunction from "../../../../../hooks/useGeneralFunction";
import {
  UploadPhotoInterface,
  UploadPhotoResponse,
} from "../../../../../services/generalService";
import useHelpers from "../../../../../hooks/useHelpers";
import toast from "react-hot-toast";

const StudentPhotograph = () => {
  useDocumentTitle("Capture Student Photograph");
  const { getSectionStudents } = useGrade({});
  const { convertFileToBase64 } = useHelpers();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputs = useRef<HTMLInputElement[]>([]);
  const [capturePhotoDrawer, setCapturePhotoDrawer] = useState(false);

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentInterface[]>(
    []
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentInterface>();
  const { uploadPhoto } = useGeneralFunction();
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
        setFilteredStudents(newStudents);
        setIsLoading(false);
      }
    },
    [getSectionStudents]
  );

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    stud: StudentInterface
  ) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      event.target.files[0]
    ) {
      const file = event.target.files[0];
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);
      try {
        const base64File = await convertFileToBase64(file);
        const data: UploadPhotoInterface = {
          id: stud.id,
          image: base64File,
          for: "Student",
        };

        const response = await uploadPhoto(data);
        if (response) {
          const uploadResponse: UploadPhotoResponse = response;
          const photo = uploadResponse.data.photo;
          const updatedStudents = filteredStudents.map((s) =>
            s.id === stud.id ? { ...s, photo } : s
          );
          setFilteredStudents(updatedStudents);
          setSelectedStudent(undefined);
          event.target.value = "";
        }
      } catch {
        toast.error("Error Uploading Photo");
      }
    } else {
      // If no file is selected, reset the selected student and clear the input value
      setSelectedStudent(undefined);
      event.target.value = ""; // Clear the file input
    }
  };
  useEffect(() => {
    const filteredStudents = students.filter((student) => {
      return student.full_name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLocaleLowerCase());
    });
    setFilteredStudents(filteredStudents);
  }, [debouncedSearchTerm, students]);

  const toggleCapturePhotoDrawer = async (
    student?: StudentInterface,
    photo?: string
  ) => {
    setCapturePhotoDrawer(!capturePhotoDrawer);
    setSelectedStudent(student);
    if (student && photo) {
      const updatedStudents = filteredStudents.map((s) =>
        s.id === student.id ? { ...s, photo } : s
      );
      setFilteredStudents(updatedStudents);
      setSelectedStudent(undefined);
    }
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
        </div>
      </div>
      {isLoading && <Loading />}{" "}
      {!isLoading && students.length > 0 && (
        <>
          <div className="card mb-5">
            <div className="card-header">
              <h2 className="card-title">
                Students of {students[0].grade?.name} (
                {students[0].section?.faculty?.name}:{students[0].section?.name}
                )
              </h2>
              <div className="card-toolbar">
                <div className="d-flex align-items-center position-relative">
                  <Icon
                    name="searchDark"
                    className="svg-icon svg-icon-1 position-absolute ms-6"
                  />

                  <input
                    type="text"
                    id="data_search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-250px ps-14"
                    placeholder="Search Students"
                  />
                </div>
              </div>
            </div>
            <div className="card-body pt-6">
              <div className="col-12 mt-3">
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
                    {filteredStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
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
                        <td>
                          {student.grade?.name}({student.section?.faculty.name}:
                          {student.section?.name})
                        </td>
                        <td>{student.gender}</td>
                        <td>{student.contact}</td>
                        <td>{student.address}</td>

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
                              onChange={(event) => {
                                handleFileChange(event, index, student);
                              }}
                              style={{
                                display: "none",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                fileInputs.current[index].click();
                                setSelectedStudent(student);
                              }}
                            >
                              {selectedStudent?.id == student.id
                                ? "Uploading..."
                                : "Upload Photo"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => toggleCapturePhotoDrawer(student)}
                            >
                              Capture Photo
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {selectedStudent && (
            <DrawerModal
              isOpen={capturePhotoDrawer}
              onClose={toggleCapturePhotoDrawer}
              position="center"
              width="900px"
              height="620px"
              title="Capture Student Photo"
            >
              <CapturePhotograph
                target={selectedStudent}
                onSave={(photo: string) =>
                  toggleCapturePhotoDrawer(selectedStudent, photo)
                }
                targetFor="Student"
              />
            </DrawerModal>
          )}
        </>
      )}
    </>
  );
};

export default StudentPhotograph;
