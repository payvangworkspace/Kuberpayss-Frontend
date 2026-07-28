"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { loadingMsg } from "@/app/utils/message";
const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={4} className="text-center">
            {loadingMsg("currency")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.currencyId}>
                <td>{item.currencyName}</td>
                <td>{item.currencyCode}</td>
                <td>{item.symbol ? item.symbol : "NA"}</td>
                <td>{item.currencyDecimalPlace}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No Currency Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const Currency = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.currencyList);
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
        // totalPages={response.totalPage}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || null}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={"/home/settings/currency/add-currency"}
        onChange={handleKeyword}
        download={false}
      >
        <BodyMapping data={response?.data.data || null} loading={loader} />
      </Table>
    </div>
  );
};

export default Currency;
