"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import ReleaseAllModal from "../modal/ReleaseAllModal";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import { headers } from "./Column";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const getStatusClass = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "HELD":
      return styles.statusHeld;
    case "RELEASED":
      return styles.statusReleased;
    case "CANCELLED":
      return styles.statusCancelled;
    default:
      return styles.statusDefault;
  }
};

const BodyMapping = ({
  data = [],
  loading = true,
  role,
  merchant,
  onRelease,
  onCancel,
  releaseLoadingMap = {},
  cancelLoadingMap = {},
}) => {
  const formatArrayDate = (arr) => {
    if (!arr) return "NA";
    if (Array.isArray(arr) && arr.length >= 3) {
      const [y, m, d, hh = 0, mm = 0, ss = 0, ns = 0] = arr;
      const ms = Math.floor((ns || 0) / 1e6);
      const dt = new Date(y, (m || 1) - 1, d, hh, mm, ss, ms);
      try {
        return dateFormatter(dt);
      } catch (e) {
        return dt.toLocaleString();
      }
    }
    try {
      const dt = new Date(arr);
      return isNaN(dt.getTime()) ? "NA" : dateFormatter(dt);
    } catch (e) {
      return "NA";
    }
  };

  const colCount = headers(role).length;
  const rows = data?.data || [];

  return (
    <>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={colCount}>
              <div className={tableStyles.emptyMessage}>
                {loadingMsg("rolling reserve details")}
              </div>
            </td>
          </tr>
        ) : rows.length > 0 ? (
          rows.map((item) => (
            <tr key={item.id}>
              <td>{item.transactionAmount ?? "NA"}</td>
              <td>{item.tdrDeduction ?? "NA"}</td>
              <td>{item.settlementAmount ?? "NA"}</td>
              <td>{item.reservePercentage ?? "NA"}</td>
              <td>{item.reservedAmount ?? "NA"}</td>
              <td>{item.netSettlementAmount ?? "NA"}</td>
              <td>{formatArrayDate(item.reservedAt)}</td>
              <td>{formatArrayDate(item.releaseDate)}</td>
              <td>
                {item.releasedAt ? formatArrayDate(item.releasedAt) : "NA"}
              </td>
              <td>
                <span className={getStatusClass(item.status)}>
                  {item.status || "NA"}
                </span>
              </td>
              <td>{item.cancellationReason || "NA"}</td>
              <td>{item.currency || "NA"}</td>
              <td>{item.holdDays ?? "NA"}</td>
              {role && (
                <td>
                  <div className={styles.actionGroup}>
                    {item.status === "HELD" && (
                      <button
                        type="button"
                        className={styles.releaseBtn}
                        onClick={() => onRelease(item)}
                        disabled={!!releaseLoadingMap[item.id]}
                        title="Release"
                      >
                        {releaseLoadingMap[item.id]
                          ? "Releasing..."
                          : "Release"}
                      </button>
                    )}
                    {item.status === "RELEASED" && (
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => onCancel && onCancel(item)}
                        disabled={!!cancelLoadingMap[item.id]}
                        title="Cancel Release"
                      >
                        {cancelLoadingMap[item.id]
                          ? "Cancelling..."
                          : "Cancel Release"}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={colCount}>
              <div className={tableStyles.emptyMessage}>No Data Found</div>
            </td>
          </tr>
        )}
      </tbody>
    </>
  );
};
const Details = ({ role, isMerchant, isSubMerchant, merchantId }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const [allMerchants, setAllMerchants] = useState([]);
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.allMerchantList);
  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId,
      ),
    );
  }, [keyword.userId]);

  useEffect(() => {
    const fetchAllMerchants = async () => {
      let allData = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const res = await getAllMerchants({
          start: page,
          size: 25,
        });

        const data = res?.data?.data || [];
        totalPages = res?.data?.totalPage || 1;

        allData = [...allData, ...data];
        page++;
      }

      setAllMerchants(allData);
    };

    fetchAllMerchants();
  }, []);

  // end of merchant fetch logic
  useEffect(() => {
    if (merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "",
      });
    }
  }, [merchantError, merchantResponse]);

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const statusTypes = [
    { id: "HELD", name: "HELD" },
    { id: "RELEASED", name: "RELEASED" },
    { id: "CANCELLED", name: "CANCELLED" },
  ];

  const [status, setStatus] = useState({ id: "", name: "Select Status" });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };
  const { postData, response, error, loading } = usePostRequest(
    endPoints.rollingReserve.allRollingReserve,
  );
  const { postData: postManualRelease, loading: releaseLoading } =
    usePostRequest(endPoints.rollingReserve.rollingReserve);
  const { postData: postCancelRelease, loading: cancelLoading } =
    usePostRequest(endPoints.rollingReserve.rollingReserve);
  // hook and state for release-all modal
  const { postData: postReleaseAll, loading: releaseAllLoading } =
    usePostRequest(endPoints.rollingReserve.rollingReserve);
  // per-row loading maps so only the clicked row shows loading state
  const [releaseLoadingMap, setReleaseLoadingMap] = useState({});
  const [releaseAllLoadingMap, setReleaseAllLoadingMap] = useState({});
  const [cancelLoadingMap, setCancelLoadingMap] = useState({});
  const [showReleaseAllModal, setShowReleaseAllModal] = useState(false);
  const [selectedReleaseAllItem, setSelectedReleaseAllItem] = useState(null);
  useEffect(() => {
    postData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        status.id,
        "",
        "",
        merchant.id,
        0,
      ),
    );
  }, [merchant.id, currentPage, status.id]);
  const openReleaseAllModal = (item) => {
    setSelectedReleaseAllItem(item);
    setShowReleaseAllModal(true);
  };

  const handleConfirmReleaseAll = async ({ dateFrom, dateTo, item }) => {
    const merchantIdForCall = item.merchantId || merchant.id || "";
    if (!merchantIdForCall) return;
    const rollingId = item.id;
    // mark this row as loading for release-all
    setReleaseAllLoadingMap((prev) => ({ ...prev, [rollingId]: true }));
    try {
      const url = `${endPoints.rollingReserve.rollingReserve}${merchantIdForCall}/release-all`;
      const body = { dateFrom, dateTo };
      await postReleaseAll(body, false, false, { url });
      setShowReleaseAllModal(false);
      setSelectedReleaseAllItem(null);
      // refresh list
      await postData(
        queryStringWithDate(
          0,
          process.env.NEXT_PUBLIC_PAGINATION_SIZE,
          "",
          status.id,
          "",
          "",
          merchant.id,
          0,
        ),
      );
    } finally {
      setReleaseAllLoadingMap((prev) => {
        const copy = { ...prev };
        delete copy[rollingId];
        return copy;
      });
    }
  };

  const handleRelease = async (item) => {
    const merchantIdForCall = item.merchantId || merchant.id || "";
    const rollingId = item.id;
    if (!merchantIdForCall || !rollingId) {
      return;
    }
    const url = `${endPoints.rollingReserve.manualRelease}${merchantIdForCall}/release/${rollingId}`;
    setReleaseLoadingMap((prev) => ({ ...prev, [rollingId]: true }));
    try {
      await postManualRelease({}, false, false, { url });
      // refresh list
      await postData(
        queryStringWithDate(
          0,
          process.env.NEXT_PUBLIC_PAGINATION_SIZE,
          "",
          status.id,
          "",
          "",
          merchant.id,
          0,
        ),
      );
    } finally {
      setReleaseLoadingMap((prev) => {
        const copy = { ...prev };
        delete copy[rollingId];
        return copy;
      });
    }
  };

  const handleCancel = async (item) => {
    const merchantIdForCall = item.merchantId || merchant.id || "";
    const rollingId = item.id;
    if (!merchantIdForCall || !rollingId) return;
    const url = `${endPoints.rollingReserve.manualRelease}${merchantIdForCall}/cancel/${rollingId}`;
    const body = { reason: "Chargeback initiated by customer" };
    setCancelLoadingMap((prev) => ({ ...prev, [rollingId]: true }));
    try {
      await postCancelRelease(body, false, false, { url });
      // refresh list
      await postData(
        queryStringWithDate(
          0,
          process.env.NEXT_PUBLIC_PAGINATION_SIZE,
          "",
          status.id,
          "",
          "",
          merchant.id,
          0,
        ),
      );
    } finally {
      setCancelLoadingMap((prev) => {
        const copy = { ...prev };
        delete copy[rollingId];
        return copy;
      });
    }
  };
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (loading) setLoader(false);
  }, [loading]);
  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Reserves</p>
          <h1 className={styles.title}>Rolling Reserve</h1>
          <p className={styles.subtitle}>
            Filter and manage rolling reserve holds and releases
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
                  options={allMerchants}
                  onChange={handleChangeMerchant}
                  id="userId"
                  value="fullName"
                  search={true}
                  onSearch={handleKeyword}
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
                selectedValue={status}
                options={statusTypes}
                onChange={(id, name) => setStatus({ id, name })}
                id="status"
                value="name"
                search={false}
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={() =>
              postData(
                queryStringWithDate(
                  0,
                  process.env.NEXT_PUBLIC_PAGINATION_SIZE,
                  "",
                  status.id,
                  dateRange.dateFrom,
                  dateRange.dateTo,
                  merchant.id,
                  0,
                ),
              )
            }
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <Table
        headers={headers(role)}
        currentPage={response?.data.pageNumber || 0}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        download={false}
        search={false}
        additionalBtn={{
          visible: !!role,
          icon: "bi-unlock",
          label: releaseAllLoading ? "Processing..." : "Release All",
        }}
        additionalBtnAction={() =>
          openReleaseAllModal({
            merchantId: merchant.id,
            id: merchant.id,
          })
        }
      >
        <BodyMapping
          role={role}
          data={response?.data || null}
          loading={loader}
          merchant={merchant.name || ""}
          onRelease={handleRelease}
          onCancel={handleCancel}
          releaseLoadingMap={releaseLoadingMap}
          cancelLoadingMap={cancelLoadingMap}
        />
      </Table>
      {showReleaseAllModal && (
        <ReleaseAllModal
          name={
            selectedReleaseAllItem?.merchantName ||
            selectedReleaseAllItem?.merchantId ||
            merchant.name
          }
          onClose={() => setShowReleaseAllModal(false)}
          data={selectedReleaseAllItem}
          onConfirm={handleConfirmReleaseAll}
          loading={releaseAllLoading}
        />
      )}
    </div>
  );
};

export default Details;
