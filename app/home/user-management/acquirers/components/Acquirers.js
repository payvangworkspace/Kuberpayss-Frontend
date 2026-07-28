"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import Table from "@/app/ui/table/Table";
import usePostRequest from "@/app/hooks/usePost";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { loadingMsg } from "@/app/utils/message";

const BodyMapping = ({ data = [], loading }) => {
  const router = useRouter();
  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/acquirers/${encryptParams(userId)}`);
  };
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={4} className="text-center">
            {loadingMsg("acquirer")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.acquirerId}>
                <td>{item.fullName}</td>
                <td>{item.acquirerCode}</td>
                <td>{item.payin ? "Active" : "Inactive"}</td>
                <td className="actions">
                  <span className="d-flex gap-3">
                    <i
                      className="bi bi-person-fill text-info"
                      title="Profile"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProfileClick(item.acquirerId)}
                    ></i>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No Acquirer Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const Acquirers = ({ admin }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.users.acquirerList);

  // handling search keyword
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);

  useEffect(() => {
    postData(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
      ),
    );
  }, [currentPage, keyword]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);

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
        totalElement={response?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={admin ? "/home/user-management/acquirers/add-acquirer" : null}
        download={false}
        onChange={handleKeyword}
      >
        <BodyMapping data={response?.data.data || null} loading={loader} />
      </Table>
    </div>
  );
};

export default Acquirers;
