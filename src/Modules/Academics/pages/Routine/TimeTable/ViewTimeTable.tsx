import { useEffect, useState } from "react";
import Loading from "../../../../../components/Loading/Loading";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../../../components/Icon/Icon";
import useTimeTable from "../../../hooks/useTimeTable";
import { daysOfWeek } from "../../../services/timeTableServic";

const ViewTimeTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const timeTableId = params.timeTableId;
  const { getOneTimeTable, timeTable } = useTimeTable({});
  // console.log("view timetable JSON", JSON.stringify(timeTable));
  console.log("view timetable", timeTable);

  useEffect(() => {
    if (timeTableId) {
      getOneTimeTable(Number(timeTableId));
    }
  }, [timeTableId]);

  const convertTo12HourFormat = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header mb-6">
          <div className="card-title w-100">
            <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
              <span>Period Name : {timeTable?.name}</span>
              <div className="d-flex gap-2">
                <Link
                  to={`/academics/routine/time-table/${params.timeTableId}/edit`}
                  className="btn btn-primary btn-sm ms-2 align-content-center"
                  title="Edit TimeTable"
                >
                  <Icon name={"edit"} className={"svg-icon"} />
                  Edit TimeTable
                </Link>
              </div>
            </h1>
          </div>
        </div>

        <div className="card-body pt-0">
          <div>
            {isLoading && <Loading />}
            {!isLoading && (
              <table
                className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                id="table_sessions"
                aria-describedby="table_sessions_info"
              >
                <thead>
                  <tr
                    className="text-start border border-2 fw-bolder fs-7 text-uppercase gs-0"
                    style={{ backgroundColor: "rgba(0, 0, 255, 0.2)" }}
                  >
                    <th>Day\Period</th>

                    {timeTable?.periods.map((period, periodIndex) => (
                      <th key={periodIndex}>{period.period_name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-bold table">
                  {daysOfWeek.map((day) => (
                    <tr key={day}>
                      <td>{day}</td>
                      {timeTable?.periods.map((period) => (
                        <td key={period.id}>
                          {period.days[day] ? (
                            <>
                              {convertTo12HourFormat(
                                period.days[day].start_time
                              )}
                              -
                              {convertTo12HourFormat(period.days[day].end_time)}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTimeTable;
