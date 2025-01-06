import { useEffect, useState } from "react";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import admitCardService, {
  AdmitCardInterface,
} from "../services/admitCardService";
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";

const useAdmitCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [admitCards, setAdmitCards] = useState<AdmitCardInterface[]>([]);
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
      admitCardService.getAll<ApiResponseInterface<AdmitCardInterface>>(params);

    request
      .then((result) => {
        setAdmitCards(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
        // console.log("result after fetching Admit Cards", result.data.data);
        console.log("result after fetching Admit Cards meta", result.data);
      })
      .catch((error) => {
        console.log("Error while fetching Admit Cards", error);
        toast.error("Error while fetching Admit Cards");
        setIsLoading(false);
      });

    // return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const saveAdmitCard = async ({ name, signers }) => {
    console.log("create admit card fn");

    const params = { name, signers };
    const response = await admitCardService.create<AdmitCardInterface>(params);
    console.log("admit card response", response);
    setAdmitCards((prev) => [...prev, response.data.data]);
  };

  return {
    pagination,
    edgeLinks,
    isLoading,
    admitCards,
  };
};

export default useAdmitCard;
