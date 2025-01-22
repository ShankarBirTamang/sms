import React from "react";
import SessionGradePicker from "../../../Academics/componenet/SessionGradePicker/SessionGradePicker";

const StudentExport = () => {
  const handleSessionSelectChange = (selectedValues: {
    level: number | null;
    session: number | null;
    grade: number | null;
    section: number | null;
  }) => {
    // if (selectedValues.session) {
    //   setValue("academicSessionId", selectedValues.session);
    // }
    // if (selectedValues.grade) {
    //   setValue("gradeId", selectedValues.grade);
    // }
    // if (selectedValues.section) {
    //   setValue("sectionId", selectedValues.section);
    // }
    console.log("Selected Values:", selectedValues);
  };
  return (
    <>
      <div className="card mb-5">
        <div className="card-header">
          <h2 className="card-title">Get Students Data</h2>
        </div>
        <div className="card-body pt-6">
          <form method="POST">
            <div className="row">
              <SessionGradePicker
                onChange={handleSessionSelectChange}
                colSize={3}
              />
            </div>

            <div className="col-12 mt-3">
              <hr />

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>
                      <strong>ID</strong>
                    </th>
                    <th>
                      <strong>Roll</strong>
                    </th>
                    <th>
                      <strong>Photo</strong>
                    </th>
                    <th>
                      <strong>
                        First <br /> Name
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Middle <br /> Name
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Last <br /> Name
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Grade: <br />
                        Section
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Gender/
                        <br />
                        Ethnicity
                      </strong>
                    </th>
                    <th>
                      <strong>DOB</strong>
                    </th>
                    <th>
                      <strong>Contact</strong>
                    </th>
                    <th>
                      <strong>Address</strong>
                    </th>
                    <th>
                      <strong>
                        Father's <br /> Name/ PH
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Mother's <br /> Name / PH
                      </strong>
                    </th>
                    <th>
                      <strong>
                        Blood <br /> Group
                      </strong>
                    </th>
                    <th>
                      <strong>Nationality</strong>
                    </th>
                    <th>
                      <strong>Mother's Tongue</strong>
                    </th>
                    <th>
                      <strong>Religion</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>
                      <span
                        style={{
                          display: "block",
                          height: 60,
                          aspectRatio: 1,
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src="https://sms.aanshtech.com/storage/43/1.webp"
                          alt=""
                        />
                      </span>
                    </td>
                    <td>AARAV</td>
                    <td></td>
                    <td>BASNET</td>
                    <td>Nursery : A1</td>
                    <td>
                      Gen:Male <br />
                      ETH:Others
                    </td>
                    <td>
                      NP: 2077-12-03 <br /> EN:{" "}
                    </td>
                    <td>9817318724</td>
                    <td>DHARAN-14</td>
                    <td>
                      GOPAL BASNET <br />
                      PH:{" "}
                    </td>
                    <td>
                      KHINA MAYA POUDEL <br />
                      PH:{" "}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-12 pt-15">
              <button type="reset" className="btn btn-light me-3">
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentExport;
