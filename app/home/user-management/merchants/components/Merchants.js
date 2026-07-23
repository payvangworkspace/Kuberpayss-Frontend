"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import usePostRequest from "@/app/hooks/usePost";
import { dateFormatter } from "@/app/utils/dateFormatter";
import useGetRequest from "@/app/hooks/useFetch";
import Link from "next/link";
import styles from "./Merchants.module.css";

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

const MerchantList = ({ subAdmin, userEmail, role }) => {
  const router = useRouter();
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

  useEffect(() => {
    const payload = {
      start: currentPage,
      size: Number(process.env.NEXT_PUBLIC_PAGINATION_SIZE),
      keyword: keyword || "",
      sortOrder: sortOrder,
    };

    postData(payload).catch(() => {});
  }, [currentPage, keyword, sortOrder]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword, sortOrder]);

  const { response: permissionResponse, getData: permissionData } =
    useGetRequest();

  useEffect(() => {
    if (subAdmin && userEmail) {
      permissionData(endPoints.settings.getPermission + userEmail);
    }
  }, [subAdmin, userEmail]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentPage + 1 >= response?.data?.totalPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/merchants/${encryptParams(userId)}`);
  };

  const canAdd =
    role || (subAdmin && permissionResponse?.data?.addMerchant);

  const merchants = response?.data?.data || [];
  const totalElement = response?.data?.totalElement || 0;
  const pageSize = response?.data?.pageSize || 0;
  const totalPage = response?.data?.totalPage || 1;

  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Merchant Management</p>
          <h2 className={styles.title}>Merchants</h2>
          <p className={styles.subtitle}>
            View and manage all registered merchants in the system.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>
            <i className="bi bi-people-fill" aria-hidden="true" />
          </span>
          <div>
            <span className={styles.summaryLabel}>Total Merchants</span>
            <p className={styles.summaryValue}>
              {totalElement.toLocaleString()}
            </p>
            <span className={styles.summaryMeta}>
              Page {Math.min(currentPage + 1, totalPage)} of {totalPage}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.sortGroup}>
          <button
            type="button"
            className={`${styles.sortBtn} ${
              sortOrder === "DESC" ? styles.sortActive : ""
            }`}
            onClick={() => setSortOrder("DESC")}
          >
            Latest First
          </button>
          <button
            type="button"
            className={`${styles.sortBtn} ${
              sortOrder === "ASC" ? styles.sortActive : ""
            }`}
            onClick={() => setSortOrder("ASC")}
          >
            Oldest First
          </button>
        </div>

        <div className={styles.searchWrap}>
          <i className={`bi bi-search ${styles.searchIcon}`} aria-hidden="true" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, username or business..."
            onChange={handleKeyword}
          />
        </div>

        {canAdd && (
          <Link
            href="/home/user-management/merchants/add-merchant"
            className={styles.addBtn}
          >
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Add Merchant
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
                Array.from({ length: 8 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                    <td>
                      <div className={styles.nameCell}>
                        <span
                          className={`${styles.shimmer} ${styles.skelAvatar}`}
                        />
                        <span
                          className={styles.shimmer}
                          style={{ width: 140, height: 12 }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 100, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 170, height: 12 }}
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
                        className={styles.shimmer}
                        style={{ width: 90, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.shimmer} ${styles.skelButton}`}
                      />
                    </td>
                  </tr>
                ))
              ) : merchants.length > 0 ? (
                merchants.map((item) => (
                  <tr key={item.userId}>
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
                          {item.fullName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className={styles.mutedCell}>
                      {item.contactNumber || "—"}
                    </td>
                    <td className={styles.usernameCell}>
                      {item.userId || "—"}
                    </td>
                    <td className={styles.mutedCell}>
                      {item.businessName || "N/A"}
                    </td>
                    <td>
                      <span className={styles.dateCell}>
                        <i className="bi bi-calendar3" aria-hidden="true" />
                        {item.createdDate
                          ? dateFormatter(item.createdDate)
                          : "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={styles.dateCell}>
                        <i className="bi bi-calendar3" aria-hidden="true" />
                        {item.verificationDate
                          ? dateFormatter(item.verificationDate)
                          : "N/A"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => handleProfileClick(item.userId)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    No Merchant Available
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

export default MerchantList;
