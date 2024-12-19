import { useState } from "react";
import Loading from "../../../../components/Loading/Loading";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";

const ViewTimeTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  console.log("params", params.timeTableId);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header mb-6">
          <div className="card-title w-100">
            <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
              <span>Time Table</span>
              <div className="d-flex gap-2">
                <Link
                  to={`/academics/routine/time-table/${params.timeTableId}/edit`}
                  className="btn btn-primary btn-sm ms-2 align-content-center"
                  title="Add TimeTable"
                >
                  <Icon name={"edit"} className={"svg-icon"} />
                  Add TimeTable
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
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th>Session Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-bold table">
                  <tr className="odd">
                    <td className="sorting_1">{}</td>

                    <td className="text-end"></td>
                  </tr>
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
