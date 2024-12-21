import { useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import studentService, { StudentInterface } from "../services/studentService";
import { number } from "zod";

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

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
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

    return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const getSingleStudent = async (id: number) => {
    try {
      const student = await studentService.item<{ id: number }>({ id });
      return student.data;
    } catch (error) {
      console.error("Error fetching single student:", error);
      throw error;
    }
  };

  return {
    students,
    pagination,
    isLoading,
    error,
    edgeLinks,
    getSingleStudent,
  };
};

export default useStudent;
