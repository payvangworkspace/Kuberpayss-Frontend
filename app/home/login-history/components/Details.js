"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Table from "@/app/ui/table/Table";
import { headers } from "./Column";
import { useEffect, useState } from "react";
import Label from "@/app/ui/label/Label";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import { queryStringWithKeyword } from "@/app/services/queryString";
import useTableExports from "@/app/hooks/useTableExports";
import ExportExcel from "../model/ExportExcelModel";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={3}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("login")}
            </div>
          </td>
        </tr>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <tr key={item.userActivityId}>
            <td>{item.userActivityId}</td>
            <td>{item.createdBy}</td>
            <td>{item.createdDate}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>
            <div className={tableStyles.emptyMessage}>
              No Login History Available
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = ({ role }) => {
  const [merchants, setMerchants] = useState([]);
  const {
    response: merchantList,
    postData: getMerchantData,
    error,
  } = usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    getMerchantData(queryStringWithKeyword(0));
  }, []);

  const [merchant, setMerchant] = useState({ id: "", name: "Select Merchant" });
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  useEffect(() => {
    if (merchantList && !error) {
      setMerchant({
        id: merchantList?.data?.data[0]?.userId || "",
        name: merchantList?.data?.data[0]?.fullName || "MY",
      });
      const updatedMerchants = [
        ...merchantList.data.data,
        { userId: "", fullName: "MY" },
      ];
      setMerchants(updatedMerchants);
    }
  }, [merchantList, error]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const {
    postData: getLoginData,
    response: loginData,
    loading: loginLoading,
  } = usePostRequest(endPoints.loginHistoryDetail);

  const fetchLoginHistory = () => {
    getLoginData({
      userName: merchant.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  };

  useEffect(() => {
    fetchLoginHistory();
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currentPage]);

  const handleApplyFilters = () => {
    if (currentPage === 0) {
      fetchLoginHistory();
    } else {
      setCurrentPage(0);
    }
  };

  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
    setCurrentPage(0);
  };

  const { showModal, handleViewModal } = useTableExports(headers);

  return (
    <>
      {showModal && (
        <ExportExcel
          downloadUrl={endPoints.downloadLoginHistory}
          downloadData={{
            userName: merchant.id,
            dateFrom: dateRange.dateFrom,
            dateTo: dateRange.dateTo,
            merchantName: merchant.name,
          }}
          onClose={handleViewModal}
          source="login-history_report"
        />
      )}
      <div className={`wrapper ${styles.page}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Security</p>
            <h1 className={styles.title}>Login History</h1>
            <p className={styles.subtitle}>
              Track user login activity by merchant and date range
            </p>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterHeader}>
            <span className={styles.filterHeaderIcon}>
              <i className="bi bi-funnel" aria-hidden="true" />
            </span>
            <h5 className={styles.filterHeaderTitle}>Filters</h5>
          </div>
          <div className={styles.filterRow}>
            {role && (
              <div className={styles.filterField}>
                <Label htmlFor="merchant" label="Merchant" />
                <div className={styles.iconField}>
                  <i
                    className={`bi bi-people ${styles.fieldIcon}`}
                    aria-hidden="true"
                  />
                  <Dropdown
                    initialLabel="Select Merchant"
                    selectedValue={merchant}
                    options={merchants}
                    onChange={handleMerchantChange}
                    id="userId"
                    value="fullName"
                  />
                </div>
              </div>
            )}
            <div className={styles.filterField}>
              <Label htmlFor="dateFrom" label="Date From" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-calendar3 ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="date"
                  id="inputDate"
                  name="dateFrom"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  value={inputFieldDateFormatter(dateRange.dateFrom)}
                />
              </div>
            </div>
            <div className={styles.filterField}>
              <Label htmlFor="dateTo" label="Date To" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-calendar3 ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="date"
                  id="inputDate"
                  name="dateTo"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  value={inputFieldDateFormatter(dateRange.dateTo)}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.applyBtn}
              onClick={handleApplyFilters}
            >
              <i className="bi bi-funnel-fill" aria-hidden="true" />
              Apply Filters
            </button>
          </div>
        </div>

        <Table
          headers={headers}
          currentPage={loginData?.data?.pageNumber || 0}
          pageSize={loginData?.data?.pageSize || 0}
          totalElement={loginData?.data?.totalElement || 0}
          search={false}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          handleExportExcelModel={handleViewModal}
        >
          <BodyMapping
            data={loginData?.data?.data || []}
            loading={loginLoading}
          />
        </Table>
      </div>
    </>
  );
};

export default Details;
