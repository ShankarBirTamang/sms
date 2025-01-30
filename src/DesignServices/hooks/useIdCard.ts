import { useEffect, useState } from "react";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import idCardService, {
  GetIdCardInterface,
  IdCardInterface,
  IdCardTypeInterface,
  UpdateIdCardInterface,
} from "../services/idCardService";
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";
import { CanceledError } from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

const useIdCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [idCard, setIdCard] = useState<GetIdCardInterface>();
  const [idCardList, setIdCardList] = useState<GetIdCardInterface[]>([]);
  const [idCardTypes, setIdCardTypes] = useState<IdCardTypeInterface[]>([]);
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
      idCardService.getAll<ApiResponseInterface<GetIdCardInterface>>(params);

    request
      .then((result) => {
        setIdCardList(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error while fetching Admit Cards", error);
        toast.error("Error while fetching Admit Cards");
        setIsLoading(false);
      });

    // return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const getIdCardType = async () => {
    try {
      const idCardTypesResponse = await axiosInstance.get(
        `${baseUrl}/design-services/id-card-types`
      );
      setIdCardTypes(idCardTypesResponse.data.data);
    } catch (error) {
      console.log("Error fetching Id Card Type", error);
    }
  };

  useEffect(() => {
    getIdCardType();
  }, []);

  const getOneIdCard = async (id: number) => {
    const { request, cancel } =
      idCardService.getOne<ApiResponse<GetIdCardInterface>>(id);

    request
      .then((result) => {
        console.log("Getting one Id Card", result.data.data);
        setIdCard(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
    return () => cancel();
  };

  const saveIdCard = async (data: IdCardInterface) => {
    console.log("FormData in Save", data);

    setIsLoadingSubmit(true);
    try {
      const response = await idCardService.create<IdCardInterface>(data); // Make sure you pass `formData` directly
      console.log("Id card response", response.data.data);
      toast.success("Id Card saved successfully..");
    } catch (error) {
      toast.error("Error while saving Id Card..");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateIdCard = async (data: UpdateIdCardInterface) => {
    setIsLoadingSubmit(true);
    try {
      const response = await idCardService.update<UpdateIdCardInterface>(data);
      console.log("Id card response", response.data.data);
      toast.success("Id Card updated successfully..");
    } catch (error) {
      toast.error("An error occurred when trying to update Id Card..");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return {
    pagination,
    edgeLinks,
    isLoading,
    isLoadingSubmit,
    idCard,
    idCardList,
    idCardTypes,
    saveIdCard,
    getOneIdCard,
    updateIdCard,
  };
};

export default useIdCard;
