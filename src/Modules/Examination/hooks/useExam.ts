import { useEffect, useState } from "react";
import {
    ApiResponseInterface,
    PaginationAndSearch,
  } from "../../../Interface/Interface";

import { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import { ExamInterface,UpdateExamInterface } from "../services/examSessionService";


const useExam = ({
    search = "",
    currentPage = 1,
    itemsPerPage = null,
  }: PaginationAndSearch) => {
    const [examination , setExamination] = useState<ExamInterface[]>([
      {
        id: 1,
        name: "Exam 1",
        start_date_ad: "2022-01-01",
        start_date_np:"2080-01-01",
        end_date_ad: "2022-02-01",
        end_date_np: "2080-02-01",
        exam_level:"Nursery to 10",
        session : "Academic session 2080",
        is_completed: true
      },
      {
        id: 2,
        name: "Exam 2",
        start_date_ad: "2023-01-01",
        start_date_np: "2081-01-01",
        end_date_ad: "2023-02-01",
        end_date_np: "2081-02-01",
        exam_level: "Nursery to 10",
        session: "Academic session 2081",
        is_completed: false,
        
      },
    ]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false); // State to track status changes
    console.log("Load: ",isLoading);
      // For Pagination
  const [pagination, setPagination] =
  useState<PaginationProps["pagination"]>(null);
const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
//end for Pagination
useEffect(() => {
    // setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }
}, [search, currentPage, itemsPerPage, statusChanged]);
  return {
    isLoading,pagination,edgeLinks,error,examination
  }
}

export default useExam
