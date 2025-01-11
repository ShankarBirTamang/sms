import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import itemService, {
  FeeStructureInterface,
  UpdateFeeStructureInterface,
  CreateFeeStructureInterface,
  SingleFeeStructureInterface,
} from "../services/feeStructureService";
import toast from "react-hot-toast";
import feeStructureService from "../services/feeStructureService";

const useFeeStructure = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [feeStructures, setFeeStructures] = useState<FeeStructureInterface[]>(
    []
  );

  const [allFeeStructures, setAllFeeStructures] = useState<
    FeeStructureInterface[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchFeeStructures = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      itemService.getAll<ApiResponseInterface<FeeStructureInterface>>(params);
    request
      .then((result) => {
        setFeeStructures(result.data.data);
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
    fetchFeeStructures();
  }, [fetchFeeStructures]);

  const saveFeeStructure = async ({
    grade_id,
    fee_structure_details,
  }: CreateFeeStructureInterface) => {
    const params = {
      grade_id,
      fee_structure_details,
    };

    try {
      await feeStructureService.create<CreateFeeStructureInterface>(params);
      fetchFeeStructures();
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

  //   const updateFeeStructure = async ({
  //     id,
  //     description,
  //     name,
  //     billing_cycle,
  //     is_mandatory,
  //     item_group_id,
  //     account_group_id,
  //   }: UpdateFeeStructureInterface) => {
  //     const params = {
  //       id,
  //       description,
  //       name,
  //       billing_cycle,
  //       is_mandatory,
  //       item_group_id,
  //       account_group_id,
  //     };
  //     console.log(params);

  //     try {
  //       await itemService.update<UpdateFeeStructureInterface>(params);
  //       fetchFeeStructures();
  //       toast.success("FeeStructure Group Updated Successfully.");
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //         toast.error(err.message);
  //       } else {
  //         setError("An unknown error occurred.");
  //         toast.error("An unknown error occurred.");
  //       }
  //     }
  //   };

  const singleFeeStructure = useCallback(async (id: number) => {
    try {
      const { request } =
        feeStructureService.getOne<ApiResponseInterface<FeeStructureInterface>>(
          id
        );
      const result = await request;
      const feeStructure = Array.isArray(result.data.data)
        ? result.data.data[0]
        : result.data.data;

      return feeStructure;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    }
  }, []);
  return {
    currentPage,
    pagination,
    edgeLinks,
    error,
    isLoading,
    feeStructures,
    allFeeStructures,
    fetchFeeStructures,
    saveFeeStructure,
    // updateFeeStructure,
    singleFeeStructure,
  };
};

export default useFeeStructure;
