import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import itemService, {
  ChangeItemStatusInteface,
  ItemInterface,
  UpdateItemInterface,
  CreateItemInterface,
} from "../services/itemService";
import toast from "react-hot-toast";

const useItem = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [items, setItems] = useState<ItemInterface[]>([]);

  const [allItems, setAllItems] = useState<ItemInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      itemService.getAll<ApiResponseInterface<ItemInterface>>(params);
    request
      .then((result) => {
        setItems(result.data.data);
        console.log(
          "result.data.data at line 47 in hooks/useItem.ts:",
          result.data.data
        );
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

  const fetchAllItems = useCallback(async () => {
    setIsLoading(true);

    const { request } =
      itemService.getAll<ApiResponseInterface<ItemInterface>>();
    request
      .then((result) => {
        setAllItems(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchItems();
    fetchAllItems();
  }, [fetchItems, fetchAllItems]);

  const saveItem = async ({
    name,
    description,
    payment_group_id,
    is_mandatory,
    item_group_id,
    account_group_id,
  }: CreateItemInterface) => {
    const params = {
      name,
      description,
      payment_group_id,
      is_mandatory,
      item_group_id,
      account_group_id,
    };

    try {
      await itemService.create<CreateItemInterface>(params);
      fetchItems();
      fetchAllItems();
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

  const updateItem = async ({
    id,
    description,
    name,
    payment_group_id,
    is_mandatory,
    item_group_id,
    account_group_id,
  }: UpdateItemInterface) => {
    const params = {
      id,
      description,
      name,
      payment_group_id,
      is_mandatory,
      item_group_id,
      account_group_id,
    };
    console.log(params);

    try {
      await itemService.update<UpdateItemInterface>(params);
      fetchItems();
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

  const changeItemStatus = async ({ id }: ChangeItemStatusInteface) => {
    try {
      await itemService.changeStatus<ChangeItemStatusInteface>({
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
    items,
    allItems,
    fetchItems,
    saveItem,
    updateItem,
    changeItemStatus,
  };
};

export default useItem;
