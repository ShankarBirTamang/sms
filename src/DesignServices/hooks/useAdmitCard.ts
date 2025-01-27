import { useEffect, useState } from "react";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import admitCardService, {
  AdmitCardInterface,
  GetAdmitCardInterface,
  UpdateAdmitCardInterface,
} from "../services/admitCardService";
import toast from "react-hot-toast";
import { CanceledError } from "axios";

const useAdmitCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [admitCard, setAdmitCard] = useState<GetAdmitCardInterface>();
  const [admitCardList, setAdmitCardList] = useState<GetAdmitCardInterface[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  //For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();

  useEffect(() => {
    setIsLoading(true);
    const params: Record<string, string | number | null> = {
      search: search,
      per_page: itemsPerPage,
    };

    if (itemsPerPage !== null) {
      params.page = currentPage;
    }

    const { request, cancel } =
      admitCardService.getAll<ApiResponseInterface<GetAdmitCardInterface>>(
        params
      );

    request
      .then((result) => {
        setAdmitCardList(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
        console.log(
          "AdmitCard List result after fetching Admit Cards",
          result.data.data
        );
      })
      .catch((error) => {
        console.log("Error while fetching Admit Cards", error);
        toast.error("Error while fetching Admit Cards");
        setIsLoading(false);
      });

    // return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const getOneAdmitCard = async (id: number) => {
    const { request, cancel } =
      admitCardService.getOne<ApiResponse<GetAdmitCardInterface>>(id);

    request
      .then((result) => {
        console.log("Onee Admit Card", result.data.data);
        setAdmitCard(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
    return () => cancel();
  };

  const saveAdmitCard = async (data: AdmitCardInterface) => {
    setIsLoadingSubmit(true);
    try {
      const response = await admitCardService.create<AdmitCardInterface>(data);
      console.log("admit card response", response.data.data);
      // setAdmitCardList((prev) => [...prev, response.data.data]);
      toast.success("Admit Card submitted successfully");
    } catch (error) {
      toast.error("An error occurred when trying to submit Admit Card");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateAdmitCard = async (data: UpdateAdmitCardInterface) => {
    setIsLoadingSubmit(true);
    console.log("data id", data.id);
    try {
      const response = await admitCardService.update<UpdateAdmitCardInterface>(
        data
      );
      console.log("admit card response", response.data.data);
      toast.success("Admit Card updated successfully");
    } catch (error) {
      toast.error("An error occurred when trying to update Admit Card");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return {
    pagination,
    edgeLinks,
    isLoading,
    admitCard,
    admitCardList,
    isLoadingSubmit,
    getOneAdmitCard,
    saveAdmitCard,
    updateAdmitCard,
  };
};

export default useAdmitCard;
