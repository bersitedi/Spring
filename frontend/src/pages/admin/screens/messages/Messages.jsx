import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../../components/DataTable";
import { useDataTableMessages } from "../../../../hooks/useDataTableMessages";
import { deleteMessage } from "../../../../services/index/messages";

const Messages = () => {
  const itemsPerPage = 10;
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "https://spring-97bs.onrender.com";

  const {
    searchKeyword,
    currentPage,
    isLoading,
    isFetching,
    data: messagesData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    setCurrentPage,
    refetchData,
    deleteMessageHandler,
  } = useDataTableMessages({
    mutateDeleteFn: deleteMessage,
    dataQueryFn: async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/messages?searchKeyword=${searchKeyword}&page=${currentPage}&limit=${itemsPerPage}`
        );
        const { data, headers } = response;
        return { data, headers };
      } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
    },
    dataQueryKey: "messages",
    deleteDataMessage: null,
    itemsPerPage,
  });
  useEffect(() => {
    const storedPage = localStorage.getItem("messages_current_page");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage));
    }
  }, [setCurrentPage]);

  useEffect(() => {
    localStorage.setItem("messages_current_page", currentPage.toString());
  }, [currentPage]);

  const navigate = useNavigate();

  if (!messagesData) {
    return <div>Loading...</div>;
  }

  const messages = messagesData.data || [];

  const handleDeleteMessage = (id) => {
    deleteMessageHandler(id);
  };

  return (
    <DataTable
      pageTitle="Messages"
      dataListName="All Messages"
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchInputPlaceHolder="Search email..."
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Email", "Subject", "Message", "Date", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={messages}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={messagesData.headers}
    >
      {messages.map((message) => (
        <tr key={message._id}>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.email}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.subject}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.message}
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-5">
            <button
              type="button"
              onClick={() => handleDeleteMessage(message._id)}
              className="text-red-600 hover:text-green-900"
            >
              Delete
            </button>
            <button
              onClick={() =>
                navigate(`/admin/messages/manage/view/${message._id}`)
              }
              className="text-green-600 hover:text-green-900"
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Messages;
