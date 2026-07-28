"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import { queryStringWithDate } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { loadingMsg } from "@/app/utils/message";
import { headers } from "./Column";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import ViewPermissions from "../modal/viewPermissions";
import useGetRequest from "@/app/hooks/useFetch";

const BodyMapping = ({ data, loading = true, successAction }) => {
  const router = useRouter();
  const [viewPermission, setViewPermission] = useState(false);
  const [reseller, setReseller] = useState(null);
  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/resellers/${encryptParams(userId)}`);
  };
  const handleViewPermissions = (data) => {
    setReseller(data);
    setViewPermission(true);
  };
  return (
    <>
      {viewPermission && (
        <ViewPermissions
          data={reseller}
          onSuccess={successAction}
          onClose={() => setViewPermission(!viewPermission)}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={8} className="text-center">
              {loadingMsg("remittance")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.userId}>
                  <td>{item.userId || "NA"}</td>
                  <td>{item.fullName || "NA"}</td>
                  <td>{item.contactNumber || "NA"}</td>
                  <td>{item.createdBy || "NA"}</td>
                  <td>{item.createdDate || "NA"}</td>
                  <td>{item.status ? "Active" : "Inactive" || "NA"}</td>
                  <td>
                    <i
                      className="bi bi-list-check"
                      onClick={() => {
                        handleViewPermissions(item);
                      }}
                    ></i>
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
                <td colSpan={8} className="text-center">
                  No data Available
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};
const Details = ({ role, userEmail, subAdmin }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const [successAction, setSuccessAction] = useState(false);

  const {
    postData: getResellerData,
    response: resellerData,
    loading: loadingResellerData,
  } = usePostRequest(endPoints.settings.allResellers);

  useEffect(() => {
    getResellerData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        "",
        "",
        "",
        ""
      )
    );
  }, [currentPage, successAction]);

  useEffect(() => {
    if (loadingResellerData) setLoader(true);
  }, [loadingResellerData]);

  const { response: permissionResponse, getData: permissionData } =
  useGetRequest();

useEffect(() => {
  if (subAdmin && userEmail) {
    permissionData(endPoints.settings.getPermission + userEmail);
  }
}, [subAdmin, userEmail]);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  return (
    <div className="wrapper">
      <Table
        headers={headers}
        currentPage={resellerData?.data.pageNumber || 0}
        totalPages={resellerData?.data.totalPages || 0}
        pageSize={resellerData?.data.pageSize || 0}
        totalElement={resellerData?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        // link="/home/user-management/resellers/add-reseller"
        link={
          role || (subAdmin && permissionResponse?.data?.addMerchant)
            ? "/home/user-management/resellers/add-reseller"
            : ""
        }
        search={false}
        download={false}
      >
        <BodyMapping
          successAction={() => setSuccessAction(!successAction)}
          loading={loader}
          data={resellerData?.data?.data || null}
        />
      </Table>
    </div>
  );
};

export default Details;
