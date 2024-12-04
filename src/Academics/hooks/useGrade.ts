import { AddGradeInterface } from "./../services/gradeService";
import { useEffect, useState } from "react";
import { CanceledError } from "../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import gradeService, { UpdateGradeInterface } from "../services/gradeService";

const useGrade = ({
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

  const [grades, setGrades] = useState<UpdateGradeInterface[]>([]);

  const [testData, setTestData] = useState<UpdateGradeInterface[]>([]);

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
      gradeService.getAll<ApiResponseInterface<UpdateGradeInterface>>(params);
    request
      .then((result) => {
        setGrades(result.data.data);
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

  const saveGrade = async ({
    academic_session_id,
    grade_group_id,
    name,
    short_name,
    hasFaculties,
    sectionType,
    facultySections,
    sections,
  }: AddGradeInterface) => {
    const params = {
      academic_session_id,
      grade_group_id,
      name,
      short_name,
      hasFaculties,
      sectionType,
      facultySections,
      sections,
    };

    try {
      const result = await gradeService.create<AddGradeInterface>(params);
      // Update state only after successful creation
      setGrades([...grades, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // useEffect(() => {
  //   console.log("Grades:", grades);
  // }, [grades]);

  //end for Pagination
  return {
    grades,
    error,
    setError,
    isLoading,
    pagination,
    edgeLinks,
    currentPage,
    saveGrade,
  };
};

export default useGrade;
