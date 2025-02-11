import { useOutletContext } from "react-router-dom";
import {
  StudentGuardianInterface,
  StudentInterface,
} from "../../../services/studentService";
import Icon from "../../../../../components/Icon/Icon";
import DrawerModal from "../../../../../components/DrawerModal/DrawerModal";
import { useState } from "react";
import AddGuardian from "./Guardian/AddGuardian";
import EditGuardian from "./Guardian/EditGuardian";
import useStudent from "../../../hooks/useStudent";
interface AttendanceRecord {
  id?: number;
  date: string;
  day: string;
  status: string;
}
const Overview = () => {
  const { student } = useOutletContext<{ student: StudentInterface }>();

  const [addGuardianDrawer, setAddGuardianDrawer] = useState(false);
  const [editGuardianDrawer, setEditGuardianDrawer] = useState(false);
  const [selectedGuardian, setSetselectedGuardian] =
    useState<StudentGuardianInterface>();

  const { fetchStudents } = useStudent({});
  const attendanceRecords: AttendanceRecord[] = [
    { id: 1, date: "2021-10-21", day: "SUN", status: "P" },
    { id: 2, date: "2021-10-22", day: "MON", status: "A" },
    { id: 3, date: "2021-10-23", day: "TUE", status: "P" },
    { id: 4, date: "2021-10-24", day: "WED", status: "P" },
    { id: 5, date: "2021-10-25", day: "THU", status: "A" },
    { id: 6, date: "2021-10-26", day: "FRI", status: "P" },
    { id: 7, date: "2021-10-27", day: "SAT", status: "H" },
    { id: 8, date: "2021-10-28", day: "SUN", status: "L" },
    { id: 9, date: "2021-10-29", day: "MON", status: "P" },
    { id: 10, date: "2021-10-30", day: "TUE", status: "P" },
    { id: 11, date: "2021-10-31", day: "WED", status: "N" },
  ];

  const getDayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const toggleAddGuardianDrawer = () => {
    setAddGuardianDrawer(!addGuardianDrawer);
  };

  const toggleEditGuardianDrawer = (guardian?: StudentGuardianInterface) => {
    setSetselectedGuardian(guardian);
    setEditGuardianDrawer(!editGuardianDrawer);
  };

  const handleGuardianCreate = (guardian: StudentGuardianInterface) => {
    console.log(guardian);
    student.guardians?.push(guardian);
    toggleAddGuardianDrawer();
  };

  const handleGuardianEdit = (updatedGuardian: StudentGuardianInterface) => {
    if (!student.guardians) return;

    student.guardians = student.guardians.map((guardian) =>
      guardian.id === updatedGuardian.id ? updatedGuardian : guardian
    );
    toggleEditGuardianDrawer();
  };

  return (
    <>
      <div className="card card-flush mb-6 mb-xl-9">
        <div className="card-header mt-6 align-items-center">
          <div className="card-title flex-column">
            <h2 className="mb-1">Student's Attendance</h2>
            <div className="d-flex gap-3">
              <span className="badge badge-success">Present</span>
              <span className="badge badge-danger">Absent</span>
              <span className="badge badge-warning">Leave</span>
              <span className="badge badge-secondary">Holiday</span>
              <span className="badge badge-info">No Data</span>
            </div>
          </div>

          <div className="d-flex g-3">
            <a href="#" className="btn btn-secondary btn-sm">
              View All
            </a>
          </div>
        </div>
        <div className="card-body p-9 pt-4">
          <ul className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2 justify-content-center attendance-navs">
            {attendanceRecords.map((record) => (
              <li className="me-1" key={record.id}>
                <span
                  className={`btn d-flex flex-column flex-center rounded-pill w-40px me-2 py-6 ${
                    record.status === "P"
                      ? "btn-success"
                      : record.status === "A"
                      ? "btn-danger"
                      : record.status === "L"
                      ? "btn-warning"
                      : record.status === "H"
                      ? "btn-secondary"
                      : "btn-info"
                  }`}
                >
                  <span className="opacity-50 fs-7 fw-semibold">
                    {record.day}
                  </span>
                  <span className="fs-6 fw-bolder">
                    {getDayFromDate(record.date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="card card-flush mb-6 mb-xl-9">
          <div className="card-header mt-6">
            <div className="card-title flex-column">
              <h2 className="mb-1">Student's Guardians</h2>
              <div className="fs-6 fw-semibold text-muted">
                Family Members / Guardians
              </div>
            </div>
            <div className="card-toolbar d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleAddGuardianDrawer}
              >
                Add Guardian
              </button>
            </div>
          </div>
          <div className="card-body d-flex flex-column">
            <table className="table align-middle table-row-dashed fs-6">
              <thead>
                <tr>
                  <th className="w-200p x">Name</th>
                  <th>Relation</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {student.guardians?.map((guardian) => (
                  <tr key={guardian.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {guardian.photo ? (
                          <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                            <div className="symbol-label">
                              <img
                                src={guardian.photo}
                                alt={guardian.name}
                                className={`w-100 `}
                              />
                            </div>
                          </div>
                        ) : null}
                        <div className="d-flex flex-column">
                          {guardian.name}
                        </div>
                      </div>
                    </td>
                    <td>{guardian.relation}</td>
                    <td>{guardian.type}</td>
                    <td>{guardian.contact}</td>
                    <td>{guardian.email}</td>
                    <td>{guardian.address}</td>
                    <td className="text-end">
                      <button
                        title="edit"
                        type="button"
                        className="btn btn-light-success btn-sm btn-icon"
                        onClick={() => toggleEditGuardianDrawer(guardian)}
                      >
                        <Icon name={"edit"} className={"svg-icon-2"} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DrawerModal
          isOpen={addGuardianDrawer}
          onClose={toggleAddGuardianDrawer}
          position="right"
          width="500px"
          title="Add Guardian"
        >
          <AddGuardian studentId={student.id} onSave={handleGuardianCreate} />
        </DrawerModal>

        {selectedGuardian && (
          <DrawerModal
            isOpen={editGuardianDrawer}
            onClose={toggleEditGuardianDrawer}
            position="right"
            width="500px"
            title="Edit Guardian"
          >
            <EditGuardian
              studentGuardian={selectedGuardian}
              onSave={handleGuardianEdit}
            />
          </DrawerModal>
        )}
      </div>
    </>
  );
};

export default Overview;
