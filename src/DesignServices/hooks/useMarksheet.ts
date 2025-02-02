import { useEffect, useState } from "react";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import marksheetService, {
  MarksheetInterface,
  GetMarksheetInterface,
  UpdateMarksheetInterface,
} from "../services/marksheetService";
import toast from "react-hot-toast";
import { CanceledError } from "axios";

const useMarksheet = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [marksheet, setMarksheet] = useState<GetMarksheetInterface>();
  const [marksheetList, setMarksheetList] = useState<GetMarksheetInterface[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  //For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  useEffect(() => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      search: search,
      per_page: itemsPerPage,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      marksheetService.getAll<ApiResponseInterface<GetMarksheetInterface>>(
        params
      );

    request
      .then((result) => {
        setMarksheetList(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
        console.log(
          "Marksheet List result after fetching marksheets",
          result.data.data
        );
      })
      .catch((error) => {
        console.log("Error while fetching marksheets", error);
        toast.error("Error while fetching marksheets");
        setIsLoading(false);
      });

    // return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const getOneMarksheet = async (id: number) => {
    const { request, cancel } =
      marksheetService.getOne<ApiResponse<GetMarksheetInterface>>(id);

    request
      .then((result) => {
        console.log("Onee Marksheet", result.data.data);
        setMarksheet(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
    return () => cancel();
  };

  const saveMarksheet = async (data: MarksheetInterface) => {
    setIsLoadingSubmit(true);
    try {
      const response = await marksheetService.create<MarksheetInterface>(data);
      console.log("admit card response", response.data.data);
      // setMarksheetList((prev) => [...prev, response.data.data]);
      toast.success("Marksheet submitted successfully");
    } catch (error) {
      toast.error("An error occurred when trying to submit Marksheet");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateMarksheet = async (data: UpdateMarksheetInterface) => {
    setIsLoadingSubmit(true);
    console.log("data id", data.id);
    try {
      const response = await marksheetService.update<UpdateMarksheetInterface>(
        data
      );
      console.log("admit card response", response.data.data);
      toast.success("Marksheet updated successfully");
    } catch (error) {
      toast.error("An error occurred when trying to update Marksheet");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return {
    pagination,
    edgeLinks,
    isLoading,
    marksheet,
    marksheetList,
    isLoadingSubmit,
    getOneMarksheet,
    saveMarksheet,
    updateMarksheet,
  };
};

export default useMarksheet;
