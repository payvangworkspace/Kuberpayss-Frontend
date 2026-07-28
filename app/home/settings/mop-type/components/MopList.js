"use client";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { queryString } from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
const BodyMapping = ({ data = [] }) => {
  return (
    <tbody>
      {data.length > 0 ? (
        data.map((item) => (
          <tr key={item.mopTypeId}>
            <td>{item.mopTypeName}</td>
            <td>{item.mopTypeCode}</td>
            <td></td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No MOP Type Available</td>
        </tr>
      )}
    </tbody>
  );
};
const MopList = ({ isMerchant, isAdmin }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { loading, error, response = [], getData } = useGetRequest();
  useEffect(() => {
    getData(endPoints.settings.mop + queryString(currentPage));
  }, [currentPage]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  if (loading)
    return <p className="text-center">Fetching Data...Please Wait</p>;
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );
  if (response)
    return (
      <div className="wrapper">
        <Table
          headers={headers}
          currentPage={response.pageNumber}
          // totalPages={response.totalPage}
          pageSize={response.pageSize}
          totalElement={response.totalElement}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={
            (isAdmin || isMerchant) && "/home/settings/mop-type/add-mop-type"
          }
          download={false}
        >
          <BodyMapping data={response.data} />
        </Table>
      </div>
    );
};

export default MopList;
