import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { UpdateTimeTableInterface } from "../services/timeTableServic";
import { PaginationProps } from "../../components/Pagination/Pagination";

const useTimeTable = ({
  search = "",
  currentPage = 2,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [timeTables, setTimeTables] = useState<UpdateTimeTableInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  //end for Pagination

  useEffect(() => {
    // setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    // const { request, cancel } =
    //   academicLevelService.getAll<
    //     ApiResponseInterface<UpdateTimeTableInterface>
    //   >(params);

    // request
    //   .then((result) => {
    //     setTimeTable(result.data.data);
    //     setPagination(result.data.meta);
    //     setEdgeLinks(result.data.links);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     if (err instanceof CanceledError) return;
    //     setError(err.message);
    //     setLoading(false);
    //   });
  }, [search, currentPage, itemsPerPage]);

  return {
    error,
    setIsLoading,
    isLoading,
    setError,
    timeTables,
    pagination,
    edgeLinks,
    setTimeTables,
  };
};

export default useTimeTable;
