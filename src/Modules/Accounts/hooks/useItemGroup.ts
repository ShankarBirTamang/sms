import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import itemGroupService, {
  ChangeItemGroupStatusInteface,
  ItemGroupInterface,
  UpdateItemGroupInterface,
  CreateItemGroupInterface,
} from "../services/itemGroupService";
import toast from "react-hot-toast";

const useItemGroup = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [itemGroups, setItemGroups] = useState<ItemGroupInterface[]>([]);

  const [allItemGroups, setAllItemGroups] = useState<ItemGroupInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchItemGroups = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      itemGroupService.getAll<ApiResponseInterface<ItemGroupInterface>>(params);
    request
      .then((result) => {
        setItemGroups(result.data.data);
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

  const fetchAllItemGroups = useCallback(async () => {
    setIsLoading(true);

    const { request } =
      itemGroupService.getAll<ApiResponseInterface<ItemGroupInterface>>();
    request
      .then((result) => {
        setAllItemGroups(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchItemGroups();
    fetchAllItemGroups();
  }, [fetchItemGroups, fetchAllItemGroups]);

  const saveItemGroup = async ({
    name,
    alias,
    parent_id,
  }: CreateItemGroupInterface) => {
    const params = {
      name,
      alias,
      parent_id,
    };

    try {
      await itemGroupService.create<CreateItemGroupInterface>(params);
      fetchItemGroups();
      fetchAllItemGroups();
      toast.success("Item Group Added Successfully.");
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

  const updateItemGroup = async ({
    id,
    name,
    alias,
    parent_id,
  }: UpdateItemGroupInterface) => {
    const params = {
      id,
      name,
      alias,
      parent_id,
    };
    console.log(params);

    try {
      await itemGroupService.update<UpdateItemGroupInterface>(params);
      fetchItemGroups();
      toast.success("Item Group Updated Successfully.");
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

  const changeItemGroupStatus = async ({
    id,
  }: ChangeItemGroupStatusInteface) => {
    try {
      await itemGroupService.changeStatus<ChangeItemGroupStatusInteface>({
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
    itemGroups,
    allItemGroups,
    fetchItemGroups,
    saveItemGroup,
    updateItemGroup,
    changeItemGroupStatus,
  };
};

export default useItemGroup;
