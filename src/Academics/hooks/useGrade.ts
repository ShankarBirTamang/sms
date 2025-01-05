import {
  AddGradeInterface,
  GradeInterface,
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
import toast from "react-hot-toast";

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
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    }
  };

  const getGrade = useCallback(
    async (gradeId: number): Promise<GradeInterface | null> => {
      try {
        const { request } =
          gradeService.getOne<ApiResponseInterface<GradeInterface>>(gradeId);
        const result = await request;
        const grade = Array.isArray(result.data.data)
          ? result.data.data[0]
          : result.data.data;

        return grade || null;
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("An unknown error occurred.");
          setError("An unknown error occurred.");
        }
        return null;
      }
    },
    []
  );
  interface SetClassTeacher {
    gradeId: number;
    data: any;
  }

  const setClassTeacher = async ({ gradeId, data }: SetClassTeacher) => {
    await axiosInstance.post(
      `academics/grades/${gradeId}/set-class-teacher`,
      data
    );
  };

  const getSectionStudents = useCallback(async (sectionId: number) => {
    try {
      const result = await axiosInstance.get(
        `academics/grades/section/${sectionId}/students`
      );

      return result.data;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    }
  }, []);

  interface SetStudentRollNo {
    gradeId: number;
    data: { id: number; roll: string }[];
  }

  const setStudentRollNo = async ({ gradeId, data }: SetStudentRollNo) => {
    try {
      const result = await axiosInstance.post(
        `academics/grades/${gradeId}/set-student-roll-no`,
        data
      );
      toast.success(result.data.message);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    }
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
    getSectionStudents,
    getGrade,
    setStudentRollNo,
  };
};

export default useGrade;
