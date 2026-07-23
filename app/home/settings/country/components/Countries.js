"use client";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { endPoints } from "@/app/services/apiEndpoints";
import { useEffect, useState } from "react";
import Table from "@/app/ui/table/Table";
import { headers } from "./Columns";
import usePostRequest from "@/app/hooks/usePost";
import styles from "../../settingsList.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const SKELETON_ROWS = 8;
const SKELETON_WIDTHS = [140, 70, 110, 80, 60];

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
          <tr key={item.countryId || "NA"}>
            <td>{item.countryName || "NA"}</td>
            <td>{item.countryCode || "NA"}</td>
            <td>{item.countryCapital || "NA"}</td>
            <td>{item.countryNumericCode || "NA"}</td>
            <td>{item.countryPhoneCode || "NA"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5}>
            <div className={tableStyles.emptyMessage}>No Country Available</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const CountryList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.countryList);

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
          <h1 className={styles.title}>Country Setup</h1>
          <p className={styles.subtitle}>
            Search, manage, and add supported countries
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
        link="/home/settings/country/add-country"
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

export default CountryList;
