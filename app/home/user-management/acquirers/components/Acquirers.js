"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import usePostRequest from "@/app/hooks/usePost";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Link from "next/link";
import styles from "./Acquirers.module.css";

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

const Acquirers = ({ admin }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);

  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.users.acquirerList);

  useEffect(() => {
    postData(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
      ),
    ).catch(() => {});
  }, [currentPage, keyword]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const acquirers = response?.data?.data || [];
  const totalElement = response?.data?.totalElement || 0;
  const pageSize = response?.data?.pageSize || 0;
  const totalPage = response?.data?.totalPage || 1;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if ((currentPage + 1) * pageSize >= totalElement) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/acquirers/${encryptParams(userId)}`);
  };

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
          <p className={styles.eyebrow}>Payment Routing</p>
          <h2 className={styles.title}>Acquirer Setup</h2>
          <p className={styles.subtitle}>
            View and manage acquirer integrations and payin status.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>
            <i className="bi bi-bank2" aria-hidden="true" />
          </span>
          <div>
            <span className={styles.summaryLabel}>Total Acquirers</span>
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
            placeholder="Search by name or code..."
            onChange={handleKeyword}
          />
        </div>

        {admin && (
          <Link
            href="/home/user-management/acquirers/add-acquirer"
            className={styles.addBtn}
          >
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Add Acquirer
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
                        className={`${styles.shimmer} ${styles.skelButton}`}
                      />
                    </td>
                  </tr>
                ))
              ) : acquirers.length > 0 ? (
                acquirers.map((item) => (
                  <tr key={item.acquirerId}>
                    <td>
                      <div className={styles.nameCell}>
                        <span
                          className={`${styles.avatar} ${avatarTone(
                            item.fullName || item.acquirerCode || ""
                          )}`}
                        >
                          {getInitials(item.fullName)}
                        </span>
                        <span className={styles.nameText}>
                          {item.fullName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className={styles.codeCell}>
                      {item.acquirerCode || "—"}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          item.payin
                            ? styles.badgeActive
                            : styles.badgeInactive
                        }`}
                      >
                        {item.payin ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => handleProfileClick(item.acquirerId)}
                      >
                        <i className="bi bi-person-fill" aria-hidden="true" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.emptyCell}>
                    No Acquirer Available
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

export default Acquirers;
