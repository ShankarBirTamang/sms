import { useEffect, useState } from "react";
import academicLevelService, {
  CreateAcademicLevelInterface,
  UpdateAcademicLevelInterface,
} from "../services/academicLevelService";
import { CanceledError } from "../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";

const useAcademicLevels = ({
  search = "",
  currentPage = 2,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [academicLevels, setAcademicLevels] = useState<
    UpdateAcademicLevelInterface[]
  >([]);
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
      academicLevelService.getAll<
        ApiResponseInterface<UpdateAcademicLevelInterface>
      >(params);

    request
      .then((result) => {
        setAcademicLevels(result.data.data);
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

  const saveAcademicLevel = async ({
    name,
    description,
  }: CreateAcademicLevelInterface) => {
    const params = {
      name,
      description,
    };

    try {
      const result =
        await academicLevelService.create<CreateAcademicLevelInterface>(params);
      // Update state only after successful creation
      setAcademicLevels([...academicLevels, result.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateAcademicLevel = async ({
    id,
    name,
    description,
  }: UpdateAcademicLevelInterface) => {
    const params = {
      id,
      name,
      description,
    };
    const originalAcademicLevel = [...academicLevels];

    try {
      console.log("Original:", originalAcademicLevel);

      const result =
        await academicLevelService.update<UpdateAcademicLevelInterface>(params);
      setAcademicLevels(
        academicLevels.map((level) =>
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
    academicLevels,
    error,
    isLoading,
    setAcademicLevels,
    setError,
    pagination,
    edgeLinks,
    currentPage,
    saveAcademicLevel,
    updateAcademicLevel,
  };
};

export default useAcademicLevels;
