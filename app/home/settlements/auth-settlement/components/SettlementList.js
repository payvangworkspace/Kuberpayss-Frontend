"use client";
import React, { useEffect, useState } from "react";
import { headers } from "./column";
import usePostRequest from "@/app/hooks/usePost";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import useTableExports from "@/app/hooks/useTableExports";
import DownloadDetailModal from "@/app/ui/table/DownloadDetailModal";
import usePutRequest from "@/app/hooks/usePut";
import apiClient from "@/app/services/apiClient";
import { successMsg } from "@/app/services/notify";
import ChargeBack from "./AddChargeBackModal";
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
const ALL_MERCHANT_OPTION = { id: "", name: "All" };
const BodyMapping = ({
  data,
  loading,
  selectable = false,
  selectedRows = [],
  onToggleRow,
  handleViewChargeBack,
}) => {
  console.log("🚀 ~ BodyMapping ~ data:", data);
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={18}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("settlement")}
            </div>
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.settlementId}>
                {selectable && (
                  <td className={tableStyles.checkboxCol}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.order.orderId)}
                      onChange={() => onToggleRow(item.order.orderId)}
                    />
                  </td>
                )}
                <td>{item.settlementId || "NA"}</td>
                <td>{item.payableAmount || "NA"}</td>
                <td>{item.acquirerCode || "NA"}</td>
                <td>{item.currencyCode || "NA"}</td>
                <td>{item.countryCode || "NA"}</td>
                <td>{item.customerName}</td>
                <td>{item.customerEmail || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td>{item.ordRequestId || "NA"}</td>
                <td>{item.merchantCharge || 0.0}%</td>
                <td>{item.pgCharge || 0.0}</td>
                <td>{item.bankCharge || 0.0}</td>
                <td>{item.gstVat || 0.0}</td>
                <td>
                  {item.netSettleAmount || 0.0}{" "}
                  {getCurrencySymbol(item.currencyCode)}
                </td>
                <td>{dateFormatter(item.createdDate)}</td>
                <td>{item.utr || "NA"}</td>
                <td>{item.rollingReserveAmount}</td>
                <td>
                  {item.settlementStatus === "SETTLE" ? (
                    <span className={styles.statusSettled}>SETTLED</span>
                  ) : (
                    <span className={styles.statusUnsettled}>UNSETTLED</span>
                  )}
                </td>
                <td>
                  {(item.order.transactionStatus === "CAPTURED" ||
                    item.order.transactionStatus === "SUCCESS") &&
                    item.order.statusDisplay !== "Open" &&
                    item.hasChargeback === false && (
                      <button
                        className={styles.chargeBackBtn}
                        type="button"
                        onClick={() => handleViewChargeBack(item.order.orderId)}
                      >
                        Add Charge Back
                      </button>
                    )}
                  {item.hasChargeback === true && (
                    <span className={styles.chargedBadge}>Charged</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={18}>
                <div className={tableStyles.emptyMessage}>No Data Found</div>
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const SettlementList = ({
  role,
  isMerchant,
  resellerRole,
  userId,
  subAdmin,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const onToggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onToggleAll = () => {
    if (selectedRows.length === settlementResponse.data.data.length) {
      setSelectedRows([]); // unselect all
    } else {
      setSelectedRows(settlementResponse.data.data.map((x) => x.settlementId)); // select all
    }
  };

  const [merchant, setMerchant] = useState(
    isMerchant
      ? { id: userId, name: "Select Merchant" }
      : resellerRole
        ? { id: "", name: "Select Merchant" }
        : ALL_MERCHANT_OPTION,
  );
  const [merchantList, setMerchantList] = useState([]);
  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.allMerchantList);
  useEffect(() => {
    if (resellerRole) return;
    const fetchMerchants = async () => {
      // First page
      getAllMerchants(
        JSON.stringify({
          keyword: "",
          start: 0,
          size: 25,
        }),
      );

      // Second page
      setTimeout(() => {
        getAllMerchants(
          JSON.stringify({
            keyword: "",
            start: 1,
            size: 25,
          }),
        );
      }, 200); // small delay so hook updates
    };

    fetchMerchants();
  }, [resellerRole]);

  useEffect(() => {
    if (resellerRole) return;
    getAllMerchants(
      JSON.stringify({
        keyword: "",
        start: 0,
        size: 50,
      }),
    );
  }, [resellerRole]);

  const merchantIdToUse = isMerchant ? userId : merchant?.id;

  useEffect(() => {
    const list = merchantResponse?.data?.data || [];

    if (list.length > 0) {
      setMerchantList((prev) => {
        const merged = [...prev, ...list];

        // remove duplicates
        return [...new Map(merged.map((i) => [i.userId, i])).values()];
      });
    }
  }, [merchantResponse]);

  const {
    loading: settlementLoading,
    error: settlementError,
    response: settlementResponse,
    postData: getAllSettlement,
  } = usePostRequest(endPoints.payin.settlement);
  const {
    loading: settlementStatusLoading,
    error: settlementStatusError,
    response: settlementStatusResponse,
    putData: settlementStatusData,
  } = usePutRequest(endPoints.payin.settlementStatus);

  // Filters start here
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  const [settlementStatus, setSettlementStatus] = useState(
    settlementStatusTypes[0],
  );

  const {
    postData: getMapData,
    response: mapData,
    loading: mapLoadingData,
  } = usePostRequest(endPoints.settings.allMapMerchant);

  useEffect(() => {
    if (resellerRole) {
      getMapData(
        queryStringWithDate(
          0,
          process.env.NEXT_PUBLIC_PAGINATION_SIZE,
          "",
          "",
          "",
          "",
          userId,
          "",
          "",
        ),
      );
    }
  }, [userId, resellerRole]);

  useEffect(() => {
    if (resellerRole && !merchant.id && mapData?.data?.data?.length > 0) {
      setMerchant({
        id: mapData.data.data[0].merchantUserName || "",
        name: mapData.data.data[0].merchantFullName || "Select Merchant",
      });
    }
  }, [resellerRole, mapData, merchant.id]);

  // useEffect(() => {
  //   if (!isMerchant)
  //     getMapData(
  //       queryStringWithDate(
  //         0,
  //         process.env.NEXT_PUBLIC_PAGINATION_SIZE,
  //         "",
  //         "",
  //         "",
  //         "",
  //         userId,
  //         "",
  //         "",
  //       ),
  //     );
  // }, [userId]);

  useEffect(() => {
    if (mapLoadingData) setLoader(true);
  }, [mapLoadingData]);

  // Handle for pagination, date change, merchant change
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
  };
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });
  const merchantOptions = [
    ...(resellerRole ? [] : [ALL_MERCHANT_OPTION]),
    ...((resellerRole ? mapData?.data?.data : merchantList) || []).map(
      (item) => ({
        id: resellerRole ? item.merchantUserName : item.userId,
        name: resellerRole ? item.merchantFullName : item.fullName,
      }),
    ),
  ];
  console.log("merchant id in settlement", merchant.id);
  useEffect(() => {
    if (resellerRole && !merchantIdToUse) return;
    getAllSettlement(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        settlementStatus.name,
        dateRange.dateFrom,
        dateRange.dateTo,
        // merchant.id,
        merchantIdToUse,
        currencyType.id,
        "AUTH",
      ),
    );
  }, [
    currentPage,
    dateRange.dateFrom,
    dateRange.dateTo,
    // merchant.id,
    merchantIdToUse,
    settlementStatus,
    currencyType,
  ]);
  const handleCapture = async () => {
    if (selectedRows.length < 1) return;
    try {
      const url = endPoints.payin.captureBulk;
      const formData = { orderIds: selectedRows };
      const res = await apiClient.post(url, formData);
      if (res) {
        successMsg(res.data.message);
        getAllSettlement(
          queryStringWithDate(
            currentPage,
            process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            "",
            settlementStatus.name,
            dateRange.dateFrom,
            dateRange.dateTo,
            merchantIdToUse,
            currencyType.id,
            "AUTH",
          ),
        );
      }
    } catch (error) {
      console.error("Error capturing:", error);
    }
  };

  const [orderId, setOrderId] = useState(null);
  const [viewChargeBackModal, setViewChargeBackModal] = useState(false);

  const handleViewChargeBack = (orderId) => {
    setViewChargeBackModal(true);
    setOrderId(orderId);
  };

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (settlementLoading) setLoader(true);
  }, [settlementLoading]);

  if (merchantError || settlementError)
    return <p className="text-center">Error: Failed to fetch data</p>;
  const { showModal, handleViewModal } = useTableExports(headers);

  if (resellerRole || merchantResponse)
    return (
      <>
        {showModal && (
          <DownloadDetailModal
            downloadUrl={endPoints.transaction.settlementDownload}
            downloadData={{
              userName: merchantIdToUse,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              status: settlementStatus.name,
              currencyCode: currencyType.id !== "" ? currencyType.id : "",
              merchantName: isMerchant
                ? "Select Merchant"
                : merchantIdToUse === ""
                  ? "All"
                  : merchant.name,
            }}
            onClose={handleViewModal}
            source="auth_settlement_report"
          />
        )}
        {viewChargeBackModal && (
          <ChargeBack
            name={merchant.name}
            id={orderId}
            currencyCode={currencyType.id}
            onClick={() => setViewChargeBackModal(false)}
            onSuccess={() => {
              getAllSettlement(
                queryStringWithDate(
                  currentPage,
                  process.env.NEXT_PUBLIC_PAGINATION_SIZE,
                  "",
                  settlementStatus.name,
                  dateRange.dateFrom,
                  dateRange.dateTo,
                  merchantIdToUse,
                  currencyType.id,
                  "AUTH",
                ),
              );
            }}
          />
        )}
        <div className={`wrapper ${styles.page}`}>
          <div className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Settlement Report</p>
              <h1 className={styles.title}>Authorized</h1>
              <p className={styles.subtitle}>
                Filter and manage authorized settlement records
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
              {(role || resellerRole || subAdmin) && (
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
                      onChange={handleMerchantChange}
                      id="id"
                      value="name"
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
              <div className={styles.filterField}>
                <Label htmlFor="status" label="Status" />
                <div className={styles.iconField}>
                  <i
                    className={`bi bi-flag ${styles.fieldIcon}`}
                    aria-hidden="true"
                  />
                  <Dropdown
                    initialLabel=""
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
                onClick={() => {
                  if (resellerRole && !merchantIdToUse) return;
                  getAllSettlement(
                    queryStringWithDate(
                      currentPage,
                      process.env.NEXT_PUBLIC_PAGINATION_SIZE,
                      "",
                      settlementStatus.name,
                      dateRange.dateFrom,
                      dateRange.dateTo,
                      merchantIdToUse,
                      currencyType.id,
                      "AUTH",
                    ),
                  );
                }}
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
            selectable={true}
            selectedRows={selectedRows}
            onToggleRow={onToggleRow}
            onToggleAll={onToggleAll}
            handleExportExcelModel={handleViewModal}
            additionalBtn={{ visible: true, icon: "", label: "Capture" }}
            additionalBtnAction={handleCapture}
          >
            <BodyMapping
              data={settlementResponse?.data.data || null}
              loading={loader}
              handleCapture={handleCapture}
              handleViewChargeBack={handleViewChargeBack}
            />
          </Table>
        </div>
      </>
    );
};

export default SettlementList;
