import React from "react";

const AssignExamSubject = () => {
  return (
    <>
      <form
        action="https://sms.aanshtech.com/sms/examination/exams/1/grade/1/subjects/store"
        method="POST"
      >
        <input
          type="hidden"
          name="_token"
          value="L2g0Y13aGhPWUOoLZpgSWMCewErDdZBn7cndzCX6"
          autocomplete="off"
        />
        <table className="table table-row-bordered table-responsive">
          <thead>
            <tr>
              <th rowspan="2">
                <div className="form-check">
                  <input
                    className="form-check-input selectAll"
                    type="checkbox"
                    checked=""
                  />
                </div>
              </th>
              <th rowspan="2" className="w-70px">
                Rank
              </th>
              <th rowspan="2" className="w-150px">
                Subjects
              </th>
              <th colspan="2" className="text-center">
                Theory
              </th>
              <th colspan="2" className="text-center">
                Practical
              </th>
            </tr>
            <tr>
              <th className="text-center">Full Marks</th>
              <th className="text-center">Pass Marks</th>
              <th className="text-center">Full Marks</th>
              <th className="text-center">Pass Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input checkbox checkbox-0"
                    name="subject[0][checked]"
                    type="checkbox"
                    value="yes"
                    target="data-0"
                    checked=""
                  />
                </div>
              </td>
              <td>
                <input
                  type="text"
                  name="subject[0][rank]"
                  className="form-control form-control-solid"
                  value="3"
                />
              </td>
              <td>
                <input type="hidden" name="subject[0][subject_id]" value="3" />
                <input
                  type="hidden"
                  name="subject[0][is_eca]"
                  className="form-control form-control-solid"
                  value="no"
                />
                Com. Mathematics
              </td>
              <td>
                <input
                  type="text"
                  name="subject[0][tfm]"
                  className="form-control form-control-solid subjectData data-0"
                  value="50"
                  placeholder="Theory FM for Com. Mathematics"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[0][tpm]"
                  className="form-control form-control-solid subjectData data-0"
                  value="17.5"
                  placeholder="Theory PM for Com. Mathematics"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[0][pfm]"
                  className="form-control form-control-solid subjectData data-0"
                  placeholder="Practical FM for Com. Mathematics"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[0][ppm]"
                  className="form-control form-control-solid subjectData data-0"
                  placeholder="Practical PM for Com. Mathematics"
                />
              </td>
            </tr>

            <tr>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input checkbox checkbox-1"
                    name="subject[1][checked]"
                    type="checkbox"
                    value="yes"
                    target="data-1"
                    checked=""
                  />
                </div>
              </td>
              <td>
                <input
                  type="text"
                  name="subject[1][rank]"
                  className="form-control form-control-solid"
                  value="4"
                />
              </td>
              <td>
                <input type="hidden" name="subject[1][subject_id]" value="4" />
                <input
                  type="hidden"
                  name="subject[1][is_eca]"
                  className="form-control form-control-solid"
                  value="no"
                />
                Drawing
              </td>
              <td>
                <input
                  type="text"
                  name="subject[1][tfm]"
                  className="form-control form-control-solid subjectData data-1"
                  value="25"
                  placeholder="Theory FM for Drawing"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[1][tpm]"
                  className="form-control form-control-solid subjectData data-1"
                  value="8.75"
                  placeholder="Theory PM for Drawing"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[1][pfm]"
                  className="form-control form-control-solid subjectData data-1"
                  placeholder="Practical FM for Drawing"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subject[1][ppm]"
                  className="form-control form-control-solid subjectData data-1"
                  placeholder="Practical PM for Drawing"
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" className="text-end">
                <button className="btn btn-primary">Submit</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </>
  );
};

export default AssignExamSubject;
