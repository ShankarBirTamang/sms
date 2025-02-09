import { useEffect, useState } from "react";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import timeTableService, {
  TimetableFormValues,
  UpdateTimetableFormValues,
  UpdateTimeTableInterface,
} from "../services/timeTableServic";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import { CanceledError } from "../../../services/apiClient";
import toast from "react-hot-toast";

const useTimeTable = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [timeTables, setTimeTables] = useState<UpdateTimeTableInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeTable, setTimeTable] = useState<TimetableFormValues | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false); // State to track status changes

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

  // Fetch the one timetable by id
  const getOneTimeTable = (id: number) => {
    const { request, cancel } =
      timeTableService.getOne<ApiResponse<TimetableFormValues>>(id);

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

  const saveTimeTable = async (data: TimetableFormValues) => {
    setIsLoadingSave(true);
    try {
      const result = await timeTableService.create<TimetableFormValues>(data);
      toast.success("Time-Table Added Successfully");
      console.log("TimeTable Added Successfully", result);
      return result;
    } catch (err) {
      console.log("error", err);
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Failed to add Time Table");
      } else {
        toast.error("Failed to add Time Table");
      }
    } finally {
      setIsLoadingSave(false);
    }
  };

  const updateTimeTable = async (data: TimetableFormValues) => {
    setIsLoadingUpdate(true);
    try {
      console.log("Data to be submitted", data);
      const result = await timeTableService.update<UpdateTimetableFormValues>(
        data
      );
      toast.success("Time-Table Updated Successfully");
      setIsLoadingUpdate(false);
      return result;
    } catch (error) {
      toast.error("Failed to update Time Table");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const changeTimeTableStatus = async (id: number) => {
    try {
      console.log("id during changing Timetable Status", id);
      const result = await timeTableService.changeStatus({ id });
      console.log("result during changing Timetable Status", result);
    } catch (error) {
      console.log("error changing Timetable Status", error);
    } finally {
      setStatusChanged((prev) => !prev);
    }
  };

  return {
    error,
    isLoading,
    timeTable,
    timeTables,
    pagination,
    edgeLinks,
    itemsPerPage,
    isLoadingSave,
    isLoadingUpdate,
    setIsLoading,
    setError,
    setTimeTable,
    setTimeTables,
    setPagination,
    getOneTimeTable,
    saveTimeTable,
    updateTimeTable,
    changeTimeTableStatus,
  };
};

export default useTimeTable;
