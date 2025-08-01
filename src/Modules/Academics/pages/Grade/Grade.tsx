import React, { useEffect, useState } from "react";
import DrawerModal from "../../../../components/DrawerModal/DrawerModal";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import useGrade from "../../hooks/useGrade";
import useDebounce from "../../../../hooks/useDebounce";
import Loading from "../../../../components/Loading/Loading";
import Pagination from "../../../../components/Pagination/Pagination";
import Icon from "../../../../components/Icon/Icon";
import {
  OldGradeInterface,
  UpdateGradeInterface,
} from "../../services/gradeService";
import { useNavigate } from "react-router-dom";
import AddGrade from "./AddGrade";
import EditGrade from "./EditGrade";
import SetClassTeacher from "./Drawers/SetClassTeacher";

const Grade = () => {
  useDocumentTitle("All Grades");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const [addGradeDrawer, setAddGradeDrawer] = useState(false);
  const [editGradeDrawer, setEditGradeDrawer] = useState(false);
  const [classTeacherDrawer, setClassTeacherDrawer] = useState(false);
  const [oldGrades, setOldGrades] = useState<OldGradeInterface[]>([]);
  const [editGrade, setEditGrade] = useState<UpdateGradeInterface>();

  const { grades, isLoading, pagination, edgeLinks, fetchGrades } = useGrade({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  useEffect(() => {
    if (grades) {
      const updatedGrades = grades.map((grade) => ({
        name: grade.name,
        short_name: grade.short_name,
      }));
      setOldGrades(updatedGrades);
    }
  }, [grades]);

  const navigate = useNavigate();

  const toggleAddGradeDrawer = () => {
    setAddGradeDrawer(!addGradeDrawer);
    if (addGradeDrawer) {
      fetchGrades();
    }
  };

  const toggleEditGradeDrawer = () => {
    setEditGradeDrawer(!editGradeDrawer);
    if (editGradeDrawer) {
      fetchGrades();
    }
  };

  const toggleSetClassTeacherDrawer = () => {
    setClassTeacherDrawer(!classTeacherDrawer);
    if (classTeacherDrawer) {
      fetchGrades();
    }
  };

  // header functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleSetClassTeacherClick = (grade: UpdateGradeInterface) => {
    toggleSetClassTeacherDrawer();
    setEditGrade(grade);
  };
  const handleEditClick = (grade: UpdateGradeInterface) => {
    toggleEditGradeDrawer();
    setEditGrade(grade);
  };

  const handleSubjectNavigate = (gradeId: number) => {
    navigate(`${gradeId}/subjects`);
  };
  const handleStudentsNavigate = (gradeId: number) => {
    navigate(`${gradeId}/students`);
  };
  return (
    <>
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h2>All Grades</h2>
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
                  title="Add Grade"
                  onClick={toggleAddGradeDrawer}
                >
                  <Icon name="add" className="svg-icon" />
                  Add Grade
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {isLoading && <Loading />}
          {!isLoading && grades.length === 0 && (
            <div className="alert alert-info">No Grades Found</div>
          )}

          {!isLoading && grades.length > 0 && (
            <table className="table align-middle table-row-dashed fs-6 gy-1">
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="">SN</th>
                  <th className="min-w-125px">Grade Name</th>
                  <th className="max-w-200px">Sections</th>
                  <th className="min-w-125px text-center">Class Teacher</th>
                  <th className="text-center">Students</th>

                  <th className="text-end min-w-100px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-bold">
                {grades.map((grade, index) => (
                  <tr key={index}>
                    <td>
                      {(currentPage - 1) * (itemsPerPage ?? 1) + index + 1}
                    </td>
                    <td className="">
                      {grade.name} ({grade.short_name})
                    </td>
                    <td>
                      <div className="w-300px">
                        {Object.entries(grade.sections).map(
                          ([sectionGroup, sections], sci) => (
                            <div key={`SEC-${sci}`} className="mb-1">
                              <strong>
                                {sectionGroup.split(",")[0].trim()}:
                              </strong>
                              <div className="d-flex flex-wrap gap-3">
                                {sections.map((section, si) => (
                                  <span
                                    key={`${sectionGroup}-${si}`}
                                    className="badge badge-primary badge-lg p-2 px-4 mb-1"
                                  >
                                    {section.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                    <td className="text-center w-300px">
                      {Object.entries(grade.sections).map(
                        ([sectionGroup, sections], sci) => (
                          <div key={`SEC-${sci}`} className="mb-1">
                            {sections.map((section) =>
                              section.teacher ? (
                                <>
                                  <span className="badge badge-info text-center mb-1 w-auto">
                                    {section.name}: {section.teacher?.full_name}
                                  </span>
                                  <br />
                                </>
                              ) : null
                            )}
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-light-info btn-sm d-inline"
                        title="Set Class Teacher"
                        onClick={() => handleSetClassTeacherClick(grade)}
                      >
                        Set Class Teacher
                      </button>
                    </td>
                    <td className="text-center">{grade.total_students ?? 0}</td>

                    <td className="text-end">
                      <button
                        className="btn btn-light-danger btn-sm"
                        type="button"
                        onClick={() => handleSubjectNavigate(grade.id)}
                      >
                        Subjects
                      </button>
                      <button
                        className="btn btn-light-info btn-sm"
                        type="button"
                        title="Students"
                        onClick={() => handleStudentsNavigate(grade.id)}
                      >
                        Students
                      </button>
                      <button
                        type="button"
                        className="btn btn-light-success btn-sm"
                        title="Edit"
                        onClick={() => handleEditClick(grade)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="card-footer">
          <Pagination
            pagination={pagination}
            edgeLinks={edgeLinks}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <DrawerModal
        isOpen={addGradeDrawer}
        onClose={toggleAddGradeDrawer}
        position="right"
        width="900px"
        title="Add Grade"
      >
        <AddGrade onSave={toggleAddGradeDrawer} oldGrades={oldGrades} />
      </DrawerModal>
      {editGrade && (
        <DrawerModal
          isOpen={editGradeDrawer}
          onClose={toggleEditGradeDrawer}
          position="right"
          width="900px"
          title="Edit Grade Details"
        >
          <EditGrade onSave={toggleEditGradeDrawer} editData={editGrade} />
        </DrawerModal>
      )}
      <DrawerModal
        isOpen={classTeacherDrawer}
        onClose={toggleSetClassTeacherDrawer}
        position="right"
        width="600px"
        title="Set Class Teacher"
      >
        {editGrade && (
          <SetClassTeacher
            onSave={toggleSetClassTeacherDrawer}
            grade={editGrade}
          />
        )}
      </DrawerModal>
    </>
  );
};

export default Grade;
