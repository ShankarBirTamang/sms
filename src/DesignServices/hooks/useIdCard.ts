import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import idCardService, {
  GetIdCardInterface,
  IdCardInterface,
  IdCardTypeInterface,
} from "../services/idCardService";
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";
const baseUrl = import.meta.env.VITE_API_URL;

const useIdCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [idCards, setIdCards] = useState<GetIdCardInterface[]>([]);
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
        setIdCards(result.data.data);
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

  // const saveIdCard = async ({ name, signers }) => {
  //   console.log("create Id card fn");

  //   const params = { name, signers };
  //   const response = await idCardService.create<IdCardInterface>(params);
  //   console.log("Id card response", response);
  //   setIdCards((prev) => [...prev, response.data.data]);
  // };

  return {
    pagination,
    edgeLinks,
    isLoading,
    idCards,
    idCardTypes,
  };
};

export default useIdCard;
