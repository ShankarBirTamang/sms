import { useCallback, useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import { RoleInterface, rolesRoute } from "../Services/rolesPermissionsService";
import { CanceledError } from "axios";

const useRoles = ({
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

  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      rolesRoute.getAll<ApiResponseInterface<RoleInterface>>(params);
    request
      .then((result) => {
        setRoles(result.data.data);
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
    fetchRoles();
  }, [fetchRoles]);

  return {
    fetchRoles,
    roles,
    error,
    isLoading,
    pagination,
    edgeLinks,
  };
};

export default useRoles;
