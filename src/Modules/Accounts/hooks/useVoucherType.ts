import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import voucherTypeService, {
  VoucherTypeInterface,
  UpdateVoucherTypeInterface,
} from "../services/voucherTypeService";

const useVoucherType = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [voucherTypes, setVoucherTypes] = useState<VoucherTypeInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchVoucherTypes = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      voucherTypeService.getAll<ApiResponseInterface<VoucherTypeInterface>>(
        params
      );
    request
      .then((result) => {
        setVoucherTypes(result.data.data);
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
    fetchVoucherTypes();
  }, [fetchVoucherTypes]);

  const saveVoucherType = async ({
    name,
    description,
  }: VoucherTypeInterface) => {
    const params = {
      name,
      description,
    };

    try {
      await voucherTypeService.create<VoucherTypeInterface>(params);
      fetchVoucherTypes();
      toast.success("Voucher Type Added Successfully.");
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

  const updateVoucherType = async ({
    id,
    name,
    description,
  }: UpdateVoucherTypeInterface) => {
    const params = {
      id,
      name,
      description,
    };
    try {
      await voucherTypeService.update<UpdateVoucherTypeInterface>(params);
      fetchVoucherTypes();
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
    voucherTypes,
    fetchVoucherTypes,
    error,
    pagination,
    edgeLinks,
    isLoading,
    saveVoucherType,
    updateVoucherType,
  };
};

export default useVoucherType;
