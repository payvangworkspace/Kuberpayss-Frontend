"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import usePostRequest from "@/app/hooks/usePost";
import { loadingMsg } from "@/app/utils/message";
import { dateFormatter } from "@/app/utils/dateFormatter";
import useGetRequest from "@/app/hooks/useFetch";

const BodyMapping = ({ data = [], loading }) => {
  const router = useRouter();

  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/merchants/${encryptParams(userId)}`);
  };

  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={7} className="text-center">
            {loadingMsg("merchant")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userId}>
                <td>{item.fullName}</td>
                <td>{item.contactNumber}</td>
                <td>{item.userId}</td>
                <td>{item.businessName}</td>
                <td>
                  {item.createdDate ? dateFormatter(item.createdDate) : "NA"}
                </td>
                <td>
                  {item.verificationDate
                    ? dateFormatter(item.verificationDate)
                    : "NA"}
                </td>
                <td className="actions">
                  <span className="d-flex gap-3">
                    <i
                      className="bi bi-person-fill text-info"
                      title="Profile"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProfileClick(item.userId)}
                    ></i>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No Merchant Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const MerchantList = ({ subAdmin, userEmail, role }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);

  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.users.merchantList);
  console.log("🚀 ~ MerchantList ~ response:", response);

  useEffect(() => {
    const payload = {
      start: currentPage,
      // start: currentPage + 1,
      size: Number(process.env.NEXT_PUBLIC_PAGINATION_SIZE),
      keyword: keyword || "",
      sortOrder: sortOrder, // ASC or DESC
    };

    postData(payload);
  }, [currentPage, keyword, sortOrder]);
  useEffect(() => {
    setCurrentPage(0); // reset to first page
  }, [keyword, sortOrder]);

  // Check permission

  const { response: permissionResponse, getData: permissionData } =
    useGetRequest();

  useEffect(() => {
    if (subAdmin && userEmail) {
      permissionData(endPoints.settings.getPermission + userEmail);
    }
  }, [subAdmin, userEmail]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentPage + 1 >= response?.data?.totalPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  // ✅ SORT STATE
  // const [sortOrder, setSortOrder] = useState("desc"); // default latest

  const handleLatest = () => setSortOrder("DESC");
  const handleOldest = () => setSortOrder("ASC");

  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="wrapper">
      {/* ✅ SORT BUTTONS */}
      <div className="d-flex gap-2 mb-2">
        <button
          className={`btn btn-sm ${
            sortOrder === "DESC" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSortOrder("DESC")}
        >
          Latest First
        </button>

        <button
          className={`btn btn-sm ${
            sortOrder === "ASC" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSortOrder("ASC")}
        >
          Oldest First
        </button>
      </div>

      <Table
        headers={headers}
        currentPage={currentPage}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        // link="/home/user-management/merchants/add-merchant"
        link={
          role || (subAdmin && permissionResponse?.data?.addMerchant)
            ? "/home/user-management/merchants/add-merchant"
            : ""
        }
        download={false}
        onChange={handleKeyword}
      >
        <BodyMapping data={response?.data?.data || []} loading={loader} />
      </Table>
    </div>
  );
};

export default MerchantList;
