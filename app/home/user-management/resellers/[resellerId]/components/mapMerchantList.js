import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { headers } from "./column";
import { loadingMsg } from "@/app/utils/message";
import { queryStringWithDate } from "@/app/services/queryString";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import useDeleteRequest from "@/app/hooks/useDelete";

const BodyMapping = ({ data = [], loading = true }) => {
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [resellerMerchantId, setResellerMerchantId] = useState(null);

  const {
    response: deleteResponse,
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDeleteRequest();

  const handleViewDeleteWarning = (id) => {
    setViewDeleteWarning(true);
    setResellerMerchantId(id);
  };

  const handleConfirmDelete = async () => {
    await deleteData(
      endPoints.mapping.deleteResellerMapping + resellerMerchantId
    );
    window.location.reload();

    setViewDeleteWarning(false);
  };

  return (
    <tbody>
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {!loading ? (
        <tr>
          <td colSpan={5} className="text-center">
            {loadingMsg("resellers")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.resellerMerchantId}>
                <td>{item.merchantId.userId || "NA"}</td>
                <td>{item.merchantId.fullName || "NA"}</td>
                <td>{item.fixCharge ? "Fix Charge" : "Percentage" || "NA"}</td>
                <td>{item.vendorCharge || "NA"}</td>
                <td>
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleViewDeleteWarning(item.resellerMerchantId)
                    }
                    className="bi bi-trash text-danger"
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No data Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

export default function MapMerchantList({ userId }) {
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const [successAction, setSuccessAction] = useState(false);
  const {
    postData: getMapData,
    response: mapData,
    loading: mapLoadingData,
  } = usePostRequest(endPoints.settings.allMapMerchant);

  useEffect(() => {
    getMapData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
        "",
        "",
        "",
        userId,
        "",
        ""
      )
    );
  }, [keyword]);

  useEffect(() => {
    if (mapLoadingData) setLoader(true);
  }, [mapLoadingData]);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className={styles.mainCard}>
      <Table
        headers={headers}
        currentPage={mapData?.data.pageNumber || 0}
        pageSize={mapData?.data.pageSize || 0}
        totalElement={mapData?.data.totalElement || null}
        handleNext={handleNext}
        handlePrev={handlePrev}
        search={true}
        download={false}
        onChange={handleKeyword}
      >
        <BodyMapping
          successAction={() => setSuccessAction(!successAction)}
          loading={loader}
          data={mapData?.data.data || null}
        />
      </Table>
    </div>
  );
}
