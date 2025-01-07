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
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false); // State to track status changes
    
    
    
    
    
    
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
    isLoading,pagination,edgeLinks,error
  }
}

export default useExam
