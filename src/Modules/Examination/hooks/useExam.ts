import { useCallback, useEffect, useState } from "react";
import {
    ApiResponseInterface,
    PaginationAndSearch,
  } from "../../../Interface/Interface";

import { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import examSessionService,{ ExamSessionInterface,CreateExamInterface } from "../services/examSessionService";


const useExam = ({
    search = "",
    currentPage = 1,
    itemsPerPage = null,
  }: PaginationAndSearch) => {
    
    const [examinations , setExaminations] = useState<ExamSessionInterface[]>([]);


    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false); // State to track status changes
    
    
    // For Pagination
  const [pagination, setPagination] =
  useState<PaginationProps["pagination"]>(null);
const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
//end for Pagination

const fetchExam = useCallback(async() => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }
    const {request , cancel } = examSessionService.getAll<ApiResponseInterface<ExamSessionInterface>>(params);

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
  name ,
  start_date,
  start_date_np,
  end_date,
  end_date_np,
  result_date,
  result_date_np,
  has_symbol_no ,
  has_registration_no ,
  academic_session_id ,
  grades ,
  is_merged ,
  merged_exams ,
  admit_card_id,
  marksheet_id 
}:CreateExamInterface)=>{
    const params = {
      name ,
      start_date,
      start_date_np,
      end_date,
      end_date_np,
      result_date,
      result_date_np,
      has_symbol_no ,
      has_registration_no ,
      academic_session_id ,
      grades ,
      is_merged ,
      merged_exams ,
      admit_card_id,
      marksheet_id 
    }
    try {
            const result =
              await examSessionService.create<CreateExamInterface>(params);
            // Update state only after successful creation
           
            // setExaminations([...examinations,result.data.data]);
            console.log("use Exam");
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred.");
            }
          }
}

  return {
    isLoading,pagination,edgeLinks,error , examinations ,setStatusChanged, 
    fetchExam,
    setExaminations ,createExam
  }
}

export default useExam
