import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

let isFirstRun = true;

export const useDataTable = ({
  dataQueryFn,
  dataQueryKey,
  mutateDeleteFn,
  deleteDataMessage,
  itemsPerPage = 10, // Default to 10 items per page
}) => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  ); 
  const [totalPages, setTotalPages] = useState(0); // Track total pages

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryFn: () => dataQueryFn(searchKeyword, currentPage, itemsPerPage),
    queryKey: [dataQueryKey],
  });

  const { mutate: mutateDeletePost, isLoading: isLoadingDeleteData } =
    useMutation({
      mutationFn: mutateDeleteFn,
      onSuccess: (data) => {
        queryClient.invalidateQueries([dataQueryKey]);
        toast.success(deleteDataMessage);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  useEffect(() => {
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [refetch, currentPage]);

  useEffect(() => {
    if (!isFirstRun) {
      localStorage.setItem("currentPage", currentPage); // Store currentPage in localStorage
    }
  }, [currentPage]);

  useEffect(() => {
    // Fetch data when the component mounts
    refetch();
  }, [refetch]);

  // Calculate total pages based on total count of messages and items per page
  useEffect(() => {
    if (data && data.headers && data.headers["x-totalcount"]) {
      const totalCount = parseInt(data.headers["x-totalcount"]);
      const totalPagesCount = Math.ceil(totalCount / itemsPerPage);
      setTotalPages(totalPagesCount);
    }
  }, [data, itemsPerPage]);

  const searchKeywordHandler = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };

  const submitSearchKeywordHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const deleteDataHandler = ({ slug, token }) => {
    if (window.confirm("Do you want to delete this record?")) {
      mutateDeletePost({ slug, token });
    }
  };

  return {
    userState,
    currentPage,
    searchKeyword,
    data,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
    totalPages, // Pass totalPages to the component
  };
};
