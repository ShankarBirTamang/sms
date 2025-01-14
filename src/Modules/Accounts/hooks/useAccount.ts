import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import accountService, {
  AccountInterface,
  CreateStudentAccountInterface,
  StudentAccountInterface,
} from "../services/accountService";
import { number } from "zod";

export const useAccount = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [accounts, setAccounts] = useState<AccountInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  interface SaveStudentAccountProps {
    type: string;
    studentAccountData: CreateStudentAccountInterface[];
  }

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      accountService.getAll<ApiResponseInterface<AccountInterface>>(params);
    request
      .then((result) => {
        setAccounts(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
    const result = await request;
    return result.data.data;
  }, [search, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const saveStudentAccount = async ({
    type,
    studentAccountData,
  }: SaveStudentAccountProps) => {
    try {
      const params = {
        type,
        studentAccountData,
      };
      const response = await accountService.create<SaveStudentAccountProps>(
        params
      );
      toast.success(response.data.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    }
  };

  const getStudentAccount = useCallback(
    async (grade_id: number | null, section_id: number | null) => {
      try {
        const result = await axiosInstance.get<
          ApiResponseInterface<StudentAccountInterface>
        >("accounts/masters/account/student-accounts", {
          params: {
            grade_id,
            section_id,
          },
        });

        const accounts = result.data.data;

        return accounts || [];
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError("An unknown error occurred.");
          toast.error("An unknown error occurred.");
        }
      }
    },
    []
  );

  return {
    saveStudentAccount,
    fetchAccounts,
    getStudentAccount,
    accounts,
    error,
    isLoading,
    pagination,
    edgeLinks,
  };
};
