import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import emailService, {
  EmailInterface,
  ChangeEmailStatusInterface,
  UpdateEmailInterface,
  CreateEmailInterface,
} from "../services/emailService";

import { CanceledError } from "../../../services/apiClient";
import { PaginationProps } from "../../../components/Pagination/Pagination";

const useEmail = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [emails, setEmails] = useState<EmailInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false); // State to track status changes

  // For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  //end for Pagination

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | null> = {
      per_page: itemsPerPage,
      search: search,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      emailService.getAll<ApiResponseInterface<EmailInterface>>(params);

    request
      .then((result) => {
        setEmails(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, [search, currentPage, itemsPerPage, statusChanged]);

  const saveEmail = async ({
    name,
    protocol,
    encryption,
    host,
    port,
    username,
    password,
    email,
  }: CreateEmailInterface) => {
    const params = {
      name,
      protocol,
      encryption,
      host,
      port,
      username,
      password,
      email,
    };
    try {
      const result = await emailService.create<EmailInterface>(params);
      // Update state only after successful creation
      setEmails([...emails, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateEmail = async ({
    id,
    name,
    protocol,
    encryption,
    host,
    port,
    username,
    password,
    email,
  }: UpdateEmailInterface) => {
    const params = {
      id,
      name,
      protocol,
      encryption,
      host,
      port,
      username,
      password,
      email,
    };
    // const originalAcademicLevel = [...emails];

    try {
      const result = await emailService.update<UpdateEmailInterface>(params);
      setEmails(
        emails.map((session) =>
          session.id === result.data.data.id ? result.data.data : session
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      // console.log(params, result);
    }
  };

  const changeEmailStatus = async ({ id }: ChangeEmailStatusInterface) => {
    try {
      console.log("id during changing academic session status", id);
      // Update the status of the academic session
      await emailService.changeStatus<ChangeEmailStatusInterface>({
        id,
      });
    } catch (error) {
      console.error("Error changing academic session status:", error);
    } finally {
      setStatusChanged((prev) => !prev);
    }
  };

  return {
    emails,
    error,
    isLoading,
    setEmails,
    setError,
    pagination,
    edgeLinks,
    currentPage,
    saveEmail,
    updateEmail,
    changeEmailStatus,
  };
};

export default useEmail;
