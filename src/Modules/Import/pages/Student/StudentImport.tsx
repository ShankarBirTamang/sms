import React from "react";
import SessionGradePicker from "../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";

const StudentImport = () => {
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
          <h2 className="card-title">Import Students Data</h2>
        </div>
        <div className="card-body pt-6">
          <form method="POST">
            <div className="row">
              <SessionGradePicker
                onChange={handleSessionSelectChange}
                colSize={3}
              />
              <div className=" p-2 mb-2">
                <h4 className="text-danger">
                  Warning: While importing an Excel file, ensure that the
                  <strong>dob_en</strong> and <strong>dob_np</strong> columns
                  are formatted as text and follow the{" "}
                  <strong>YYYY-MM-DD</strong>
                  date format for both. Not adhering to this may result in
                  inaccurate data.
                  <br />
                  Excel फाइल आयात गर्दा, कृपया dob_en र dob_np स्तम्भहरूलाई
                  (Text) रूपमा रूपान्तरण गर्नुहोस् र दुवैका लागि मिति स्वरूप
                  YYYY-MM-DD प्रयोग गर्नुहोस्। यसो नगर्दा गलत डाटा हुनसक्छ।
                </h4>
              </div>
            </div>
            <div className="col-12">
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Select Import FIle
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="import_file"
                      className="form-control form-control-solid mb-3 mb-lg-0"
                      accept=".xlsx,.xls"
                      placeholder=""
                    />
                  </div>
                  <div className="col">
                    <button className="btn btn-primary">Uploading ...</button>
                  </div>
                </div>
              </div>
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
                      <strong>First Name</strong>
                    </th>
                    <th>
                      <strong>Middle Name</strong>
                    </th>
                    <th>
                      <strong>Last Name</strong>
                    </th>
                    <th>
                      <strong>IEMIS</strong>
                    </th>
                    <th>
                      <strong>Gender</strong>
                    </th>
                    <th>
                      <strong>Ethnicity</strong>
                    </th>
                    <th>
                      <strong>DOB EN</strong>
                    </th>
                    <th>
                      <strong>DOB NP</strong>
                    </th>
                    <th>
                      <strong>Contact</strong>
                    </th>
                    <th>
                      <strong>Address</strong>
                    </th>
                    <th>
                      <strong>Father's Name</strong>
                    </th>
                    <th>
                      <strong>Father's Contact</strong>
                    </th>
                    <th>
                      <strong>Mother's Name</strong>
                    </th>
                    <th>
                      <strong>Mother's Contact</strong>
                    </th>
                    <th>
                      <strong>Blood Group</strong>
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
                    <th>
                      <strong>Bus</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-danger text-white">
                    <td>1</td>
                    <td>1</td>
                    <td>AARAV</td>
                    <td></td>
                    <td>BASNET</td>
                    <td>0601800098100001</td>
                    <td>Male</td>
                    <td>Others</td>
                    <td>2021-03-16</td>
                    <td>2077-12-03</td>
                    <td>9817318724</td>
                    <td>DHARAN-14</td>
                    <td>GOPAL BASNET</td>
                    <td></td>
                    <td>KHINA MAYA POUDEL</td>
                    <td></td>
                    <td></td>
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

export default StudentImport;
