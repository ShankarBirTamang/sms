import { useEffect, useState } from "react";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";

import toast from "react-hot-toast";
import laboratoryService, {
  LaboratoryForm,
  UpdateLaboratoryForm,
} from "../services/laboratoryService";

const useLaboratories = ({
  search = "",
  itemsPerPage = null,
  currentPage = 1,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [laboratories, setLaboratories] = useState<UpdateLaboratoryForm[]>([]);

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
      laboratoryService.getAll<ApiResponseInterface<UpdateLaboratoryForm>>(
        params
      );

    request
      .then((result) => {
        setLaboratories(result.data.data);
        setPagination(result.data.meta);
        setEdgeLinks(result.data.links);
        setIsLoading(false);
        // console.log("result after fetching roomHalls", result.data.data);
        console.log("result after fetching roomHalls meta", result.data);
      })
      .catch((error) => {
        console.log("Error while fetching roomHalls", error);
        toast.error("Error while fetching roomHalls");
        setIsLoading(false);
      });

    // return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const saveLaboratory = async ({ name, description }: LaboratoryForm) => {
    setIsLoadingSubmit(true);
    try {
      const params = {
        name,
        description,
      };
      const response = await laboratoryService.create<LaboratoryForm>(params);
      setLaboratories((prev) => [...prev, response.data.data]);
      toast.success("Laboratory added successfully");
      console.log("response after submitting roomHalls", response.data.data);
    } catch (error) {
      console.log("Error while saving laboratory", error);
      toast.error("Error while saving laboratory");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateLaboratory = async (data: UpdateLaboratoryForm) => {
    try {
      const { id, name, description } = data;
      const params = {
        id,
        name,
        description,
      };

      const originalLaboratories = [...laboratories];
      const response = await laboratoryService.update<UpdateLaboratoryForm>(
        params
      );
      console.log("response after updating laboratory", response.data.data);
      toast.success("Laboratory updated successfully");
      setLaboratories((prev) =>
        prev.map((roomHall) =>
          roomHall.id === id ? response.data.data : roomHall
        )
      );
    } catch (error) {
      console.log("Error while updating laboratory", error);
      toast.error("Error while updating laboratory");
    }
  };

  const deleteLaboratory = async (id: number) => {
    try {
      const response = await laboratoryService.delete(id);
      toast.success("Laboratory deleted successfully");
      console.log("response after deleting laboratory", response);
    } catch (error) {
      toast.error("Error while deleting laboratory");
      console.log("Error while deleting laboratory", error);
    }
  };

  return {
    pagination,
    edgeLinks,
    laboratories,
    isLoading,
    isLoadingSubmit,
    saveLaboratory,
    updateLaboratory,
    deleteLaboratory,
  };
};

export default useLaboratories;
