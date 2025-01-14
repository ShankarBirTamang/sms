import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "../../../services/apiClient";

import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import accountGroupService, {
  ChangeAccountGroupStatusInteface,
  AccountGroupInterface,
  UpdateAccountGroupInterface,
  CreateAccountGroupInterface,
} from "../services/accountGroupService";
import toast from "react-hot-toast";

const useAccountGroup = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [accountGroups, setAccountGroups] = useState<AccountGroupInterface[]>(
    []
  );

  const [allAccountGroups, setAllAccountGroups] = useState<
    AccountGroupInterface[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  const fetchAccountGroups = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };
    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request } =
      accountGroupService.getAll<ApiResponseInterface<AccountGroupInterface>>(
        params
      );
    request
      .then((result) => {
        setAccountGroups(result.data.data);
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

  const fetchAllAccountGroups = useCallback(async () => {
    setIsLoading(true);

    const { request } =
      accountGroupService.getAll<ApiResponseInterface<AccountGroupInterface>>();
    request
      .then((result) => {
        setAllAccountGroups(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAccountGroups();
    fetchAllAccountGroups();
  }, [fetchAccountGroups, fetchAllAccountGroups]);

  const saveAccountGroup = async ({
    name,
    alias,
    parent_id,
  }: CreateAccountGroupInterface) => {
    const params = {
      name,
      alias,
      parent_id,
    };

    try {
      await accountGroupService.create<CreateAccountGroupInterface>(params);
      fetchAccountGroups();
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

  const updateAccountGroup = async ({
    id,
    name,
    alias,
    parent_id,
  }: UpdateAccountGroupInterface) => {
    const params = {
      id,
      name,
      alias,
      parent_id,
    };

    try {
      await accountGroupService.update<UpdateAccountGroupInterface>(params);
      fetchAccountGroups();
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

  const changeAccountGroupStatus = async ({
    id,
  }: ChangeAccountGroupStatusInteface) => {
    try {
      await accountGroupService.changeStatus<ChangeAccountGroupStatusInteface>({
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
    accountGroups,
    allAccountGroups,
    fetchAccountGroups,
    saveAccountGroup,
    updateAccountGroup,
    changeAccountGroupStatus,
  };
};

export default useAccountGroup;
