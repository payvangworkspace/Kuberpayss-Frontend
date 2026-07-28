"use client";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { endPoints } from "@/app/services/apiEndpoints";
import { useEffect, useState } from "react";
import Table from "@/app/ui/table/Table";
import { headers } from "./Columns";
import usePostRequest from "@/app/hooks/usePost";
import { loadingMsg } from "@/app/utils/message";
const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={5} className="text-center">
            {loadingMsg("country")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.countryId | "NA"}>
                <td>{item.countryName || "NA"}</td>
                <td>{item.countryCode || "NA"}</td>
                <td>{item.countryCapital || "NA"}</td>
                <td>{item.countryNumericCode || "NA"}</td>
                <td>{item.countryPhoneCode || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No Country Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const CountryList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.countryList);
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
        link={"/home/settings/country/add-country"}
        onChange={handleKeyword}
        download={false}
      >
        <BodyMapping data={response?.data.data || null} loading={loader} />
      </Table>
    </div>
  );
};

export default CountryList;
