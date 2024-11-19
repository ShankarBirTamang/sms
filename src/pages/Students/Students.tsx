import Icon from "../../components/Icon/Icon.tsx";

interface Student {
  id: number;
  photo: string;
  name: string;
  grade: number;
  section: string;
  gender: string;
  contact: string;
  address: string;
}

const Students = () => {
  const students: Student[] = [
    {
      id: 1,
      photo: "",
      name: "Magnum Hunter",
      grade: 10,
      section: "A",
      gender: "Male",
      contact: "9812345678",
      address: "Dharan 8",
    },
  ];
  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header border-0 pt-6">
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                  <Icon
                    name={"search"}
                    className={"svg-icon-1 position-absolute ms-6"}
                  />

                  <input
                    type="text"
                    id="data_search"
                    className="form-control form-control-solid w-250px ps-14"
                    placeholder="Search Students"
                  />
                </div>
              </div>

              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <a
                    href="#"
                    className="btn btn-primary"
                    type="link"
                    title="Add Student"
                  >
                    <Icon name={"add"} />
                    Add Student
                  </a>
                </div>
              </div>
            </div>

            <div className="card-body">
              <table
                className="table align-middle table-row-dashed fs-6 gy-5"
                id="table_sessions"
              >
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
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>1</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {student.photo ? (
                            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                              <a href="#">
                                <div className="symbol-label">
                                  <img
                                    src="https://publichighschool.edu.np/storage/1822/conversions/506-thumbnail.webp"
                                    alt="AABHASH BUDHATHOKI"
                                    className="w-100"
                                  />
                                </div>
                              </a>
                            </div>
                          ) : null}
                          <div className="d-flex flex-column">
                            <a
                              href="#"
                              className="text-gray-800 text-hover-primary mb-1"
                            >
                              {student.name}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        {student.grade} {student.section}
                      </td>
                      <td>{student.gender}</td>
                      <td>{student.contact}</td>
                      <td>{student.address}</td>

                      <td className="text-end">
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            justifyContent: "flex-end",
                          }}
                        >
                          <a href="#" className="btn btn-light-info btn-icon">
                            <Icon name={"search"} className={"svg-icon-2"} />
                          </a>
                          <a
                            href="#"
                            className="btn btn-light-success btn-icon"
                          >
                            <span className="svg-icon svg-icon-2">
                              <Icon name={"edit"} className={"svg-icon-2"} />
                            </span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
