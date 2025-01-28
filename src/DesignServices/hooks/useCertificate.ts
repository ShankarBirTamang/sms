import { useEffect, useState } from "react";
import {
  ApiResponse,
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import certificateServices, {
  CertificateInterface,
  GetCertificateInterface,
  UpdateCertificateInterface,
} from "../services/certificateServices";
import { CanceledError } from "axios";

const useCertificate = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [certificate, setCertificate] = useState<GetCertificateInterface>();
  const [certificateList, setCertificateList] = useState<
    GetCertificateInterface[]
  >([]);
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
      certificateServices.getAll<ApiResponseInterface<GetCertificateInterface>>(
        params
      );

    request
      .then((result) => {
        setCertificateList(result.data.data);
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

  const getOneCertificate = async (id: number) => {
    const { request, cancel } =
      certificateServices.getOne<ApiResponse<GetCertificateInterface>>(id);

    request
      .then((result) => {
        console.log("One Certificate", result.data.data);
        setCertificate(result.data.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        toast.error("Error while fetching One Certificate");
      });
    return () => cancel();
  };

  const saveCertificate = async (formData: FormData) => {
    // Logging for debugging
    const formDataObject: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }
    console.log("FormData as plain object hehe:", formDataObject);
    ///

    const idCardData: CertificateInterface = {
      name: formData.get("name") as string,
      html: formData.get("html") as string,
      size: formData.get("size") as string,
      height: Number(formData.get("height") as unknown as string),
      width: Number(formData.get("width") as unknown as string),
      orientation: formData.get("orientation") as string,
      background: formData.get("background") as FileList | null,
      signers: JSON.parse(formData.get("signers") as string).map(
        (signer: any) => ({
          title: signer.title ?? undefined,
          signature_id: signer.signature_id ?? undefined,
        })
      ),
    };

    console.log("Id Card Data in SaveCertificate", idCardData);
    setIsLoadingSubmit(true);
  };

  const updateCertificate = async (formData: FormData) => {};

  return {
    pagination,
    edgeLinks,
    isLoading,
    isLoadingSubmit,
    certificate,
    certificateList,
    getOneCertificate,
    saveCertificate,
    updateCertificate,
  };
};

export default useCertificate;
