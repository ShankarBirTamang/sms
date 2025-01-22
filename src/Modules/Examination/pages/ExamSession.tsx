import { useState } from "react";
import Icon from "../../../components/Icon/Icon";
import useExam from "../hooks/useExam";
import useDebounce from "../../../hooks/useDebounce";
import Loading from "../../../components/Loading/Loading";
import { ExamInterface } from "../services/examSessionService";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";
import DrawerModal from "../../../components/DrawerModal/DrawerModal";
import AddExam from "./Drawers/AddExam";

const ExamSession = () => {
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [addExamDrawer, setAddExamDrawer] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  // const [examination, setExamination] = useState<ExamInterface[]>([
  //   {
  //     id: 1,
  //     name: "Exam 1",
  //     start_date_ad: "2022-01-01",
  //     start_date_np: "2080-01-01",
  //     end_date_ad: "2022-02-01",
  //     end_date_np: "2080-02-01",
  //     exam_level: "Nursery to 10",
  //     session: "Academic session 2080",
  //     is_completed: false,
  //   },
  //   {
  //     id: 2,
  //     name: "Exam 2",
  //     start_date_ad: "2023-01-01",
  //     start_date_np: "2081-01-01",
  //     end_date_ad: "2023-02-01",
  //     end_date_np: "2081-02-01",
  //     exam_level: "Nursery to 10",
  //     session: "Academic session 2081",
  //     is_completed: false,
  //   },
  // ]);
  // const [currentId, setCurrentId] = useState<number | null>(null);

  const toggleCompletionStatus = (id: number) => {
    setExaminations((prevExamination) =>
      prevExamination?.map((exam) =>
        exam.id === id ? { ...exam, is_completed: !exam.is_completed } : exam
      )
    );
  };

  const toggleAddExamDrawer = () => {
    setAddExamDrawer(!addExamDrawer);
  };

  //header functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  //header function ends here

  const { isLoading, pagination, edgeLinks, examinations, setExaminations } =
    useExam({
      search: debouncedSearchTerm,
      currentPage,
      itemsPerPage,
    });

  const navigate = useNavigate();

  const handleNavigate = (examId: number) => {
    navigate(`${examId}/show`);
  };
  console.log("Examinations : ", examinations);
  return (
    <>
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h2>All Examinations</h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center position-relative">
                  <Icon
                    name="searchDark"
                    className="svg-icon svg-icon-1 position-absolute ms-6"
                  />

                  <input
                    type="text"
                    id="data_search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control w-250px ps-14"
                    placeholder="Search Grades"
                  />
                </div>

                <select
                  className="form-control w-50px "
                  title="Items per Page"
                  id="itemsPerPage"
                  value={itemsPerPage ?? "all"}
                  onChange={(e) =>
                    handleItemsPerPageChange(
                      e.target.value === "all" ? null : parseInt(e.target.value)
                    )
                  }
                >
                  <option value="all">All</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  title="Add Exam"
                  onClick={toggleAddExamDrawer}
                >
                  <Icon name="add" className="svg-icon" />
                  Add Examination
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {isLoading && <Loading />}
          {!isLoading && examinations?.length === 0 && (
            <div className="alert alert-info">No Exams Found</div>
          )}
          {!isLoading && examinations?.length !== 0 && (
            <table className="table align-middle table-row-dashed fs-6 gy-1">
              <thead>
                <tr className="text-start  text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="w-50px">S.N.</th>
                  <th className="min-w-200px">Name</th>
                  <th className="w-150px">Level</th>
                  <th className="w-250px">Academic Session</th>
                  <th className="min-w-125px">Start Date</th>
                  <th className="min-w-125px">End Date</th>
                  <th className="w-300px">Status</th>
                  <th className="min-w-125px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-bold">
                {examinations?.map((exam, index) => (
                  <tr key={exam.id}>
                    <td className="align-items-center">{index + 1}</td>
                    <td>{exam.name}</td>
                    <td>{exam.session_level?.level_name}</td>
                    <td>{exam.session_level?.session_name}</td>
                    <td>{exam.start_date_np}</td>
                    <td>{exam.end_date_np}</td>
                    <td className="w-350px g-10">
                      {exam.is_completed ? (
                        <div className="d-flex align-items-center">
                          <span className="badge badge-info fw-bolder p-2">
                            Completed
                          </span>
                          <button
                            className="btn btn-danger btn-sm ms-2 py-1 text-nowrap"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => {
                              toggleCompletionStatus(exam.id ?? 0);
                            }}
                          >
                            Unmark as Completed
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <span className="badge badge-success fw-bolder p-2">
                            Processing
                          </span>
                          <button
                            className="btn btn-danger btn-sm ms-2 py-1 text-nowrap"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => {
                              toggleCompletionStatus(exam.id ?? 0);
                            }}
                          >
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2">
                        <button
                          title="Edit Exam Session"
                          type="button"
                          // onClick={() => handleEditClick(exam)}
                          className="btn btn-light-info btn-icon btn-sm"
                        >
                          <Icon name={"edit"} className={"svg-icon"} />
                        </button>
                        <button
                          title="View Details"
                          type="button"
                          onClick={() => handleNavigate(exam.id ?? 0)}
                          className="btn btn-sm btn-light-success btn-icon"
                        >
                          <Icon name={"eye"} className={"svg-icon"} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="card-footer">
          {pagination && (
            <Pagination
              pagination={pagination}
              edgeLinks={edgeLinks}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <DrawerModal
          isOpen={addExamDrawer}
          onClose={toggleAddExamDrawer}
          position="right"
          width="900px"
          title="EXAMINATION DETAILS"
        >
          <AddExam onSave={toggleAddExamDrawer} />
        </DrawerModal>
      </div>
    </>
  );
};

export default ExamSession;
