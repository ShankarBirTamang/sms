import React, { useCallback, useState } from "react";
import SessionGradePicker from "../../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";
import useGrade from "../../../../../Academics/hooks/useGrade";
import { StudentInterface } from "../../../../Student/services/studentService";
import Loading from "../../../../../components/Loading/Loading";

const StudentAccount = () => {
  const { getSectionStudents } = useGrade({});

  const [Students, setStudents] = useState<StudentInterface[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const handleSelectedValuesChange = useCallback(
    async (selectedValues: {
      level: number | null;
      session: number | null;
      grade: number | null;
      section: number | null;
    }) => {
      if (selectedValues.section) {
        setIsLoading(true);
        const students = await getSectionStudents(selectedValues.section);
        setStudents(students);
        setIsLoading(false);
      }
      console.log("Selected Values:", selectedValues);
    },
    []
  ); // Empty dependency array means this function is memoized and won't change
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h2>Student Accounts Setup</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <SessionGradePicker
              onChange={handleSelectedValuesChange}
              colSize={3}
            />
          </div>
          <hr />
          {isLoading && <Loading />}

          {!isLoading && (
            <table
              className="table align-middle table-row-dashed fs-6 gy-1"
              id="table_sessions"
            >
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="w-20px">S.N.</th>
                  <th className="w-200px">Name</th>
                  <th className="w-200px text-center">Payment Group</th>
                  <th className="w-200px text-center">Discount Group</th>
                  <th></th>
                </tr>
                <tr>
                  {/* <td>
                  <button className="btn btn-primary btn-sm">
                    Sett All Monthly
                  </button>
                  <button className="btn btn-primary btn-sm">
                    Sett All Semi Annual
                  </button>
                  <button className="btn btn-primary btn-sm">
                    Sett All Annual
                  </button>
                </td> */}
                </tr>
              </thead>
              <tbody className="">
                {Students.map((student) => (
                  <tr key={student.id}>
                    <td>1</td>
                    <td className="">
                      <strong>{student.full_name}</strong>
                      <br />
                      <small> Nursery (A1) </small>
                    </td>
                    <td>
                      <div>
                        <select className="form-select">
                          <option value="Monthly" selected>
                            Monthly
                          </option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Semi Annual">Semi Annual</option>
                          <option value="Annual">Annual</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div>
                        <select className="form-select">
                          <option value="None" selected>
                            None
                          </option>
                          <option value="5">5%</option>
                        </select>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary">Submit</button>
        </div>
      </div>
    </>
  );
};

export default StudentAccount;
