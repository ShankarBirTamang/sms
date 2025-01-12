import { useCallback, useEffect, useState } from "react";
import axiosInstance, { CanceledError } from "../../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import accountService, {
  AccountInterface,
  CreateStudentAccountInterface,
  StudentAccountInterface,
} from "../services/accountService";
import { number } from "zod";

export const useAccount = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [accounts, setAccounts] = useState<AccountInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  interface SaveStudentAccountProps {
    type: string;
    studentAccountData: CreateStudentAccountInterface[];
  }
  const saveStudentAccount = async ({
    type,
    studentAccountData,
  }: SaveStudentAccountProps) => {
    console.log(
      "studentAccountData at line 9 in hooks/useAccount.ts:",
      JSON.stringify(studentAccountData)
    );

    try {
      const params = {
        type,
        studentAccountData,
      };
      const response = await accountService.create<SaveStudentAccountProps>(
        params
      );
      toast.success(response.data.message);
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

  const getStudentAccount = useCallback(
    async (grade_id: number | null, section_id: number | null) => {
      try {
        const result = await axiosInstance.get<
          ApiResponseInterface<StudentAccountInterface>
        >("accounts/masters/account/student-accounts", {
          params: {
            grade_id,
            section_id,
          },
        });

        const accounts = result.data.data;

        return accounts || [];
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError("An unknown error occurred.");
          toast.error("An unknown error occurred.");
        }
      }
    },
    []
  );

  return { saveStudentAccount, getStudentAccount };
};
