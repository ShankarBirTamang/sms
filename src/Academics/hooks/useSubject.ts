import subjectService, {
  changeSubjectStatusInterface,
  EditSubjectInterface,
  SubjectInterface as OriginalSubjectInterface,
  UpdateRankData,
  UpdateSubjectInterface,
} from "./../services/subjectService";

import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../services/apiClient";
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

interface SubjectInterface extends OriginalSubjectInterface {
  id: number;
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

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [subjects, setSubjects] = useState<SubjectInterface[]>([]);
  const [statusChanged, setStatusChanged] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search,
      grade_id,
      withInactive,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    try {
      const { request } =
        subjectService.getAll<ApiResponseInterface<SubjectInterface>>(params);
      const result = await request;
      console.log(result);

      setSubjects(result.data.data);
      setPagination(result.data.meta);
      setEdgeLinks(result.data.links);
    } catch (err) {
      if (err instanceof CanceledError) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, itemsPerPage, grade_id, withInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData, statusChanged]);

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

  const updateSubject = async ({
    id,
    name,
    code,
    credit_hour,
    subject_type_id,
    is_chooseable,
    is_section_specific,
    sections,
  }: EditSubjectInterface) => {
    const params = {
      id,
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
      const result = await subjectService.update<EditSubjectInterface>(params);
      console.log("result at line 125 in hooks/useSubject.ts:", result);
      setSubjects(
        subjects.map((subject) =>
          subject.id === result.data.data.id ? result.data.data : subject
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      toast.success("Subject Updated Successfully.");
    }
  };

  const changeSubjectStatus = async ({ id }: changeSubjectStatusInterface) => {
    try {
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

  const updateSubjectRank = async (data: UpdateRankData) => {
    try {
      await axiosInstance.post("academics/subjects/update-rank", data);
      toast.success("Subject Rank Updated Successfully.");
    } catch (error) {
      console.error("Error Updating Subject Rank:", error);
    }
  };

  interface SetSubjectTeacher {
    subjectId: number;
    data: {
      teacherId: number;
      sections: string[];
    }[];
  }

  const assignSubjectTeacher = async ({
    subjectId,
    data,
  }: SetSubjectTeacher) => {
    console.log(
      "data at line 169 in hooks/useSubject.ts:",
      JSON.stringify(data),
      subjectId
    );

    try {
      // academics/subjects/{id}/assign-subject-teacher
      await axiosInstance.post(
        `academics/subjects/${subjectId}/assign-subject-teacher`,
        data
      );
      toast.success("Subject Teacher Assigned Successfully.");
    } catch (error) {
      toast.error(`Error Updating Subject Rank: ${error}`);
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
    updateSubjectRank,
    updateSubject,
    fetchData,
    assignSubjectTeacher,
  };
};

export default useSubject;
