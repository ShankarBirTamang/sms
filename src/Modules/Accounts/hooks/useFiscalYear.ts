import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import fiscalYearService, {
  ChangeFiscalYearStatusInteface,
  FiscalYearInterface,
  UpdateFiscalYearInterface,
} from "../services/fiscalYearService";
import toast from "react-hot-toast";

const useFiscalYear = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [fiscalYears, setFiscalYears] = useState<FiscalYearInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchFiscalYears = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      fiscalYearService.getAll<ApiResponseInterface<FiscalYearInterface>>(
        params
      );
    request
      .then((result) => {
        setFiscalYears(result.data.data);
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

  useEffect(() => {
    fetchFiscalYears();
  }, [fetchFiscalYears]);

  const saveFiscalYear = async ({
    rank,
    name,
    start_date_en,
    start_date_np,
    end_date_en,
    end_date_np,
    is_active,
    allow_entry,
  }: FiscalYearInterface) => {
    const params = {
      rank,
      name,
      start_date_en,
      start_date_np,
      end_date_en,
      end_date_np,
      is_active,
      allow_entry,
    };

    try {
      const result = await fiscalYearService.create<FiscalYearInterface>(
        params
      );
      console.log("result at line 84 in hooks/useFiscalYear.ts:", result);
      fetchFiscalYears();
      toast.success("Fiscal year Added Successfully.");
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

  const updateFiscalYear = async ({
    id,
    rank,
    name,
    start_date_en,
    start_date_np,
    end_date_en,
    end_date_np,
    is_active,
    allow_entry,
  }: UpdateFiscalYearInterface) => {
    const params = {
      id,
      rank,
      name,
      start_date_en,
      start_date_np,
      end_date_en,
      end_date_np,
      is_active,
      allow_entry,
    };
    try {
      await fiscalYearService.update<UpdateFiscalYearInterface>(params);
      fetchFiscalYears();
      toast.success("Fiscal year Updated Successfully.");
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

  const changeFiscalYearStatus = async ({
    id,
  }: ChangeFiscalYearStatusInteface) => {
    try {
      await fiscalYearService.changeStatus<ChangeFiscalYearStatusInteface>({
        id,
      });
      toast.success("Fiscal Year Status Changed Successfully.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    } finally {
      setStatusChanged((prev) => !prev);
    }
  };

  return {
    currentPage,
    pagination,
    edgeLinks,
    error,
    isLoading,
    fiscalYears,
    fetchFiscalYears,
    saveFiscalYear,
    updateFiscalYear,
    changeFiscalYearStatus,
  };
};

export default useFiscalYear;
