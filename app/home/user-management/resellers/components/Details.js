"use client";
import { useState, useEffect } from "react";
import { queryStringWithDate } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { headers } from "./Column";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import ViewPermissions from "../modal/viewPermissions";
import useGetRequest from "@/app/hooks/useFetch";
import { dateFormatter } from "@/app/utils/dateFormatter";
import Link from "next/link";
import styles from "./Resellers.module.css";

const AVATAR_TONES = [
  styles.toneNavy,
  styles.toneGold,
  styles.toneTeal,
  styles.toneBlue,
  styles.tonePurple,
  styles.toneOrange,
];

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const avatarTone = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
};

const Details = ({ role, userEmail, subAdmin }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [successAction, setSuccessAction] = useState(false);
  const [viewPermission, setViewPermission] = useState(false);
  const [reseller, setReseller] = useState(null);

  const {
    postData: getResellerData,
    response: resellerData,
    loading,
    error,
  } = usePostRequest(endPoints.settings.allResellers);

  useEffect(() => {
    getResellerData(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
        "",
        "",
        "",
        ""
      )
    ).catch(() => {});
  }, [currentPage, successAction, keyword]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const { response: permissionResponse, getData: permissionData } =
    useGetRequest();

  useEffect(() => {
    if (subAdmin && userEmail) {
      permissionData(endPoints.settings.getPermission + userEmail);
    }
  }, [subAdmin, userEmail]);

  const canAdd =
    role || (subAdmin && permissionResponse?.data?.addMerchant);

  const resellers = resellerData?.data?.data || [];
  const totalElement = resellerData?.data?.totalElement || 0;
  const pageSize = resellerData?.data?.pageSize || 0;
  const totalPage =
    resellerData?.data?.totalPages || resellerData?.data?.totalPage || 1;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if ((currentPage + 1) * pageSize >= totalElement) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/resellers/${encryptParams(userId)}`);
  };

  const handleViewPermissions = (item) => {
    setReseller(item);
    setViewPermission(true);
  };

  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className={styles.page}>
      {viewPermission && (
        <ViewPermissions
          data={reseller}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewPermission(!viewPermission)}
        />
      )}

      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Partner Management</p>
          <h2 className={styles.title}>Resellers</h2>
          <p className={styles.subtitle}>
            View and manage reseller accounts, status, and permissions.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>
            <i className="bi bi-diagram-3-fill" aria-hidden="true" />
          </span>
          <div>
            <span className={styles.summaryLabel}>Total Resellers</span>
            <p className={styles.summaryValue}>
              {totalElement.toLocaleString()}
            </p>
            <span className={styles.summaryMeta}>
              Page {Math.min(currentPage + 1, totalPage || 1)} of{" "}
              {totalPage || 1}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <i className={`bi bi-search ${styles.searchIcon}`} aria-hidden="true" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, id or phone..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {canAdd && (
          <Link
            href="/home/user-management/resellers/add-reseller"
            className={styles.addBtn}
          >
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Add Reseller
          </Link>
        )}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 140, height: 12 }}
                      />
                    </td>
                    <td>
                      <div className={styles.nameCell}>
                        <span
                          className={`${styles.shimmer} ${styles.skelAvatar}`}
                        />
                        <span
                          className={styles.shimmer}
                          style={{ width: 100, height: 12 }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 90, height: 12 }}
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
                        style={{ width: 90, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.shimmer} ${styles.skelBadge}`}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.shimmer} ${styles.skelIcon}`}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.shimmer} ${styles.skelButton}`}
                      />
                    </td>
                  </tr>
                ))
              ) : resellers.length > 0 ? (
                resellers.map((item) => (
                  <tr key={item.userId}>
                    <td className={styles.idCell}>{item.userId || "NA"}</td>
                    <td>
                      <div className={styles.nameCell}>
                        <span
                          className={`${styles.avatar} ${avatarTone(
                            item.fullName || item.userId || ""
                          )}`}
                        >
                          {getInitials(item.fullName)}
                        </span>
                        <span className={styles.nameText}>
                          {item.fullName || "NA"}
                        </span>
                      </div>
                    </td>
                    <td className={styles.mutedCell}>
                      {item.contactNumber || "NA"}
                    </td>
                    <td className={styles.mutedCell}>
                      {item.createdBy || "NA"}
                    </td>
                    <td>
                      <span className={styles.dateCell}>
                        <i className="bi bi-calendar3" aria-hidden="true" />
                        {item.createdDate
                          ? dateFormatter(item.createdDate)
                          : "NA"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          item.status
                            ? styles.badgeActive
                            : styles.badgeInactive
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        title="Permissions"
                        onClick={() => handleViewPermissions(item)}
                      >
                        <i className="bi bi-list-check" aria-hidden="true" />
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => handleProfileClick(item.userId)}
                      >
                        <i className="bi bi-person-fill" aria-hidden="true" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.emptyCell}>
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
    </div>
  );
};

export default Details;
