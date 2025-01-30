import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import paymentGroupService, {
  PaymentGroupInterface,
  UpdatePaymentGroupInterface,
} from "../services/paymentGroupService";

const usePaymentGroup = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [paymentGroups, setPaymentGroups] = useState<PaymentGroupInterface[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchPaymentGroups = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      paymentGroupService.getAll<ApiResponseInterface<PaymentGroupInterface>>(
        params
      );
    request
      .then((result) => {
        setPaymentGroups(result.data.data);
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
    fetchPaymentGroups();
  }, [fetchPaymentGroups]);

  const savePaymentGroup = async ({ name }: PaymentGroupInterface) => {
    const params = {
      name,
    };

    try {
      await paymentGroupService.create<PaymentGroupInterface>(params);
      fetchPaymentGroups();
      toast.success("Payment Group Added Successfully.");
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

  const updatePaymentGroup = async ({
    id,
    name,
  }: UpdatePaymentGroupInterface) => {
    const params = {
      id,
      name,
    };
    try {
      await paymentGroupService.update<UpdatePaymentGroupInterface>(params);
      fetchPaymentGroups();
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

  return {
    paymentGroups,
    fetchPaymentGroups,
    error,
    pagination,
    edgeLinks,
    isLoading,
    savePaymentGroup,
    updatePaymentGroup,
  };
};

export default usePaymentGroup;
