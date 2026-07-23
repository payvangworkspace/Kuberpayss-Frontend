import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { headers } from "./column";
import { queryStringWithDate } from "@/app/services/queryString";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import useDeleteRequest from "@/app/hooks/useDelete";

export default function MapMerchantList({ userId }) {
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    postData: getMapData,
    response: mapData,
    loading,
  } = usePostRequest(endPoints.settings.allMapMerchant);

  const { deleteData } = useDeleteRequest();

  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [resellerMerchantId, setResellerMerchantId] = useState(null);

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

  useEffect(() => {
    getMapData(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
        "",
        "",
        "",
        userId,
        "",
        ""
      )
    ).catch(() => {});
  }, [keyword, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const mappedMerchants = mapData?.data?.data || [];
  const totalElement = mapData?.data?.totalElement || 0;
  const pageSize = mapData?.data?.pageSize || 0;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if ((currentPage + 1) * pageSize >= totalElement) return;
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <h6 className={styles.tableTitle}>Mapped Merchants</h6>
          <div className={styles.searchWrap}>
            <i
              className={`bi bi-search ${styles.searchIcon}`}
              aria-hidden="true"
            />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search here..."
              onChange={handleKeyword}
            />
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                {headers.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 160, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 110, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 80, height: 22, borderRadius: 999 }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 60, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 26, height: 26, borderRadius: 7 }}
                      />
                    </td>
                  </tr>
                ))
              ) : mappedMerchants.length > 0 ? (
                mappedMerchants.map((item) => (
                  <tr key={item.resellerMerchantId}>
                    <td className={styles.idCell}>
                      {item.merchantId.userId || "NA"}
                    </td>
                    <td>
                      <span className={styles.nameText}>
                        {item.merchantId.fullName || "NA"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          item.fixCharge ? styles.badgeNavy : styles.badgeGold
                        }`}
                      >
                        {item.fixCharge ? "Fix Charge" : "Percentage"}
                      </span>
                    </td>
                    <td>{item.vendorCharge || "NA"}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        title="Remove mapping"
                        onClick={() =>
                          handleViewDeleteWarning(item.resellerMerchantId)
                        }
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    No data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            Prev
          </button>
          <span>
            Result{" "}
            {totalElement === 0 ? currentPage : currentPage * pageSize + 1}-
            {(currentPage + 1) * pageSize < totalElement
              ? (currentPage + 1) * pageSize
              : totalElement}{" "}
            of Total {totalElement}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={(currentPage + 1) * pageSize >= totalElement}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
