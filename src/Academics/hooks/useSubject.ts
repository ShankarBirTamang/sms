import subjectService, {
  changeSubjectStatusInterface,
  SubjectInterface,
} from "./../services/subjectService";
import { AddGradeInterface } from "./../services/gradeService";
import { useEffect, useState } from "react";
import { CanceledError } from "../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import toast from "react-hot-toast";

interface GradeSubjectProps extends PaginationAndSearch {
  grade_id: number;
  withInactive?: number;
}

const useSubject = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
  grade_id,
  withInactive = 1,
}: GradeSubjectProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [subjects, setSubjects] = useState<SubjectInterface[]>([]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
      grade_id,
      withInactive,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      subjectService.getAll<ApiResponseInterface<SubjectInterface>>(params);
    request
      .then((result) => {
        setSubjects(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, [search, currentPage, itemsPerPage, grade_id, withInactive]);

  const saveSubject = async ({
    name,
    code,
    credit_hour,
    subject_type_id,
    is_chooseable,
    is_section_specific,
    sections,
  }: SubjectInterface) => {
    const params = {
      grade_id,
      name,
      code,
      credit_hour,
      subject_type_id,
      is_chooseable,
      is_section_specific,
      sections,
    };
    try {
      const result = await subjectService.create<SubjectInterface>(params);
      setSubjects([...subjects, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      toast.success("Subject Added Successfully.");
    }
  };

  const changeSubjectStatus = async ({ id }: changeSubjectStatusInterface) => {
    try {
      // Update the status of the academic session
      const result =
        await subjectService.changeStatus<changeSubjectStatusInterface>({
          id,
        });
      setSubjects(
        subjects.map((subject) =>
          subject.id === result.data.data.id ? result.data.data : subject
        )
      );
    } catch (error) {
      console.error("Error changing academic session status:", error);
    }
  };

  return {
    subjects,
    pagination,
    edgeLinks,
    currentPage,
    error,
    isLoading,
    setError,
    setLoading,
    changeSubjectStatus,
    saveSubject,
  };
};

export default useSubject;
