"use client";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { queryString } from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
import styles from "../../settingsList.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const SKELETON_ROWS = 8;
const SKELETON_WIDTHS = [150, 90];

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
          <tr key={item.mopTypeId}>
            <td>{item.mopTypeName}</td>
            <td>{item.mopTypeCode}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2}>
            <div className={tableStyles.emptyMessage}>
              No MOP Type Available
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const MopList = ({ isMerchant, isAdmin }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { loading, error, response = [], getData } = useGetRequest();

  useEffect(() => {
    getData(endPoints.settings.mop + queryString(currentPage));
  }, [currentPage]);

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
          <h1 className={styles.title}>MOP Setup</h1>
          <p className={styles.subtitle}>
            Manage modes of payment available in the system
          </p>
        </div>
      </div>

      <Table
        headers={headers}
        currentPage={response?.pageNumber || 0}
        pageSize={response?.pageSize || 0}
        totalElement={response?.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={
          (isAdmin || isMerchant) && "/home/settings/mop-type/add-mop-type"
        }
        download={false}
      >
        <BodyMapping data={response?.data || []} loading={loading} />
      </Table>
    </div>
  );
};

export default MopList;
