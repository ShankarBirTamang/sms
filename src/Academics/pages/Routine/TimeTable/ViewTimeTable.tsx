import { useEffect, useState } from "react";
import Loading from "../../../../components/Loading/Loading";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import useTimeTable from "../../../hooks/useTimeTable";

const ViewTimeTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const timeTableId = params.timeTableId;
  const { getOneTimeTable, timeTable } = useTimeTable({});
  console.log("view timetable JSON", JSON.stringify(timeTable));
  // console.log("view timetable", timeTable);

  useEffect(() => {
    if (timeTableId) {
      getOneTimeTable(Number(timeTableId));
    }
  }, [timeTableId]);

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
                  {/* <tr
                    className="text-start border border-2 fw-bolder fs-7 text-uppercase gs-0"
                    style={{ backgroundColor: "rgba(0, 0, 255, 0.2)" }}
                  >
                    <th>Period\Day</th>
                    {daysOfWeek.map((day, dayIndex) => (
                      <th key={dayIndex}>{day}</th>
                    ))}
                  </tr> */}
                </thead>
                <tbody className="text-gray-600 fw-bold table">
                  {timeTable?.periods.map((period, periodIndex) => (
                    <tr key={periodIndex} className="odd">
                      <td className="sorting_1">{period.period_name}</td>
                      {Object.entries(period.period_days).map(
                        ([day, detail]) => (
                          <td>
                            <p
                              className=""
                              style={{
                                backgroundColor: "rgba(0, 0, 255, 0.1)",
                              }}
                            >
                              {day}
                            </p>
                            <p>Start Time:{detail.start_time}</p>
                            <p>End Time:{detail.end_time}</p>
                          </td>
                        )
                      )}
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
