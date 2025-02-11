import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import employeeTypeService, {
  AddEmployeeTypeInterface,
  EmployeeTypeInterface,
  UpdateEmployeeTypeInterface,
} from "../services/employeeTypeService";
import { CanceledError } from "axios";

const useEmployeeTypes = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeTypeInterface[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  //end for Pagination

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
      employeeTypeService.getAll<
        ApiResponseInterface<UpdateEmployeeTypeInterface>
      >(params);

    request
      .then((result) => {
        setEmployeeTypes(result.data.data);
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

  const saveEmployeeType = async ({ name }: AddEmployeeTypeInterface) => {
    const params = {
      name,
    };

    try {
      const result = await employeeTypeService.create<AddEmployeeTypeInterface>(
        params
      );
      setEmployeeTypes([...employeeTypes, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateEmployeeType = async ({
    id,
    name,
  }: UpdateEmployeeTypeInterface) => {
    const params = {
      id,
      name,
    };

    try {
      const result =
        await employeeTypeService.update<UpdateEmployeeTypeInterface>(params);
      setEmployeeTypes(
        employeeTypes.map((level) =>
          level.id === result.data.data.id ? result.data.data : level
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };
  return {
    employeeTypes,
    error,
    isLoading,
    setEmployeeTypes,
    setError,
    pagination,
    edgeLinks,
    currentPage,
    saveEmployeeType,
    updateEmployeeType,
  };
};

export default useEmployeeTypes;
