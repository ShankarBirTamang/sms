import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import timeTableService, {
  TimeTableInterface,
  UpdateTimeTableInterface,
} from "../services/timeTableServic";
import { PaginationProps } from "../../components/Pagination/Pagination";
import { CanceledError } from "../../services/apiClient";

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
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      timeTableService.getAll<ApiResponseInterface<UpdateTimeTableInterface>>(
        params
      );

    request
      .then((result) => {
        console.log("timetables", result.data.data);
        setTimeTables(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
  }, [search, currentPage, itemsPerPage]);

  // useEffect(() => {
  //   const { request, cancel } = timeTableService.getOne<TimeTableInterface>({
  // })}, [newTimeTableId]);

  // const saveTimeTable = async () => {
  //   const response = await timeTableService.create<TimeTableInterface>(params);
  // };

  return {
    error,
    isLoading,
    timeTables,
    pagination,
    edgeLinks,
    setIsLoading,
    setError,
    setTimeTables,
    setPagination,
  };
};

export default useTimeTable;
