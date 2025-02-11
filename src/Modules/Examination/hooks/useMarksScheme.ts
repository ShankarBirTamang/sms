import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import marksSchemeService, {
  ChangeMarksSchemeStatusInterface,
  CreateMarksSchemeInterface,
  MarksSchemeInterface,
  UpdateMarksSchemeInterface,
} from "../services/marksSchemeService";

import { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";

const useMarksScheme = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [marksSchemes, setMarksSchemes] = useState<
    UpdateMarksSchemeInterface[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false); // State to track status changes

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  //end for Pagination

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
      marksSchemeService.getAll<
        ApiResponseInterface<UpdateMarksSchemeInterface>
      >(params);

    request
      .then((result) => {
        setMarksSchemes(result.data.data);
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
  }, [search, currentPage, itemsPerPage, statusChanged]);

  const saveMarksScheme = async ({
    name,
    short_name,
    group,
  }: CreateMarksSchemeInterface) => {
    const params = {
      name,
      short_name,
      group,
    };
    try {
      const result =
        await marksSchemeService.create<CreateMarksSchemeInterface>(params);
      setMarksSchemes([...marksSchemes, result.data.data]);
      toast.success("Marks Scheme Create Successfully.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const updateMarksScheme = async ({
    id,
    name,
    short_name,
    group,
  }: UpdateMarksSchemeInterface) => {
    const params = {
      id,
      name,
      short_name,
      group,
    };
    // const originalAcademicLevel = [...marksSchemes];

    try {
      const result =
        await marksSchemeService.update<UpdateMarksSchemeInterface>(params);
      setMarksSchemes(
        marksSchemes.map((session) =>
          session.id === result.data.data.id ? result.data.data : session
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      // console.log(params, result);
    }
  };

  const changeMarksSchemeStatus = async ({
    id,
  }: ChangeMarksSchemeStatusInterface) => {
    try {
      await marksSchemeService.changeStatus<ChangeMarksSchemeStatusInterface>({
        id,
      });
    } catch (error) {
      console.error("Error changing academic session status:", error);
    } finally {
      setStatusChanged((prev) => !prev);
    }
  };

  return {
    marksSchemes,
    error,
    isLoading,
    setMarksSchemes,
    setError,
    pagination,
    edgeLinks,
    currentPage,
    saveMarksScheme,
    updateMarksScheme,
    changeMarksSchemeStatus,
  };
};

export default useMarksScheme;
