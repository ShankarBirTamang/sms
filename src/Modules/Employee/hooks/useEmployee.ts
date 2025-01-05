import { useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import employeeService, {
  EmployeeInterface,
} from "../services/employeeService";

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

    return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const getSingleEmployee = async (id: number) => {
    try {
      const employee = await employeeService.item<{ id: number }>({ id });
      return employee.data;
    } catch (error) {
      console.error("Error fetching single employee:", error);
      throw error;
    }
  };

  return {
    employees,
    pagination,
    isLoading,
    error,
    edgeLinks,
    getSingleEmployee,
  };
};

export default useEmployee;
