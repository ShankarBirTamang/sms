import {
  AddGradeInterface,
  UpdatedGradeInterface,
} from "./../services/gradeService";
import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import gradeService, { UpdateGradeInterface } from "../services/gradeService";

const useGrade = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [grades, setGrades] = useState<UpdateGradeInterface[]>([]);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      gradeService.getAll<ApiResponseInterface<UpdateGradeInterface>>(params);
    request
      .then((result) => {
        setGrades(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
  }, [search, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const saveGrade = async ({
    academic_session_id,
    grade_group_id,
    name,
    short_name,
    hasFaculties,
    sectionType,
    facultySections,
    sections,
  }: AddGradeInterface) => {
    const params = {
      academic_session_id,
      grade_group_id,
      name,
      short_name,
      hasFaculties,
      sectionType,
      facultySections,
      sections,
    };

    try {
      const result = await gradeService.create<AddGradeInterface>(params);
      setGrades([...grades, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateGrade = async (
    id: number,
    {
      academic_session_id,
      grade_group_id,
      name,
      short_name,
      hasFaculties,
      sectionType,
      facultySections,
      sections,
    }: UpdatedGradeInterface
  ) => {
    const params = {
      id,
      academic_session_id,
      grade_group_id,
      name,
      short_name,
      hasFaculties,
      sectionType,
      facultySections,
      sections,
    };
    try {
      const result = await gradeService.update<UpdatedGradeInterface>(params);
      setGrades(
        grades.map((grade) => (grade.id === id ? result.data.data : grade))
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  interface SetClassTeacher {
    gradeId: number;
    data: any;
  }

  const setClassTeacher = async ({ gradeId, data }: SetClassTeacher) => {
    console.log("data at line 127 in hooks/useGrade.ts:", data);
    const result = await axiosInstance.post(
      `academics/grades/${gradeId}/set-class-teacher`,
      data
    );
    console.log("result at line 134 in hooks/useGrade.ts:", result);
  };

  return {
    grades,
    fetchGrades,
    error,
    setError,
    isLoading,
    pagination,
    edgeLinks,
    currentPage,
    saveGrade,
    updateGrade,
    setClassTeacher,
  };
};

export default useGrade;
