import Icon from "../../components/Icon/Icon.tsx";
import { MenuItem } from "../../Interface/Interface.tsx";
// import { usePermissions } from "../../hooks/usePermissions.ts";

const Dashboard = () => {
  // const { permissions } = usePermissions();
  // if (permissions.includes("user-create")) console.log("perms:", permissions);

  const menuItems: MenuItem[] = [
    {
      title: "Grade",
      icon: "grades",
      route: "/academics/grades",
    },
    {
      title: "Students",
      icon: "student",
      route: "/students",
    },
    {
      title: "Employee",
      icon: "users",
      route: "/employees",
    },
    {
      title: "Examination",
      icon: "exam",
      route: "/examination/session",
    },
  ];
  const totalStudents = 1000;
  return (
    <>
      <div className="row g-5 g-xl-8">
        <div className="col-xl-4 mb-xl-10">
          <div className="card card-flush">
            <div
              className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-start h-250px"
              style={{
                backgroundImage:
                  "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
              }}
              data-theme="light"
            >
              <h3 className="card-title align-items-start flex-column text-white pt-15">
                <span className="fw-bold fs-2x mb-3">S.P.H.S Details</span>
                <div className="fs-4 text-white">
                  <span className="opacity-75">Current status count</span>
                </div>
              </h3>
            </div>

            <div className="card-body mt-n20">
              <div className="mt-n20 position-relative">
                <div className="row g-3 g-lg-6">
                  <div className="col-6">
                    <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                      <div className="symbol symbol-30px me-5 mb-8">
                        <span className="symbol-label">
                          <Icon
                            name={"student"}
                            className={"svg-icon-1 svg-icon-primary"}
                          />
                        </span>
                      </div>

                      <div className="m-0">
                        <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                          {totalStudents}
                        </span>

                        <span className="text-gray-500 fw-semibold fs-6">
                          Students
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                      <div className="symbol symbol-30px me-5 mb-8">
                        <span className="symbol-label">
                          <Icon
                            name={"users"}
                            className={"svg-icon-1 svg-icon-primary"}
                          />
                        </span>
                      </div>

                      <div className="m-0">
                        <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                          157
                        </span>

                        <span className="text-gray-500 fw-semibold fs-6">
                          Staffs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <h5 className="text-center">Current Academic Sessions</h5>
                    <button className="btn btn-sm btn-light-info w-100 mb-2 d-flex justify-content-between">
                      <span>
                        <strong>Nursery to 10</strong>
                      </span>
                      <span>Academic Year 2081</span>
                    </button>
                    <button className="btn btn-sm btn-light-info w-100 mb-2 d-flex justify-content-between">
                      <span>
                        <strong>Plus 2</strong>
                      </span>
                      <span>Academic Session 2081-82 [+2]</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5 mb-5 mb-xl-10">
          <div className="row mb-5 mb-xl-8 g-5 g-xl-8">
            {menuItems.map((item: MenuItem, index: number) => (
              <div key={index} className="col-4">
                <div className="card card-stretch h-100">
                  <a
                    href={item.route}
                    className="btn btn-flex btn-text-gray-800 btn-icon-gray-400 btn-active-color-primary bg-body flex-column justfiy-content-between align-items-center text-start w-100 p-10"
                  >
                    <Icon name={item.icon} className={"svg-icon-4x mb-5"} />

                    <span className="fs-4 fw-bolder text-center">
                      {item.title}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-xl-3 mb-5 mb-xl-10">sdfsdf</div>
      </div>
    </>
  );
};

export default Dashboard;
