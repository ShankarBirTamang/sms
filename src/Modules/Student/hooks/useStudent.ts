import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../../services/apiClient";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import studentService, {
  AddStudentGuardianInterface,
  AddStudentInterface,
  EditStudentGuardianInterface,
  EditStudentInterface,
  StudentGuardianInterface,
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

  const getSingleStudent = useCallback(async (id: number) => {
    try {
      const student = await studentService.item<{ id: number }>({ id });
      return student.data;
    } catch (error) {
      console.error("Error fetching single student:", error);
      throw error;
    }
  }, []);

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

  const updateStudent = async (data: EditStudentInterface) => {
    try {
      const result = await studentService.update<EditStudentInterface>(data);
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

  const createGuardian = async (data: AddStudentGuardianInterface) => {
    try {
      const result = await axiosInstance.post<StudentGuardianInterface>(
        "/student-guardians",
        data
      );
      const guardian = Array.isArray(result.data)
        ? result.data[0]
        : result.data;
      toast.success("Guardian added successfully.");
      return guardian;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const updateGuardian = async (data: EditStudentGuardianInterface) => {
    try {
      const result = await axiosInstance.put<StudentGuardianInterface>(
        `/student-guardians/${data.id}`,
        data
      );
      const guardian = Array.isArray(result.data)
        ? result.data[0]
        : result.data;
      toast.success("Guardian updated successfully.");
      return guardian;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
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
    updateStudent,
    createGuardian,
    updateGuardian,
  };
};

export default useStudent;
