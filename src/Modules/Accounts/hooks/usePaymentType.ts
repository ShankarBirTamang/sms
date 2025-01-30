import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import paymentTypeService, {
  PaymentTypeInterface,
  UpdatePaymentTypeInterface,
} from "../services/paymentTypesService";

const usePaymentType = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypeInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchPaymentTypes = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      paymentTypeService.getAll<ApiResponseInterface<PaymentTypeInterface>>(
        params
      );
    request
      .then((result) => {
        setPaymentTypes(result.data.data);
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
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  const savePaymentType = async ({ name }: PaymentTypeInterface) => {
    const params = {
      name,
    };

    try {
      await paymentTypeService.create<PaymentTypeInterface>(params);
      fetchPaymentTypes();
      toast.success("Payment Type Added Successfully.");
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

  const updatePaymentType = async ({
    id,
    name,
  }: UpdatePaymentTypeInterface) => {
    const params = {
      id,
      name,
    };
    try {
      await paymentTypeService.update<UpdatePaymentTypeInterface>(params);
      fetchPaymentTypes();
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
    paymentTypes,
    fetchPaymentTypes,
    error,
    pagination,
    edgeLinks,
    isLoading,
    savePaymentType,
    updatePaymentType,
  };
};

export default usePaymentType;
