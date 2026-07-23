"use client";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import {
  queryStringWithKeyword,
  queryStringWithKeywordAndUserId,
} from "@/app/services/queryString";
import React, { useEffect, useState } from "react";
import { headers } from "./Columns";
import ViewPermissions from "../modals/ViewPermissions";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Link from "next/link";
import styles from "./SubMerchants.module.css";

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

const SubMerchantList = ({ role, userId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [merchantSearch, setMerchantSearch] = useState("");
  const [successAction, setSuccessAction] = useState(false);
  const [viewPermission, setViewPermission] = useState(false);
  const [user, setUser] = useState(null);

  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.allSubMerchant);

  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });

  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    if (role) {
      setMerchant({
        id: userId,
        name: "All",
      });
      return;
    }
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        merchantSearch || ""
      )
    ).catch(() => {});
  }, [merchantSearch, role, userId]);

  useEffect(() => {
    postData(
      queryStringWithKeywordAndUserId(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword,
        merchant.id || ""
      )
    ).catch(() => {});
  }, [currentPage, keyword, merchant.id, successAction]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword, merchant.id]);

  const handleChangeMerchant = (id, name) => {
    setMerchant({ id, name });
  };

  const handleViewPermissions = (data) => {
    setUser(data);
    setViewPermission(true);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    const totalPage = response?.data?.totalPage || 1;
    if (currentPage + 1 >= totalPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const rows = response?.data?.data || [];
  const totalElement = response?.data?.totalElement || 0;
  const pageSize = response?.data?.pageSize || 0;
  const pageNumber = response?.data?.pageNumber || 0;
  const totalPage = response?.data?.totalPage || 1;

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
          data={user}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewPermission(false)}
        />
      )}

      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Team Management</p>
          <h2 className={styles.title}>Sub Merchants</h2>
          <p className={styles.subtitle}>
            View and manage sub merchants linked to merchant accounts.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>
            <i className="bi bi-person-badge-fill" aria-hidden="true" />
          </span>
          <div>
            <span className={styles.summaryLabel}>Total Sub Merchants</span>
            <p className={styles.summaryValue}>
              {totalElement.toLocaleString()}
            </p>
            <span className={styles.summaryMeta}>
              Page {Math.min(pageNumber + 1 || currentPage + 1, totalPage)} of{" "}
              {totalPage}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        {!role && (
          <div className={styles.filterField}>
            <Label htmlFor="merchant" label="Merchant" />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={merchant}
              options={merchantResponse?.data?.data}
              onChange={handleChangeMerchant}
              id="userId"
              value="fullName"
              search={true}
              onSearch={(id, value) => setMerchantSearch(value)}
            />
          </div>
        )}

        <div className={styles.searchWrap}>
          <i
            className={`bi bi-search ${styles.searchIcon}`}
            aria-hidden="true"
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email or contact..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {role && (
          <Link
            href="/home/team/sub-merchants/add-sub-merchant"
            className={styles.addBtn}
          >
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Add Sub Merchant
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
                          style={{ width: 120, height: 12 }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.shimmer}
                        style={{ width: 150, height: 12 }}
                      />
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
                        style={{ width: 160, height: 12 }}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.shimmer} ${styles.skelButton}`}
                      />
                    </td>
                  </tr>
                ))
              ) : rows.length > 0 ? (
                rows.map((item) => (
                  <tr key={item.userId || item.appKey}>
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
                    <td className={styles.usernameCell}>
                      {item.userId || "NA"}
                    </td>
                    <td className={styles.mutedCell}>
                      {item.contactNumber || "NA"}
                    </td>
                    <td className={styles.mutedCell}>{item.appKey || "NA"}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.permissionBtn}
                        onClick={() => handleViewPermissions(item)}
                      >
                        <i className="bi bi-list-check" aria-hidden="true" />
                        Permissions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    No Sub Merchant Available
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

export default SubMerchantList;
