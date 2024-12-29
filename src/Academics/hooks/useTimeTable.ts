import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import timeTableService, {
  TimetableFormValues,
  TimeTableInterface,
} from "../services/timeTableServic";
import { PaginationProps } from "../../components/Pagination/Pagination";
import { CanceledError } from "../../services/apiClient";

const useTimeTable = ({
  search = "",
  currentPage = 2,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [timeTables, setTimeTables] = useState<TimeTableInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeTable, setTimeTable] = useState<TimetableFormValues | undefined>(
    undefined
  );

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
      timeTableService.getAll<ApiResponseInterface<TimeTableInterface>>(params);

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

  // Fetch the one timetable by id
  const getOneTimeTable = (id: number) => {
    const { request, cancel } =
      timeTableService.getOne<ApiResponseInterface<TimetableFormValues>>(id);

    request
      .then((result) => {
        console.log("time table one", result.data.data); // Logs the object
        setTimeTable(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => cancel();
  };

  return {
    error,
    isLoading,
    timeTables,
    pagination,
    edgeLinks,
    itemsPerPage,
    timeTable,
    setIsLoading,
    setError,
    setTimeTable,
    setTimeTables,
    setPagination,
    getOneTimeTable,
  };
};

export default useTimeTable;
