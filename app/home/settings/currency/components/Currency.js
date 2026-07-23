"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import styles from "../../settingsList.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const SKELETON_ROWS = 8;
const SKELETON_WIDTHS = [140, 80, 50, 70];

const BodyMapping = ({ data = [], loading }) => {
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
            {SKELETON_WIDTHS.map((width, cellIndex) => (
              <td key={cellIndex}>
                <span
                  className={styles.shimmer}
                  style={{ width, height: 12 }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody>
      {data && data.length > 0 ? (
        data.map((item) => (
          <tr key={item.currencyId}>
            <td>{item.currencyName}</td>
            <td>{item.currencyCode}</td>
            <td>{item.symbol ? item.symbol : "NA"}</td>
            <td>{item.currencyDecimalPlace}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4}>
            <div className={tableStyles.emptyMessage}>
              No Currency Available
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Currency = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.currencyList);

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

  if (error)
    return (
      <p className={styles.errorText}>
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settings</p>
          <h1 className={styles.title}>Currency Setup</h1>
          <p className={styles.subtitle}>
            Search, manage, and add supported currencies
          </p>
        </div>
      </div>

      <Table
        headers={headers}
        currentPage={response?.data?.pageNumber || 0}
        pageSize={response?.data?.pageSize || 0}
        totalElement={response?.data?.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link="/home/settings/currency/add-currency"
        onChange={handleKeyword}
        download={false}
      >
        <BodyMapping
          data={response?.data?.data || []}
          loading={loading}
        />
      </Table>
    </div>
  );
};

export default Currency;
