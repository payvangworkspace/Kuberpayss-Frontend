"use client";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import usePostRequest from "@/app/hooks/usePost";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import TransactionDetails from "../modal/TransactionDetail";
import { queryStringWithKeyword } from "@/app/services/queryString";
import useGetRequest from "@/app/hooks/useFetch";
import { headers } from "./Column";
import DownloadDetailModal from "@/app/ui/table/DownloadDetailModal";
import useTableExports from "@/app/hooks/useTableExports";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import { getCurrencySymbol } from "@/app/utils/currency";

const transactionStatusTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "SUCCESS" },
  { id: 3, name: "PENDING" },
  { id: 4, name: "FAILED" },
];

const getStatusClass = (status) => {
  switch (String(status || "")
    .trim()
    .toUpperCase()) {
    case "SUCCESS":
      return `${styles.statusBadge} ${styles.statusSuccess}`;
    case "FAILED":
      return `${styles.statusBadge} ${styles.statusFailed}`;
    case "PENDING":
      return `${styles.statusBadge} ${styles.statusPending}`;
    default:
      return styles.statusBadge;
  }
};

const BodyMapping = ({ data = [], loading, merchant, isAdmin, symbol = "$" }) => {
  const [viewModal, setViewModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const handleViewTransactionDetail = (data) => {
    setTransactionData(data);
    setViewModal(true);
  };

  return (
    <>
      {viewModal && (
        <TransactionDetails
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={transactionData}
          isPayout={true}
          isAdmin={isAdmin}
        />
      )}
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6}>
              <div className={tableStyles.emptyMessage}>
                {loadingMsg("transactions")}
              </div>
            </td>
          </tr>
        ) : data && data.length > 0 ? (
          data.map((item) => (
            <tr key={item.transactionPayoutId || "NA"}>
              <td>{item.orderId || "NA"}</td>
              <td>
                {symbol} {item.amount || 0.0}
              </td>
              <td>{item.transferType || "NA"}</td>
              <td>
                <span className={getStatusClass(item.transactionStatus)}>
                  {item.transactionStatus || "PENDING"}
                </span>
              </td>
              <td>{item.bankUtr || "NA"}</td>
              <td>
                <i
                  className={`bi bi-display-fill ${styles.actionIcon}`}
                  title="View Details"
                  onClick={() => handleViewTransactionDetail(item)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6}>
              <div className={tableStyles.emptyMessage}>
                No Transactions Available
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </>
  );
};

const PayoutTransactionList = ({ role, isMerchant, userId }) => {
  const [symbol, setSymbol] = useState(getCurrencySymbol("USD"));

  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "All Currency",
  });

  const handleCurrencyChange = (id, name) => {
    setCurrencyType({ id, name });
    setSymbol(getCurrencySymbol(id));
  };

  const [merchant, setMerchant] = useState({
    id: "",
    name: "All Merchant",
  });

  const [merchantList, setMerchantList] = useState([]);

  const {
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  useEffect(() => {
    if (merchantResponse && role && merchantResponse?.data?.data?.length > 0) {
      setMerchantList(
        merchantResponse?.data?.data?.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
        })),
      );
      setMerchant({
        id: "",
        name: "All Merchant",
      });
    }
  }, [merchantResponse, role]);

  const {
    error: currencyError,
    response: currencyResponse = [],
    getData: getCurrencies,
  } = useGetRequest();

  useEffect(() => {
    if (merchant.id) {
      getCurrencies(
        merchant.id
          ? endPoints.users.mappedCurrency + merchant.id
          : endPoints.settings.currencyList,
      );
    }
  }, [merchant.id]);

  const [transferModes, setTransferModes] = useState([]);

  const [selectedTransferMode, setSelectedTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });

  const {
    response: transferModeResponse,
    getData: getTransferMode,
    error: transferModeError,
  } = useGetRequest();

  useEffect(() => {
    if (!merchant.id) return;
    getTransferMode(endPoints.payout.merchantTransferMode + "/" + merchant.id);
  }, [merchant.id]);

  useEffect(() => {
    if (transferModeResponse && transferModeResponse?.data) {
      const modes = transferModeResponse?.data?.map((mode) => ({
        id: mode.transferModeCode,
        name: mode.transferModeName,
      }));
      setTransferModes(modes);
    }
    if (transferModeError) {
      setTransferModes([]);
      handleTransferModeChange("", "Select Transfer Mode");
    }
  }, [transferModeResponse, transferModeError]);

  const handleTransferModeChange = (id, name) => {
    setSelectedTransferMode({ id, name });
  };

  const {
    loading: transactionLoading,
    error: transactionError,
    response: transactionResponse = [],
    postData: getPayoutTransactions,
  } = usePostRequest(endPoints.payout.transaction);

  const [acquirer, setAcquirer] = useState({
    id: "",
    name: "Select Acquirer",
  });

  const {
    error: acquirerError,
    response: acquirerResponse = [],
    getData: getAllAcquirers,
  } = useGetRequest();

  useEffect(() => {
    if (!isMerchant && merchant.id) {
      getAllAcquirers(endPoints.payout.acquirerList + "/" + merchant.id);
    }
  }, [isMerchant, merchant.id]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(25);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  const [transactionStatus, setTransactionStatus] = useState(
    transactionStatusTypes[0],
  );
  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [transactionIdSearch, setTransactionIdSearch] = useState("");

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
    setCurrencyType({ id: "", name: "Select Currency" });
  };

  useEffect(() => {
    if (role) {
      if (merchant.id) {
        getCurrencies(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      getCurrencies(endPoints.users.mappedCurrency + userId);
    }
  }, [role, merchant.id, userId]);

  const handleAcquirerChange = (id, name) => {
    setAcquirer({ id, name });
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const handleSearchValueChange = (e, key) => {
    if (key === "orderId") {
      setOrderIdSearch(e.target.value);
    }
    if (key === "transactionId") {
      setTransactionIdSearch(e.target.value);
    }
  };

  const fetchTransactions = () => {
    const payload = {
      start: currentPage,
      size: pageSize,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      userName: role ? merchant.id : userId,
      currencyCode: currencyType.id,
      status: transactionStatus.name === "All" ? "" : transactionStatus.name,
      acquirerCode: !isMerchant ? acquirer.id : "",
      transferModeCode:
        selectedTransferMode.name === "All" ? "" : selectedTransferMode.id,
      orderId: orderIdSearch,
      transactionId: transactionIdSearch,
    };

    getPayoutTransactions(payload);
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    currentPage,
    pageSize,
    dateRange,
    merchant.id,
    currencyType.id,
    transactionStatus,
    acquirer.id,
    selectedTransferMode.id,
    orderIdSearch,
    transactionIdSearch,
    userId,
    role,
    isMerchant,
  ]);

  const handleApplyFilters = () => {
    if (currentPage === 0) {
      fetchTransactions();
    } else {
      setCurrentPage(0);
    }
  };

  if (merchantError || transactionError || currencyError || acquirerError)
    return <p className="text-center">Error: Failed to fetch data</p>;
  const { showModal, handleViewModal } = useTableExports(headers);

  return (
    <>
      {showModal && (
        <DownloadDetailModal
          downloadUrl={endPoints.payout.downloadTransaction}
          downloadData={{
            userName: merchant.id,
            dateFrom: dateRange.dateFrom,
            dateTo: dateRange.dateTo,
            status: transactionStatus.name,
            currencyCode: currencyType.id !== "" ? currencyType.id : "",
            merchantName: isMerchant ? "Select Merchant" : merchant.name,
          }}
          onClose={handleViewModal}
          source="payment_list"
        />
      )}
      <div className={`wrapper ${styles.page}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Payout</p>
            <h1 className={styles.title}>Transactions</h1>
            <p className={styles.subtitle}>
              Filter, export, and review payout transaction history
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
                    options={[
                      {
                        userId: "",
                        fullName: "All Merchant",
                      },
                      ...(merchantList || []),
                    ]}
                    onChange={handleMerchantChange}
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
                  options={[...(currencyResponse?.data || [])]}
                  onChange={handleCurrencyChange}
                  id="currencyCode"
                  value="currencyName"
                  all={false}
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
                  selectedValue={transactionStatus}
                  options={transactionStatusTypes}
                  onChange={(id, name) => setTransactionStatus({ id, name })}
                  id="id"
                  value="name"
                />
              </div>
            </div>

            {(role || isMerchant) && (
              <div className={styles.filterField}>
                <Label htmlFor="acquirer" label="Acquirer" />
                <div className={styles.iconField}>
                  <i
                    className={`bi bi-building ${styles.fieldIcon}`}
                    aria-hidden="true"
                  />
                  <Dropdown
                    initialLabel="Select Acquirer"
                    selectedValue={acquirer}
                    options={acquirerResponse?.data || []}
                    onChange={handleAcquirerChange}
                    id="acquirerCode"
                    value="acquirerName"
                  />
                </div>
              </div>
            )}

            <div className={styles.filterField}>
              <Label htmlFor="transferMode" label="Transfer Mode" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-arrow-left-right ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <Dropdown
                  initialLabel=""
                  selectedValue={selectedTransferMode}
                  options={transferModes}
                  onChange={handleTransferModeChange}
                  id="id"
                  value="name"
                />
              </div>
            </div>

            <div className={styles.filterField}>
              <Label htmlFor="orderId" label="Order Id" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-hash ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  className="forminput"
                  placeholder="Search Order ID"
                  onChange={(e) => handleSearchValueChange(e, "orderId")}
                  value={orderIdSearch}
                />
              </div>
            </div>

            <div className={styles.filterField}>
              <Label htmlFor="transactionId" label="Transaction Id" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-receipt ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  className="forminput"
                  placeholder="Search Transaction ID"
                  onChange={(e) => handleSearchValueChange(e, "transactionId")}
                  value={transactionIdSearch}
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
          currentPage={transactionResponse?.data?.pageNumber || currentPage}
          pageSize={transactionResponse?.data?.pageSize || pageSize}
          totalElement={transactionResponse?.data?.totalElement || 0}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          search={false}
          acquirerCode={acquirer.id}
          transferModeCode={
            selectedTransferMode.id === "All" ? "" : selectedTransferMode.id
          }
          handleExportExcelModel={handleViewModal}
        >
          <BodyMapping
            data={transactionResponse?.data?.data || []}
            loading={transactionLoading}
            merchant={merchant.name || ""}
            isAdmin={role}
            symbol={symbol}
          />
        </Table>
      </div>
    </>
  );
};

export default PayoutTransactionList;
