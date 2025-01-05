import { useOutletContext } from "react-router-dom";
import { EmployeeInterface } from "../../services/employeeService";
interface AttendanceRecord {
  id?: number;
  date: string;
  day: string;
  status: string;
}
const Overview = () => {
  const { employee } = useOutletContext<{ employee: EmployeeInterface }>();
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
  ];

  const getDayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  return (
    <>
      <div className="card card-flush mb-6 mb-xl-9">
        <div className="card-header mt-6 align-items-center">
          <div className="card-title flex-column">
            <h2 className="mb-1">Employee's Attendance</h2>
            <div className="d-flex gap-3">
              <span className="badge badge-success">Present</span>
              <span className="badge badge-danger">Absent</span>
              <span className="badge badge-warning">Leave</span>
              <span className="badge badge-secondary">Holiday</span>
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
                      : "btn-secondary"
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
      <div></div>
    </>
  );
};

export default Overview;
