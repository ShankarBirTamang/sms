import { ChangeFacultyStatusInterface } from "./../services/facultyService";
import { useEffect, useMemo, useState } from "react";
import { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import facultyService, {
  FacultyInterface,
  UpdateFacultyInterface,
} from "../services/facultyService";

const useFaculty = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const [faculties, setFaculties] = useState<UpdateFacultyInterface[]>([]);

  const params = useMemo(() => {
    return {
      per_page: itemsPerPage,
      search: search,
      currentPage,
    };
  }, [currentPage, itemsPerPage, search]);
  useEffect(() => {
    setLoading(true);

    if (itemsPerPage !== null) {
      params.currentPage = currentPage;
    }

    const { request, cancel } =
      facultyService.getAll<ApiResponseInterface<UpdateFacultyInterface>>(
        params
      );

    request
      .then((result) => {
        setFaculties(result.data.data);
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
  }, [search, currentPage, itemsPerPage, params]);

  const saveFaculty = async ({ name, code, description }: FacultyInterface) => {
    const params = {
      name,
      code,
      description,
    };

    try {
      const result = await facultyService.create<FacultyInterface>(params);
      // Update state only after successful creation
      setFaculties([...faculties, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateFaculty = async ({
    id,
    name,
    code,
    description,
  }: UpdateFacultyInterface) => {
    const params = {
      id,
      name,
      code,
      description,
    };
    const originalFaculty = [...faculties];

    try {
      console.log("Original:", originalFaculty);

      const result = await facultyService.update<UpdateFacultyInterface>(
        params
      );
      setFaculties(
        faculties.map((faculty) =>
          faculty.id === result.data.data.id ? result.data.data : faculty
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const changeFacultyStatus = async ({ id }: ChangeFacultyStatusInterface) => {
    try {
      await facultyService.changeStatus<ChangeFacultyStatusInterface>({
        id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      const { request } =
        facultyService.getAll<ApiResponseInterface<UpdateFacultyInterface>>(
          params
        );

      request
        .then((result) => {
          setFaculties(result.data.data);
          setPagination(result.data.meta);
          setEdgeLinks(result.data.links);
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setLoading(false);
        });
    }
  };

  return {
    isLoading,
    pagination,
    faculties,
    edgeLinks,
    currentPage,
    error,
    setError,
    saveFaculty,
    updateFaculty,
    changeFacultyStatus,
  };
};

export default useFaculty;
