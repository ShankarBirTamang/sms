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
import { set } from "react-hook-form";
const baseUrl = import.meta.env.VITE_API_URL;

const useIdCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
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

  const saveIdCard = async (formData: FormData) => {
    // Logging for debugging
    const formDataObject: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }
    console.log("FormData as plain object hehe:", formDataObject);

    const idCardData: IdCardInterface = {
      name: formData.get("name") as string,
      html: formData.get("html") as string,
      id_card_type_id: formData.get("id_card_type_id") as string,
      background: formData.get("background") as FileList | null,
      signers: JSON.parse(formData.get("signers") as string).map(
        (signer: any) => ({
          title: signer.title ?? undefined,
          signature_id: signer.signature_id ?? undefined,
        })
      ),
    };

    console.log("Id Card Data Yo", idCardData);

    setIsLoadingSubmit(true);
    try {
      const response = await idCardService.create<IdCardInterface>(idCardData);
      console.log("Id card response", response.data.data);
      // setIdCardList((prev) => [...prev, response.data.data]);
      toast.success("Id Card saved successfully");
    } catch (error) {
      toast.error("Error while saving Id Card");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return {
    pagination,
    edgeLinks,
    isLoading,
    isLoadingSubmit,
    idCardList,
    idCardTypes,
    saveIdCard,
  };
};

export default useIdCard;
