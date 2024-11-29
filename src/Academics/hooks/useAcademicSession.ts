import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import academicSessionService, {
  AcademicSessionInterface,
  UpdateAcademicSessionInterface,
} from "../services/academicSessionService";

import { CanceledError } from "../../services/apiClient";
import { PaginationProps } from "../../components/Pagination/Pagination";

const useAcademicSession = ({
  search = "",
  currentPage = 2,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [academicSessions, setAcademicSessions] = useState<
    UpdateAcademicSessionInterface[]
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
    console.log(itemsPerPage);

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      academicSessionService.getAll<
        ApiResponseInterface<UpdateAcademicSessionInterface>
      >(params);

    request
      .then((result) => {
        setAcademicSessions(result.data.data);
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

  const saveAcademicSession = async ({
    name,
    start_date,
    start_date_np,
    end_date,
    end_date_np,
    academic_level_id,
  }: AcademicSessionInterface) => {
    const params = {
      name,
      start_date,
      start_date_np,
      end_date,
      end_date_np,
      academic_level_id,
    };
    try {
      const result =
        await academicSessionService.create<AcademicSessionInterface>(params);
      // Update state only after successful creation
      setAcademicSessions([...academicSessions, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateAcademicSession = async ({
    id,
    name,
    start_date,
    start_date_np,
    end_date,
    end_date_np,
    academic_level_id,
  }: UpdateAcademicSessionInterface) => {
    const params = {
      id,
      name,
      start_date,
      start_date_np,
      end_date,
      end_date_np,
      academic_level_id,
    };
    const originalAcademicLevel = [...academicSessions];

    try {
      console.log("Original:", originalAcademicLevel);

      const result =
        await academicSessionService.update<UpdateAcademicSessionInterface>(
          params
        );
      setAcademicSessions(
        academicSessions.map((session) =>
          session.id === result.data.data.id ? result.data.data : session
        )
      );
      console.log(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      // console.log(params, result);
    }
  };

  return {
    academicSessions,
    error,
    isLoading,
    setAcademicSessions,
    setError,
    pagination,
    edgeLinks,
    currentPage,
    saveAcademicSession,
    updateAcademicSession,
  };
};

export default useAcademicSession;
