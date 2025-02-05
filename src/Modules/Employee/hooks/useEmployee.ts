import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import employeeService, {
  AddEmployeeInterface,
  EditEmployeeInterface,
  EmployeeInterface,
} from "../services/employeeService";
import toast from "react-hot-toast";

const useEmployee = ({
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

  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      employeeService.getAll<ApiResponseInterface<EmployeeInterface>>(params);
    request
      .then((result) => {
        setEmployees(result.data.data);
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
    fetchEmployees();
  }, [fetchEmployees]);

  const getSingleEmployee = useCallback(async (id: number) => {
    try {
      const employee = await employeeService.item<{ id: number }>({ id });
      return employee.data;
    } catch (error) {
      console.error("Error fetching single employee:", error);
      throw error;
    }
  }, []);

  const saveEmployee = async (data: AddEmployeeInterface) => {
    try {
      const result = await employeeService.create<AddEmployeeInterface>(data);
      fetchEmployees();
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

  const updateEmployee = async (data: EditEmployeeInterface) => {
    try {
      const result = await employeeService.update<EditEmployeeInterface>(data);
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
    employees,
    pagination,
    isLoading,
    error,
    edgeLinks,
    getSingleEmployee,
    fetchEmployees,
    saveEmployee,
    updateEmployee,
  };
};

export default useEmployee;
