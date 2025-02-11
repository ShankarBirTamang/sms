import { useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import gradeGroupService, {
  GradeGroupInterface,
  UpdateGradeGroupInterface,
} from "../services/gradeGroupService";
const useGradeGroup = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [gradeGroups, setGradeGroups] = useState<UpdateGradeGroupInterface[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

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
      gradeGroupService.getAll<ApiResponseInterface<UpdateGradeGroupInterface>>(
        params
      );

    request
      .then((result) => {
        setGradeGroups(result.data.data);
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

  const saveGradeGroup = async ({ name, description }: GradeGroupInterface) => {
    const params = {
      name,
      description,
    };

    try {
      const result = await gradeGroupService.create<GradeGroupInterface>(
        params
      );
      // Update state only after successful creation
      setGradeGroups([...gradeGroups, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateGradeGroup = async ({
    id,
    name,
    description,
  }: UpdateGradeGroupInterface) => {
    const params = {
      id,
      name,
      description,
    };
    const originalGradeGroup = [...gradeGroups];

    try {
      console.log("Original:", originalGradeGroup);

      const result = await gradeGroupService.update<UpdateGradeGroupInterface>(
        params
      );
      setGradeGroups(
        gradeGroups.map((level) =>
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
    gradeGroups,
    error,
    isLoading,
    setError,
    setGradeGroups,
    pagination,
    edgeLinks,
    currentPage,
    saveGradeGroup,
    updateGradeGroup,
  };
};

export default useGradeGroup;
