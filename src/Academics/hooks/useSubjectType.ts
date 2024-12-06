import { ChangeSubjectTypeStatusInterface } from "./../services/subjectTypeService";
import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";

import { CanceledError } from "../../services/apiClient";
import { PaginationProps } from "../../components/Pagination/Pagination";
import subjectTypeService, {
  SubjectTypeInterface,
  UpdateSubjectTypeInterface,
} from "../services/subjectTypeService";

const useSubjectType = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [subjectTypes, setSubjectTypes] = useState<SubjectTypeInterface[]>([]);

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
      subjectTypeService.getAll<
        ApiResponseInterface<UpdateSubjectTypeInterface>
      >(params);

    request
      .then((result) => {
        setSubjectTypes(result.data.data);
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
  }, [currentPage, itemsPerPage, search, statusChanged]);

  const saveSubjectType = async ({
    name,
    marking_scheme,
    is_marks_added,
  }: SubjectTypeInterface) => {
    const params = {
      name,
      marking_scheme,
      is_marks_added,
    };
    try {
      await subjectTypeService.create<SubjectTypeInterface>(params);
      // Update state only after successful creation
      setStatusChanged((prev) => !prev);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateSubjectType = async ({
    id,
    name,
    marking_scheme,
    is_marks_added,
  }: UpdateSubjectTypeInterface) => {
    const params = {
      id,
      name,
      marking_scheme,
      is_marks_added,
    };
    // const originalAcademicLevel = [...academicSessions];

    try {
      const result =
        await subjectTypeService.update<UpdateSubjectTypeInterface>(params);
      setSubjectTypes(
        subjectTypes.map((type) =>
          type.id === result.data.data.id ? result.data.data : type
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

  const changeSubjectTypeStatus = async ({
    id,
  }: ChangeSubjectTypeStatusInterface) => {
    try {
      // Update the status of the academic session
      const result =
        await subjectTypeService.changeStatus<ChangeSubjectTypeStatusInterface>(
          {
            id,
          }
        );
      setSubjectTypes(
        subjectTypes.map((type) =>
          type.id === result.data.data.id ? result.data.data : type
        )
      );
    } catch (error) {
      console.error("Error changing academic session status:", error);
    }
  };

  return {
    isLoading,
    subjectTypes,
    pagination,
    edgeLinks,
    currentPage,
    saveSubjectType,
    updateSubjectType,
    changeSubjectTypeStatus,
    setError,
  };
};

export default useSubjectType;
