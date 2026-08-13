"use client";
import Table from "@/app/ui/table/Table";
import { useEffect, useState } from "react";
import { headers } from "./Column";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithDate } from "@/app/services/queryString";
import styles from "../../settlements.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import {
  SUPPORTED_CURRENCIES as currencyTypes,
  getCurrencySymbol,
} from "@/app/utils/currency";

const settlementStatusTypes = [
  { id: 1, name: "ALL" },
  { id: 2, name: "SETTLE" },
  { id: 3, name: "UNSETTLE" },
];

const SKELETON_ROWS = 8;
const SKELETON_WIDTHS = [
  90, 80, 70, 60, 60, 60, 100, 120, 90, 90, 70, 90, 100, 70,
];

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
          <tr key={item.settlementId || item.refundReconciliationId}>
            <td>{item.refundReconciliationId || "NA"}</td>
            <td>{item.refundStatus || "NA"}</td>
            <td>{item.refundAmount || "NA"}</td>
            <td>{item.acquirerCode || "NA"}</td>
            <td>{item.currencyCode || "NA"}</td>
            <td>{item.countryCode || "NA"}</td>
            <td>{item.customerName || "NA"}</td>
            <td>{item.customerEmail || "NA"}</td>
            <td>{item.customerContactNumber || "NA"}</td>
            <td>{item.ordRequestId || "NA"}</td>
            <td>
              {item.netSettleAmount || 0.0}{" "}
              {getCurrencySymbol(item.currencyCode)}
            </td>
            <td>{dateFormatter(item.createdDate)}</td>
            <td>{item.refundHoldReason || "NA"}</td>
            <td>
              {item.settlementStatus === "SETTLE" ? (
                <span className={styles.statusSettled}>SETTLED</span>
              ) : (
                <span className={styles.statusUnsettled}>UNSETTLED</span>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={14}>
            <div className={tableStyles.emptyMessage}>No refund available</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = ({ role, subAdmin, resellerRole }) => {
  const [merchantList, setMerchantList] = useState([]);
  const {
    loading: settlementLoading,
    response: settlementResponse,
    postData: getAllSettlement,
  } = usePostRequest(endPoints.payin.refundTxn);

  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });

  const { response: merchantResponse = [], postData: getAllMerchants } =
    usePostRequest(endPoints.users.allMerchantList);

  useEffect(() => {
    getAllMerchants(
      JSON.stringify({
        keyword: "",
        start: 0,
        size: 25,
      }),
    );
    setTimeout(() => {
      getAllMerchants(
        JSON.stringify({
          keyword: "",
          start: 1,
          size: 25,
        }),
      );
    }, 200);
  }, []);

  useEffect(() => {
    const list = merchantResponse?.data?.data || [];
    if (list.length > 0) {
      setMerchantList((prev) => {
        const merged = [...prev, ...list];
        return [...new Map(merged.map((i) => [i.userId, i])).values()];
      });
    }
  }, [merchantResponse]);

  const handleChangeMerchant = (id, name) => {
    setMerchant({ id, name });
  };

  const [settlementStatus, setSettlementStatus] = useState(
    settlementStatusTypes[0],
  );
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const handlePrev = () => setCurrentPage((prev) => prev - 1);
  const handleNext = () => setCurrentPage((prev) => prev + 1);

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const fetchRefunds = () => {
    getAllSettlement(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        settlementStatus.name,
        dateRange.dateFrom,
        dateRange.dateTo,
        merchant.id,
        currencyType.id,
        "REFUND",
      ),
    );
  };

  useEffect(() => {
    fetchRefunds();
  }, [
    currentPage,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchant.id,
    settlementStatus,
    currencyType,
  ]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const merchantOptions = [
    { userId: "", fullName: "All" },
    ...(merchantList || []),
  ];

  const tableLoading = settlementLoading || settlementResponse == null;

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settlement Report</p>
          <h1 className={styles.title}>Refund</h1>
          <p className={styles.subtitle}>
            Filter and review refund settlement records
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
          {(role || subAdmin || resellerRole) && (
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
                  options={merchantOptions}
                  onChange={handleChangeMerchant}
                  id="userId"
                  value="fullName"
                />
              </div>
            </div>
          )}
          <div className={styles.filterField}>
            <Label htmlFor="currencyType" label="Currency" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-currency-dollar ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={(id, name) => setCurrencyType({ id, name })}
                id="id"
                value="name"
              />
            </div>
          </div>
          <div className={styles.filterField}>
            <Label htmlFor="dateFrom" label="Date From" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-calendar3 ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <input
                type="date"
                id="dateFrom"
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
                id="dateTo"
                name="dateTo"
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                value={inputFieldDateFormatter(dateRange.dateTo)}
              />
            </div>
          </div>
          <div className={styles.filterField}>
            <Label htmlFor="status" label="Status" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-flag ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <Dropdown
                initialLabel="Select Status"
                selectedValue={settlementStatus}
                options={settlementStatusTypes}
                onChange={(id, name) => setSettlementStatus({ id, name })}
                id="id"
                value="name"
                all={false}
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={fetchRefunds}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <Table
        headers={headers}
        currentPage={settlementResponse?.data.pageNumber}
        pageSize={settlementResponse?.data.pageSize}
        totalElement={settlementResponse?.data.totalElement}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={false}
        search={false}
      >
        <BodyMapping
          data={settlementResponse?.data.data || []}
          loading={tableLoading}
        />
      </Table>
    </div>
  );
};

export default Details;
