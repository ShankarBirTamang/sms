import { useState } from "react";
import { PaginationAndSearch } from "../../Interface/Interface";
import { PaginationProps } from "../../components/Pagination/Pagination";

const useAdmitCard = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [admitCards, setAdmitCards] = useState([]);
  const [error, setError] = useState<string | null>(null);

  //For Pagination
  const [pagination, setPagination] =
    useState<PaginationProps["pagination"]>(null);
  const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
  return {
    pagination,
    edgeLinks,
    isLoading,
  };
};

export default useAdmitCard;
