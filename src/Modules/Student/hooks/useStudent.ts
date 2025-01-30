import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import studentService, {
  AddStudentInterface,
  StudentInterface,
} from "../services/studentService";
import toast from "react-hot-toast";

const useStudent = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [students, setStudents] = useState<StudentInterface[]>([]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      studentService.getAll<ApiResponseInterface<StudentInterface>>(params);
    request
      .then((result) => {
        setStudents(result.data.data);
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
    fetchStudents();
  }, [fetchStudents]);

  const getSingleStudent = async (id: number) => {
    try {
      const student = await studentService.item<{ id: number }>({ id });
      return student.data;
    } catch (error) {
      console.error("Error fetching single student:", error);
      throw error;
    }
  };

  const saveStudent = async (data: AddStudentInterface) => {
    try {
      const result = await studentService.create<AddStudentInterface>(data);
      // setStudents([...students, result.data.data]);
      fetchStudents();
      return result.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    }
  };

  return {
    students,
    pagination,
    isLoading,
    error,
    edgeLinks,
    getSingleStudent,
    fetchStudents,
    saveStudent,
  };
};

export default useStudent;
