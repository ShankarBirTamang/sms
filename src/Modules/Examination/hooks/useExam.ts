import { useCallback, useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";

import axiosInstance, { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import examSessionService, {
  ExamSessionInterface,
  CreateExamInterface,
  ExamGradeSubject,
  CreateExamGradeSubject,
} from "../services/examSessionService";
import toast from "react-hot-toast";

const useExam = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [examinations, setExaminations] = useState<ExamSessionInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false); // State to track status changes

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  //end for Pagination

  const fetchExam = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }
    const { request, cancel } =
      examSessionService.getAll<ApiResponseInterface<ExamSessionInterface>>(
        params
      );

    request
      .then((result) => {
        setExaminations(result.data.data);
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

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  const createExam = async ({
    name,
    start_date,
    start_date_np,
    end_date,
    end_date_np,
    result_date,
    result_date_np,
    has_symbol_no,
    has_registration_no,
    academic_session_id,
    grades,
    is_merged,
    merged_exams,
    admit_card_id,
    marksheet_id,
    marks_schemes,
  }: CreateExamInterface) => {
    const params = {
      name,
      start_date,
      start_date_np,
      end_date,
      end_date_np,
      result_date,
      result_date_np,
      has_symbol_no,
      has_registration_no,
      academic_session_id,
      grades,
      is_merged,
      merged_exams,
      admit_card_id,
      marksheet_id,
      marks_schemes,
    };
    try {
      const result = await examSessionService.create<CreateExamInterface>(
        params
      );
      // Update state only after successful creation

      // setExaminations([...examinations,result.data.data]);
      // console.log("use Exam");
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response: { data: { errors: string } } };
        setError(axiosError.response.data.errors);
        console.log(axiosError.response);
      } else {
        toast.error("Unknown Error Occured");
      }
    }
  };

  const addExamGradeSubject = async (data: CreateExamGradeSubject) => {
    try {
      const result = await axiosInstance.post(
        "examination/exam/assign-exam-grade-subjects",
        data
      );

      toast.success("Subjects assigned Successfully.");
      return result.data.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response: { data: { errors: string } } };
        setError(axiosError.response.data.errors);
        console.log(axiosError.response);
      } else {
        toast.error("Unknown Error Occured");
      }
    }
  };

  return {
    isLoading,
    pagination,
    edgeLinks,
    error,
    examinations,
    setStatusChanged,
    fetchExam,
    setExaminations,
    createExam,
    addExamGradeSubject,
  };
};

export default useExam;
