"use client";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { headers } from "./Column";
import CardPayIn from "./CardPayIn";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
import usePostRequest from "@/app/hooks/usePost";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import TransactionDetails from "../modal/TransactionDetail";
import useTableExports from "@/app/hooks/useTableExports";
import DownloadDetailModal from "@/app/ui/table/DownloadDetailModal";
import RefundDetailModal from "../modal/RefundDetailModal";

const currencyTypes = [
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];
const transactionStatusTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Pending" },
  { id: 3, name: "Success" },
  { id: 4, name: "Failed" },
  { id: 5, name: "Rejected" },
  { id: 6, name: "Declined" },
];
const ALL_MERCHANT_OPTION = { id: "", name: "All" };

const isSuccessfulTransactionStatus = (status) => {
  const normalizedStatus = String(status || "").trim().toUpperCase();
  return normalizedStatus === "CAPTURED" || normalizedStatus === "SUCCESS";
};

const normalizeTransactionStatus = (status) =>
  String(status || "").trim().toUpperCase();

const filterTransactionsByStatus = (data, statusName) => {
  if (!data?.length || !statusName || statusName === "All") return data;

  return data.filter((item) => {
    const status = normalizeTransactionStatus(item.transactionStatus);
    switch (statusName) {
      case "Pending":
        return status === "PENDING";
      case "Success":
        return isSuccessfulTransactionStatus(item.transactionStatus);
      case "Failed":
        return status === "FAILED";
      case "Rejected":
        return status === "REJECTED";
      case "Declined":
        return status === "DECLINED";
      default:
        return true;
    }
  });
};

const getTransactionStatusFilter = (statusName) => {
  if (!statusName || statusName === "All") return "";
  if (statusName === "Success") return "SUCCESS";
  return statusName.toUpperCase();
};

const getDownloadStatusFilter = (statusName) => {
  if (statusName === "Success") return "SUCCESS,CAPTURED";
  return getTransactionStatusFilter(statusName);
};

const buildSummaryFromTransactions = (transactions = []) => {
  const summary = {
    totalTransactions: 0,
    totalTransactionsAmount: 0,
    capturedTransactions: 0,
    capturedTransactionsAmount: 0,
    failsTransactions: 0,
    failsTransactionsAmount: 0,
    pendingTransactions: 0,
    pendingTransactionsAmount: 0,
  };

  transactions.forEach((item) => {
    const amount = parseFloat(item.payableAmount) || 0;
    const status = normalizeTransactionStatus(item.transactionStatus);

    summary.totalTransactions += 1;
    summary.totalTransactionsAmount += amount;

    if (isSuccessfulTransactionStatus(item.transactionStatus)) {
      summary.capturedTransactions += 1;
      summary.capturedTransactionsAmount += amount;
    } else if (status === "PENDING") {
      summary.pendingTransactions += 1;
      summary.pendingTransactionsAmount += amount;
    } else if (
      status === "FAILED" ||
      status === "REJECTED" ||
      status === "DECLINED"
    ) {
      summary.failsTransactions += 1;
      summary.failsTransactionsAmount += amount;
    }
  });

  return summary;
};

const BodyMapping = ({ data = [], loading, merchant }) => {
  console.log("🚀 ~ BodyMapping ~ merchant:", merchant);

  const [viewModal, setViewModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const handleViewTransactionDetail = (data) => {
    setTransactionData(data);
    setViewModal(true);
  };

  const [viewRefundModal, setViewRefundModal] = useState(false);
  const [refundData, setRefundData] = useState(null);

  const handleViewRefund = (data) => {
    setRefundData(data);
    setViewRefundModal(true);
  };
  console.log("data", data);
  return (
    <>
      {viewModal && (
        <TransactionDetails
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={transactionData}
        />
      )}
      {viewRefundModal && (
        <RefundDetailModal
          name={merchant}
          onClose={() => setViewRefundModal(!viewRefundModal)}
          data={refundData}
        />
      )}
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="text-center">
              {loadingMsg("transactions")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.transactionId | "NA"}>
                  <td>{item.transactionId || "NA"}</td>
                  <td>{item.payableAmount || 0.0}</td>
                  <td>{item.transactionTypes || "NA"}</td>
                  <td>{item.customerName || "NA"}</td>
                  <td>{item.customerEmail || "NA"}</td>
                  <td>{item.customerContactNumber || "NA"}</td>
                  <td>{item.transactionStatus}</td>
                  <td>
                    <i
                      className="bi bi-display-fill text-info"
                      title="View Details"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleViewTransactionDetail(item)}
                    ></i>
                    {isSuccessfulTransactionStatus(item.transactionStatus) && (
                      <i
                        className="bi bi-patch-check-fill text-primary mx-2"
                        title="Refund"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewRefund(item)}
                      ></i>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No Transactions Available</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};
const TransactionList = ({
  role,
  isMerchant,
  resellerRole,
  userId,
  subMerchantRole,
  subAdmin,
}) => {
  const [symbol, setSymbol] = useState("$");
  const [merchant, setMerchant] = useState(
    isMerchant
      ? { id: userId, name: "Select Merchant" }
      : ALL_MERCHANT_OPTION,
  );
  const merchantIdToUse = isMerchant ? userId : merchant.id;

  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.allMerchantList);
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Load Transaction API Call
  const {
    loading: transactionLoading,
    error: transactionError,
    response: transactionResponse = [],
    postData: getAllTransaction,
  } = usePostRequest(
    resellerRole
      ? endPoints.payin.resellerTransaction
      : endPoints.payin.transaction,
  );

  // Filters start here
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  // const [loader, setLoader] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(
    transactionStatusTypes[0],
  );
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });

  const fetchTransactions = (
    page = currentPage,
    statusName = transactionStatus.name,
    merchantId = merchantIdToUse,
    currencyCode = currencyType.id,
  ) => {
    getAllTransaction(
      queryStringWithDate(
        page,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        getTransactionStatusFilter(statusName),
        dateRange.dateFrom,
        dateRange.dateTo,
        merchantId,
        currencyCode,
      ),
    );
  };

  // Handle for pagination, date change, merchant change
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handleMerchantChange = (id, name) => {
    setCurrentPage(0);
    setMerchant({ id, name });
  };
  const handleStatusChange = (id, name) => {
    setCurrentPage(0);
    setTransactionStatus({ id, name });
  };
  const handleCurrencyChange = (id, name) => {
    setCurrentPage(0);
    setCurrencyType({ id, name });
    switch (id) {
      case "USD":
        setSymbol("$");
        break;
      case "UGX":
        setSymbol("USh");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      default:
        setSymbol("$");
        break;
    }
  };
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setCurrentPage(0);
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };
  const {
    postData: getMapData,
    response: mapData,
    loading: mapLoadingData,
  } = usePostRequest(endPoints.settings.allMapMerchant);

  useEffect(() => {
    if (!isMerchant && !subMerchantRole)
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
  }, [userId]);

  // useEffect(() => {
  //   if (mapLoadingData) setLoader(true);
  // }, [mapLoadingData]);

  useEffect(() => {
    fetchTransactions();
  }, [
    currentPage,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchantIdToUse,
    currencyType.id,
    transactionStatus.name,
  ]);

  const rawTransactionData = transactionResponse?.data?.data || null;
  const transactionData = filterTransactionsByStatus(
    rawTransactionData,
    transactionStatus.name,
  );
  const summarySourceData =
    transactionStatus.name === "All"
      ? rawTransactionData || []
      : transactionData || [];
  const transactionSummary = buildSummaryFromTransactions(summarySourceData);

  const { showModal, handleViewModal } = useTableExports(headers);

  if (merchantError || transactionError)
    return <p className="text-center">Error: Failed to fetch data</p>;
  const merchantOptions = [
    ALL_MERCHANT_OPTION,
    ...(
      (resellerRole ? mapData?.data?.data : merchantResponse?.data?.data) || []
    ).map((item) => ({
      id: resellerRole ? item.merchantUserName : item.userId,
      name: resellerRole ? item.merchantFullName : item.fullName,
    })),
  ];

  if (resellerRole || merchantResponse) {
    return (
      <>
        {showModal && (
          <DownloadDetailModal
            downloadUrl={endPoints.payin.downloadTransaction}
            downloadData={{
              userName: merchantIdToUse,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              status: getDownloadStatusFilter(transactionStatus.name),
              currencyCode: currencyType.id !== "" ? currencyType.id : "",
              merchantName: isMerchant ? "Select Merchant" : merchant.name,
            }}
            onClose={handleViewModal}
            source="transaction_report"
          />
        )}
        <div className="wrapper">
          <div className="row">
            {(role || resellerRole || subAdmin) && (
              <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                <Label htmlFor="merchant" label="Merchant" />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={merchant}
                  options={merchantOptions}
                  onChange={handleMerchantChange}
                  id="id"
                  value="name"
                />
              </div>
            )}
            <div className="col-md-2 col-sm-12 mb-4">
              <Label htmlFor="currencyType" label="Currency" />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={handleCurrencyChange}
                id="id"
                value="name"
              />
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="dateFrom" label="Date From" />
              <input
                type="date"
                id="inputDate"
                name="dateFrom"
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                value={inputFieldDateFormatter(dateRange.dateFrom)}
              />
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="dateTo" label="Date To" />
              <input
                type="date"
                id="inputDate"
                name="dateTo"
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                value={inputFieldDateFormatter(dateRange.dateTo)}
              />
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="status" label="Status" />
              <Dropdown
                initialLabel=""
                selectedValue={transactionStatus}
                options={transactionStatusTypes}
                onChange={handleStatusChange}
                id="id"
                value="name"
              />
            </div>
          </div>
          <CardPayIn data={transactionSummary} symbol={symbol} />
          <Table
            headers={headers}
            currentPage={transactionResponse?.data?.pageNumber}
            pageSize={transactionResponse?.data?.pageSize}
            totalElement={
              transactionStatus.name === "All"
                ? transactionResponse?.data?.totalElement
                : transactionData?.length ?? 0
            }
            handleNext={handleNext}
            handlePrev={handlePrev}
            link={false}
            search={false}
            handleExportExcelModel={handleViewModal}
          >
            <BodyMapping
              data={transactionData}
              loading={transactionLoading}
              merchant={isMerchant ? userId : merchant?.name || ""}
            />
          </Table>
        </div>
      </>
    );
  }
};

export default TransactionList;
