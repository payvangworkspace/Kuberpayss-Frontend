"use client";
import Table from "@/app/ui/table/Table";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { loadingMsg } from "@/app/utils/message";
const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={3} className="text-center">
            {loadingMsg("transfer mode")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.countryId | "NA"}>
                <td>{item.transferModeName || "NA"}</td>
                <td>{item.transferModeCode || "NA"}</td>
                <td>
                  <i
                    className="bi bi-trash-fill text-danger"
                    title="Delete"
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No Transfer Mode Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const TransferModeList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.getTransferMode);
  useEffect(() => {
    postData(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword
      )
    );
  }, [currentPage, keyword]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="wrapper">
      <Table
        headers={headers}
        currentPage={response?.data.pageNumber || 0}
        // totalPages={response.data.totalPage}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || null}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link="/home/settings/transfer-mode/add-transfer-mode"
        onChange={handleKeyword}
        download={false}
      >
        <BodyMapping data={response?.data.data || null} loading={loader} />
      </Table>
    </div>
  );
};

export default TransferModeList;
