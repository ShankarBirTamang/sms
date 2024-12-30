import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import academicSessionService, {
  AcademicSessionInterface,
  ChangeAcademicSessionStatusInterface,
  UpdateAcademicSessionInterface,
} from "../services/examSessionService";

import { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";

const useExamSession = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [academicSessions, setAcademicSessions] = useState<
    UpdateAcademicSessionInterface[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false); // State to track status changes

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
  }, [search, currentPage, itemsPerPage, statusChanged]);

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
    // const originalAcademicLevel = [...academicSessions];

    try {
      const result =
        await academicSessionService.update<UpdateAcademicSessionInterface>(
          params
        );
      setAcademicSessions(
        academicSessions.map((session) =>
          session.id === result.data.data.id ? result.data.data : session
        )
      );
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

  const changeAcademicSessionStatus = async ({
    id,
  }: ChangeAcademicSessionStatusInterface) => {
    try {
      // Update the status of the academic session
      await academicSessionService.changeStatus<ChangeAcademicSessionStatusInterface>(
        {
          id,
        }
      );
    } catch (error) {
      console.error("Error changing academic session status:", error);
    } finally {
      setStatusChanged((prev) => !prev);
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
    changeAcademicSessionStatus,
  };
};

export default useExamSession;
