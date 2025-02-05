import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import DrawerModal from "../../../../components/DrawerModal/DrawerModal";
import gradeService, {
  GradeInterface,
  SingleGradeInterface,
  TeacherInterface,
  UpdateGradeInterface,
} from "../../../services/gradeService";
import useSubject from "../../../hooks/useSubject";
import useDebounce from "../../../../hooks/useDebounce";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import Loading from "../../../../components/Loading/Loading";
import toast from "react-hot-toast";
import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import Pagination from "../../../../components/Pagination/Pagination";
import AddSubject from "./AddSubject";
import UpdateRank from "./UpdateRank";
import {
  SubjectInterface,
  UpdateSubjectInterface,
} from "../../../services/subjectService";
import SubjectTeacher from "../Drawers/SubjectTeacher";
import useEmployee from "../../../../Modules/Employee/hooks/useEmployee";
import EditSubject from "./EditSubject";

const Subject = () => {
  const navigate = useNavigate();
  useDocumentTitle("All Grade Subjects");
  const { gradeId } = useParams<{ gradeId: string }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [grade, setGrade] = useState<GradeInterface>();
  const [processingSubjectId, setProcessingSubjectId] = useState<number | null>(
    null
  );
  const [editSubject, setEditSubject] = useState<UpdateSubjectInterface>();
  const [addTeacherSubject, setAddTeacherSubject] =
    useState<SubjectInterface>();
  const [teachers, setTeachers] = useState<TeacherInterface[]>([]);

  const [addSubjectDrawer, setAddSubjectDrawer] = useState(false);
  const [editSubjectDrawer, setEditSubjectDrawer] = useState(false);
  const [updateRankDrawer, setUpdateRankDrawer] = useState(false);
  const [subjectTeacherDrawer, setSubjectTeacherDrawer] = useState(false);

  const { employees } = useEmployee({});
  const {
    subjects,
    pagination,
    isLoading,
    setLoading,
    changeSubjectStatus,
    edgeLinks,
    fetchData,
  } = useSubject({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
    grade_id: gradeId ? Number(gradeId) : -1,
  });

  const filteredTeachers = useMemo(
    () =>
      employees
        .filter((employee) => employee.employee_type?.name === "Teacher")
        .map((teacher) => ({
          value: teacher.id,
          label: teacher.full_name,
        })),
    [employees]
  );

  useEffect(() => {
    setTeachers(filteredTeachers);
  }, [filteredTeachers]);

  useEffect(() => {
    const fetchGradeData = async () => {
      if (!gradeId) {
        navigate("/404");
        return;
      }

      const id = Number(gradeId);
      if (isNaN(id)) {
        navigate("/404");
        return;
      }

      try {
        const result = await gradeService.item<SingleGradeInterface>({ id });
        setGrade(result.data.data);
      } catch (error) {
        console.error("Error fetching grade data:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchGradeData();
  }, [gradeId, navigate, setLoading]);

  const toggleDrawer = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      fetchData?: () => void
    ) => {
      setter((prev) => {
        if (prev && fetchData) fetchData();
        return !prev;
      });
    },
    []
  );

  const toggleSubjectStatus = useCallback(
    async (subjectId: number) => {
      try {
        setProcessingSubjectId(subjectId);
        await changeSubjectStatus({ id: subjectId });
        toast.success("Subject Status Changed Successfully.");
      } catch (error) {
        console.error("Error updating Subject status:", error);
      } finally {
        setProcessingSubjectId(null);
      }
    },
    [changeSubjectStatus]
  );

  const handlePageChange = useCallback(
    (page: number) => setCurrentPage(page),
    []
  );
  const handleItemsPerPageChange = useCallback((value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  // const toggleAddSubjectDrawer = () => {
  //   setAddSubjectDrawer(!addSubjectDrawer);
  //   if (addSubjectDrawer) {
  //     fetchData();
  //   }
  // };

  // const toggleUpdateRankDrawer = () => {
  //   setUpdateRankDrawer(!updateRankDrawer);
  //   if (updateRankDrawer) {
  //     fetchData();
  //   }
  // };

  const toggleEditSubjectDrawer = (subject?: UpdateSubjectInterface) => {
    setEditSubject(subject);
    setEditSubjectDrawer(!editSubjectDrawer);
    if (editSubjectDrawer) {
      fetchData();
    }
  };

  const toggleSubjectTeacherDrawer = (subject?: SubjectInterface) => {
    setAddTeacherSubject(subject);
    setSubjectTeacherDrawer(!subjectTeacherDrawer);
    if (subjectTeacherDrawer) {
      fetchData();
    }
  };

  if (!grade) return <Loading />;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>All Subjects of {grade.name}</h3>
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
                onClick={() => toggleDrawer(setAddSubjectDrawer, fetchData)}
              >
                <Icon name="add" className="svg-icon svg-icon-2" />
                Add Subject
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => toggleDrawer(setUpdateRankDrawer, fetchData)}
              >
                <Icon name="sync" className="svg-icon svg-icon-2" />
                Update Rank
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <Loading />
          ) : (
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
                  <th className="min-w-125px">Subject Teacher</th>
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
                        <div className="d-flex flex-wrap gap-2">
                          {subject.sections &&
                            subject.sections?.length > 0 &&
                            subject.sections.map((section, s) => (
                              <span className="badge badge-primary badge-sm">
                                {section.faculty &&
                                  section.faculty.name !== "General" &&
                                  `${section.faculty.name} : `}{" "}
                                {section.name}
                              </span>
                            ))}
                        </div>
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
                      <div className="d-flex gap-1 flex-wrap">
                        {subject.teachers?.map((teacher, t) => (
                          <span
                            key={`${index}-${t}`}
                            className="badge badge-primary cursor-pointer"
                            onClick={() => toggleSubjectTeacherDrawer(subject)}
                          >
                            {teacher.name}
                            {teacher.sections?.map((section, s) => (
                              <React.Fragment key={s}>
                                | {section.name}{" "}
                              </React.Fragment>
                            ))}
                          </span>
                        ))}
                        <a
                          href="#"
                          className="badge badge-danger"
                          onClick={() => toggleSubjectTeacherDrawer(subject)}
                        >
                          +
                        </a>
                      </div>
                    </td>
                    <td className="text-center">
                      {subject.is_chooseable ? (
                        <>
                          <span className="badge badge-success">Yes</span>
                          <br />
                          <a href={`students/subjects`}>
                            <span className="badge badge-primary pointer hover hover-scale">
                              Assign Students
                            </span>
                          </a>
                        </>
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
                        onClick={() => toggleEditSubjectDrawer(subject)}
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
        onClose={() => toggleDrawer(setAddSubjectDrawer, fetchData)}
        position="right"
        width="900px"
        title="Add Subject"
      >
        <AddSubject
          grade={grade}
          onSave={() => toggleDrawer(setAddSubjectDrawer, fetchData)}
        />
      </DrawerModal>
      {editSubject && (
        <DrawerModal
          isOpen={editSubjectDrawer}
          onClose={() => toggleDrawer(setEditSubjectDrawer, fetchData)}
          position="right"
          width="900px"
          title="Update Subject"
        >
          <EditSubject
            grade={grade}
            onSave={() => toggleDrawer(setEditSubjectDrawer, fetchData)}
            subject={editSubject}
          />
        </DrawerModal>
      )}
      {gradeId && (
        <DrawerModal
          isOpen={updateRankDrawer}
          onClose={() => toggleDrawer(setUpdateRankDrawer, fetchData)}
          position="right"
          width="500px"
          title="Update Subject Rank"
        >
          <UpdateRank
            grade_id={Number(gradeId)}
            subjects={subjects}
            onSave={() => toggleDrawer(setUpdateRankDrawer, fetchData)}
          />
        </DrawerModal>
      )}
      {grade && teachers && addTeacherSubject && (
        <DrawerModal
          isOpen={subjectTeacherDrawer}
          onClose={() => toggleDrawer(setSubjectTeacherDrawer, fetchData)}
          position="right"
          width="800px"
          title={`Assign Subject Teachers for ${addTeacherSubject.name}`}
        >
          <SubjectTeacher
            grade={grade as unknown as UpdateGradeInterface}
            subject={addTeacherSubject}
            teachers={teachers}
            onSave={() => toggleDrawer(setSubjectTeacherDrawer, fetchData)}
          />
        </DrawerModal>
      )}
    </>
  );
};

export default Subject;
