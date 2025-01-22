import { useEffect, useState } from "react";
import { PaginationProps } from "../../../components/Pagination/Pagination";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../../Interface/Interface";
import roomHallsService, {
  RoomHallsForm,
  UpdateRoomHallsForm,
} from "../services/roomHallsService";
import toast from "react-hot-toast";

const useRoomHalls = ({
  search = "",
  itemsPerPage = null,
  currentPage = 1,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [roomHalls, setRoomHalls] = useState<UpdateRoomHallsForm[]>([]);

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
      roomHallsService.getAll<ApiResponseInterface<UpdateRoomHallsForm>>(
        params
      );

    request
      .then((result) => {
        setRoomHalls(result.data.data);
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

  const saveRoomHall = async ({ name, number, description }: RoomHallsForm) => {
    setIsLoadingSubmit(true);
    try {
      const params = {
        name,
        number,
        description,
      };
      const response = await roomHallsService.create<RoomHallsForm>(params);
      setRoomHalls((prev) => [...prev, response.data.data]);
      toast.success("Room/Hall added successfully");
      console.log("response after submitting roomHalls", response.data.data);
    } catch (error) {
      console.log("Error while saving room hall", error);
      toast.error("Error while saving room hall");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateRoomHall = async (data: UpdateRoomHallsForm) => {
    try {
      const { id, name, number, description } = data;
      const params = {
        id,
        name,
        number,
        description,
      };

      const originalRoomHall = [...roomHalls];
      const response = await roomHallsService.update<UpdateRoomHallsForm>(
        params
      );
      console.log("response after updating room hall", response.data.data);
      toast.success("Room/Hall updated successfully");
      setRoomHalls((prev) =>
        prev.map((roomHall) =>
          roomHall.id === id ? response.data.data : roomHall
        )
      );
    } catch (error) {
      console.log("Error while updating room hall", error);
      toast.error("Error while updating room hall");
    }
  };

  const deleteRoomHall = async (id: number) => {
    try {
      const response = await roomHallsService.delete(id);
      toast.success("Room/Hall deleted successfully");
      console.log("response after deleting room hall", response);
    } catch (error) {
      toast.error("Error while deleting room hall");
      console.log("Error while deleting room hall", error);
    }
  };

  return {
    pagination,
    edgeLinks,
    roomHalls,
    isLoading,
    isLoadingSubmit,
    saveRoomHall,
    updateRoomHall,
    deleteRoomHall,
  };
};

export default useRoomHalls;
