import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import taxCategoryService, {
  TaxCategoryInterface,
  UpdateTaxCategoryInterface,
  CreateTaxCategoryInterface,
} from "../services/taxCategoryService";
import toast from "react-hot-toast";

const useTaxCategory = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [taxCategorys, setTaxCategorys] = useState<TaxCategoryInterface[]>([]);

  const [allTaxCategorys, setAllTaxCategorys] = useState<
    TaxCategoryInterface[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchTaxCategorys = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      taxCategoryService.getAll<ApiResponseInterface<TaxCategoryInterface>>(
        params
      );
    request
      .then((result) => {
        setTaxCategorys(result.data.data);
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

  const fetchAllTaxCategorys = useCallback(async () => {
    setIsLoading(true);

    const { request } =
      taxCategoryService.getAll<ApiResponseInterface<TaxCategoryInterface>>();
    request
      .then((result) => {
        setAllTaxCategorys(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTaxCategorys();
    fetchAllTaxCategorys();
  }, [fetchTaxCategorys, fetchAllTaxCategorys]);

  const saveTaxCategory = async ({
    name,
    type,
    zero_tax_type,
    rate_local,
    rate_imp_exp,
    tax_on_mrp,
    calculated_tax_on,
    tax_on_mrp_mode,
  }: CreateTaxCategoryInterface) => {
    const params = {
      name,
      type,
      zero_tax_type,
      rate_local,
      rate_imp_exp,
      tax_on_mrp,
      calculated_tax_on,
      tax_on_mrp_mode,
    };

    try {
      await taxCategoryService.create<CreateTaxCategoryInterface>(params);
      fetchTaxCategorys();
      toast.success("Account Group Added Successfully.");
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

  const updateTaxCategory = async ({
    id,
    name,
    type,
    zero_tax_type,
    rate_local,
    rate_imp_exp,
    tax_on_mrp,
    calculated_tax_on,
    tax_on_mrp_mode,
  }: UpdateTaxCategoryInterface) => {
    const params = {
      id,
      name,
      type,
      zero_tax_type,
      rate_local,
      rate_imp_exp,
      tax_on_mrp,
      calculated_tax_on,
      tax_on_mrp_mode,
    };

    try {
      await taxCategoryService.update<UpdateTaxCategoryInterface>(params);
      fetchTaxCategorys();
      toast.success("Account Group Updated Successfully.");
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
    currentPage,
    pagination,
    edgeLinks,
    error,
    isLoading,
    taxCategorys,
    allTaxCategorys,
    fetchTaxCategorys,
    saveTaxCategory,
    updateTaxCategory,
  };
};

export default useTaxCategory;
