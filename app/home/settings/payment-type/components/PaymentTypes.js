"use client";
import { headers } from "./Columns";
import Table from "@/app/ui/table/Table";
import usePaymentTypes from "@/app/hooks/usePaymentType";
import styles from "../../settingsList.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const SKELETON_ROWS = 8;
const SKELETON_WIDTHS = [140, 90, 110, 100, 80];

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
          <tr key={item.paymentTypeId}>
            <td>{item.paymentTypeName}</td>
            <td>{item.paymentTypeCode}</td>
            <td>{item.country?.countryName || "NA"}</td>
            <td>{item.currency?.currencyName}</td>
            <td>{item.currency?.currencyCode}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5}>
            <div className={tableStyles.emptyMessage}>
              No Payment Type Available
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const PaymentTypeList = ({ isAdmin, isMerchant }) => {
  const { loading, error, paymentTypeList, currentPage, handlePageChange } =
    usePaymentTypes();

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
          <h1 className={styles.title}>Payment Type</h1>
          <p className={styles.subtitle}>
            Manage payment types mapped to country and currency
          </p>
        </div>
      </div>

      <Table
        headers={headers}
        currentPage={paymentTypeList?.pageNumber || 0}
        pageSize={paymentTypeList?.pageSize || 0}
        totalElement={paymentTypeList?.totalElement || 0}
        handleNext={() => handlePageChange(currentPage + 1)}
        handlePrev={() => handlePageChange(currentPage - 1)}
        link={
          (isAdmin || isMerchant) &&
          "/home/settings/payment-type/add-payment-type"
        }
        search={false}
        download={false}
      >
        <BodyMapping data={paymentTypeList?.data || []} loading={loading} />
      </Table>
    </div>
  );
};

export default PaymentTypeList;
