import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import DrawerModal from "../../../../components/DrawerModal/DrawerModal";
import gradeService, {
  GradeInterface,
  SingleGradeInterface,
} from "../../../services/gradeService";
import { useEffect, useState } from "react";
import useSubject from "../../../hooks/useSubject";
import useDebounce from "../../../../hooks/useDebounce";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import Loading from "../../../../components/Loading/Loading";
import toast from "react-hot-toast";
import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import Pagination from "../../../../components/Pagination/Pagination";
import AddSubject from "./AddSubject";
import UpdateRank from "./UpdateRank";

const Subject = () => {
  const navigate = useNavigate();
  useDocumentTitle("All Grade Subjects");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay

  const { gradeId } = useParams<{ gradeId: string }>();
  const [grade, setGrade] = useState<GradeInterface>();

  const [processingSubjectId, setProcessingSubjectId] = useState<number | null>(
    null
  );

  const [addSubjectDrawer, setAddSubjectDrawer] = useState(false);
  const [editSubjectDrawer, setEditSubjectDrawer] = useState(false);
  const [updateRankDrawer, setUpdateRankDrawer] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const toggleAddSubjectDrawer = () => {
    setAddSubjectDrawer(!addSubjectDrawer);
  };

  const toggleUpdateRankDrawer = () => {
    setUpdateRankDrawer(!updateRankDrawer);
  };

  const toggleEditSubjectDrawer = () => {
    setEditSubjectDrawer(!editSubjectDrawer);
  };

  const {
    subjects,
    pagination,
    isLoading,
    setLoading,
    changeSubjectStatus,
    edgeLinks,
  } = useSubject({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
    grade_id: gradeId ? Number(gradeId) : -1,
  });

  useEffect(() => {
    setLoading(true);
    if (gradeId !== undefined) {
      const id = Number(gradeId);
      if (!isNaN(id)) {
        const request = gradeService.item<SingleGradeInterface>({
          id,
        });
        request.then((result) => {
          setGrade(result.data.data);
          setLoading(false);
        });
      } else {
        navigate("/404");
      }
    } else {
      navigate("/404");
    }
  }, [gradeId, navigate, setLoading]);

  const toggleSubjectStatus = async (subjectId: number) => {
    try {
      setProcessingSubjectId(subjectId);
      console.log(subjectId);
      await changeSubjectStatus({ id: subjectId });
      toast.success(" Subject Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating Subject status:", error);
    } finally {
      setProcessingSubjectId(null);
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>All Subjects of {grade?.name}</h3>
          </div>
          <div className="card-toolbar">
            <div className="d-flex gap-2 align-items-center justify-content-end">
              <div className="d-flex align-items-center position-relative h-100">
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
                  placeholder="Search Subjects"
                />
              </div>

              <select
                className="form-control w-50px"
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
                onClick={toggleAddSubjectDrawer}
              >
                <Icon name="add" className="svg-icon svg-icon-2" />
                Add Subject
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleUpdateRankDrawer}
              >
                <Icon name="sync" className="svg-icon svg-icon-2" />
                Update Rank
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isLoading && <Loading />}
          {!isLoading && (
            <table
              className="table align-middle table-row-dashed fs-6 gy-5 w-100"
              id="kt_table_users"
            >
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="w-50px">Rank</th>

                  <th className="w-250px">Subject Name</th>
                  <th className="w-125px">Subject Type</th>
                  <th className="w-125px">Subject Code</th>
                  <th className="min-w-125px">Subject Educator</th>
                  <th className="text-center">Is Chooseable</th>
                  <th className="w-55px">Status</th>
                  <th className="text-end w-100px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-bold">
                {subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.rank}</td>

                    <td>
                      <span className="">
                        <span>
                          <span>{subject.name}</span>
                          <span className="text-danger">
                            {" "}
                            <small>[CH: {subject.credit_hour}]</small>
                          </span>
                        </span>
                        <br />
                      </span>
                    </td>
                    <td>{subject.subject_type?.name}</td>
                    <td className="text-center">
                      <span className="badge badge-info">
                        TH:{subject.code.split(",")[0]}
                      </span>
                      <span className="badge badge-info">
                        PR: {subject.code.split(",")[1]}
                      </span>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="badge badge-primary remove-teacher"
                      >
                        <span className="educator-name">BIMITA ACHARYA</span>
                      </a>

                      <a href="#" className="badge badge-danger">
                        +
                      </a>
                    </td>
                    <td className="text-center">
                      {subject.is_chooseable ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-danger">NO</span>
                      )}
                    </td>

                    <td className="text-center">
                      <ProcessingButton
                        isProcessing={processingSubjectId === subject.id}
                        isActive={subject.is_active ?? false}
                        onClick={() => toggleSubjectStatus(subject.id ?? 0)}
                        hoverText={
                          subject.is_active ? "Deactivate" : "Activate"
                        }
                        activeText="Active"
                        inactiveText="Inactive"
                      />
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-light-danger btn-sm"
                        title="Edit"
                      >
                        <Icon name="edit" className="svg-icon" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card-footer">
          {pagination && (
            <Pagination
              pagination={pagination}
              edgeLinks={edgeLinks}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <DrawerModal
        isOpen={addSubjectDrawer}
        onClose={toggleAddSubjectDrawer}
        position="right"
        width="900px"
        title="Add Subject"
      >
        <AddSubject grade={grade} onSave={toggleAddSubjectDrawer} />
      </DrawerModal>

      <DrawerModal
        isOpen={updateRankDrawer}
        onClose={toggleUpdateRankDrawer}
        position="right"
        width="500px"
        title="Update Subject Rank"
      >
        <UpdateRank subjects={subjects} onSave={toggleUpdateRankDrawer} />
      </DrawerModal>
    </>
  );
};

export default Subject;
