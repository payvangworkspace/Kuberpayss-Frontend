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

// Transaction status types
const transactionStatusTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "SUCCESS" },
  { id: 3, name: "PENDING" },
  { id: 4, name: "FAILED" },
];

// Search types for order ID or transaction ID

// Component to map and display transaction data in table rows
const BodyMapping = ({ data = [], loading, merchant, isAdmin }) => {
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
        {!loading ? (
          <tr>
            <td colSpan={8} className="text-center">
              {loadingMsg("transactions")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.transactionPayoutId || "NA"}>
                  <td>{item.orderId || "NA"}</td>
                  <td>{item.amount || 0.0}</td>
                  <td>{item.transferType || "NA"}</td>
                  <td>{item.transactionStatus || "PENDING"}</td>
                  <td>{item.bankUtr || "NA"}</td>
                  <td>
                    <i
                      className="bi bi-display-fill text-info"
                      title="View Details"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleViewTransactionDetail(item)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No Transactions Available</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};

// Main component for Payout Transaction List
const PayoutTransactionList = ({ role, isMerchant, userId }) => {
  // Currency symbol state
  const [symbol, setSymbol] = useState("₹");

  // Currency state
  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "All Currency",
  });

  // Handle currency change
  const handleCurrencyChange = (id, name) => {
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
        setSymbol("₹");
        break;
    }
  };

  // Merchant state
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All Merchant",
  });

  const [merchantList, setMerchantList] = useState([]);

  // Fetch merchant list
  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantList);

  // Load merchants on component mount
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Select first merchant if role allows
  useEffect(() => {
    if (merchantResponse && role && merchantResponse?.data?.data?.length > 0) {
      setMerchantList(
        merchantResponse?.data?.data?.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
        }))
      );
      setMerchant({
        id: "",
        name: "All Merchant",
      });
    }
  }, [merchantResponse, role]);

  // Fetch currencies based on merchant or all currencies
  const {
    loading: currencyLoading,
    error: currencyError,
    response: currencyResponse = [],
    getData: getCurrencies,
  } = useGetRequest();

  // Load currencies when merchant changes
  useEffect(() => {
    if (merchant.id) {
      getCurrencies(
        merchant.id
          ? endPoints.users.mappedCurrency + merchant.id
          : endPoints.settings.currencyList
      );
    }
  }, [merchant.id]);

  // handle transfer modes

  const [transferModes, setTransferModes] = useState([]);

  const [selectedTransferMode, setSelectedTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });

  const {
    response: transferModeResponse,
    getData: getTransferMode,
    error: transferModeError,
    loading: transferModeLoading,
  } = useGetRequest();

  // Fetch transfer modes when merchant changes
  useEffect(() => {
    if (!merchant.id) return;
    getTransferMode(endPoints.payout.merchantTransferMode + "/" + merchant.id);
  }, [merchant.id]);

  // Handle transfer mode response
  useEffect(() => {
    if (transferModeResponse && transferModeResponse?.data) {
      const transferModes = transferModeResponse?.data?.map((mode) => ({
        id: mode.transferModeCode,
        name: mode.transferModeName,
      }));
      setTransferModes(transferModes);
    }
    if (transferModeError) {
      setTransferModes([]);
      handleTransferModeChange("", "Select Transfer Mode");
    }
  }, [transferModeResponse, transferModeError]);

  const handleTransferModeChange = (id, name) => {
    setSelectedTransferMode({ id, name });
  };

  // Fetch transaction data
  const {
    loading: transactionLoading,
    error: transactionError,
    response: transactionResponse = [],
    postData: getPayoutTransactions,
  } = usePostRequest(endPoints.payout.transaction);

  // Acquirer state (for non-merchant users)
  const [acquirer, setAcquirer] = useState({
    id: "",
    name: "Select Acquirer",
  });

  // Fetch acquirer list
  const {
    loading: acquirerLoading,
    error: acquirerError,
    response: acquirerResponse = [],
    getData: getAllAcquirers,
  } = useGetRequest();

  // Load acquirers on component mount if not merchant/submerchant
  useEffect(() => {
    if (!isMerchant && merchant.id) {
      getAllAcquirers(endPoints.payout.acquirerList + "/" + merchant.id);
    }
  }, [isMerchant, merchant.id]);

  // Filters state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  const [transactionStatus, setTransactionStatus] = useState(
    transactionStatusTypes[0]
  );
  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [transactionIdSearch, setTransactionIdSearch] = useState("");

  // Handle pagination
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Handle merchant change
  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
    // Reset currency when merchant changes
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

  // Handle acquirer change
  const handleAcquirerChange = (id, name) => {
    setAcquirer({ id, name });
  };

  // Handle date change
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // Handle search value change
  const handleSearchValueChange = (e, key) => {
    if (key === "orderId") {
      setOrderIdSearch(e.target.value);
    }
    if (key === "transactionId") {
      setTransactionIdSearch(e.target.value);
    }
  };

  // Construct query for payout transactions
  useEffect(() => {
    // Create request payload
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

  // Loading state
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (transactionLoading) setLoader(true);
  }, [transactionLoading]);

  // Error handling
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
      <div className="wrapper">
        <div className="row">
          {/* Merchant dropdown for admin/reseller */}
          {role && (
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="merchant" label="Merchant" />
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
          )}

          {/* Currency dropdown */}
          <div className="col-md-2 col-sm-12 mb-3">
            <Label htmlFor="currencyType" label="Currency" />
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

          {/* Date From filter */}
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

          {/* Date To filter */}
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

          {/* Status dropdown */}
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="status" label="Status" />
            <Dropdown
              initialLabel=""
              selectedValue={transactionStatus}
              options={transactionStatusTypes}
              onChange={(id, name) => setTransactionStatus({ id, name })}
              id="id"
              value="name"
            />
          </div>

          {/* Acquirer dropdown for admin/reseller */}
          {(role || isMerchant) && (
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="acquirer" label="Acquirer" />
              <Dropdown
                initialLabel="Select Acquirer"
                selectedValue={acquirer}
                options={acquirerResponse?.data || []}
                onChange={handleAcquirerChange}
                id="acquirerCode"
                value="acquirerName"
              />
            </div>
          )}

          {/* Transfer Mode dropdown */}
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="transferMode" label="Transfer Mode" />
            <Dropdown
              initialLabel=""
              selectedValue={selectedTransferMode}
              options={transferModes}
              onChange={handleTransferModeChange}
              id="id"
              value="name"
            />
          </div>

          {/* Search value input */}
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="orderId" label={"Order Id"} />
            <input
              type="text"
              id="orderId"
              name="orderId"
              className="forminput"
              placeholder={"Search Order ID"}
              onChange={(e) => handleSearchValueChange(e, "orderId")}
              value={orderIdSearch}
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="transactionId" label={"Transaction Id"} />
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              className="forminput"
              placeholder={"Search Transaction ID"}
              onChange={(e) => handleSearchValueChange(e, "transactionId")}
              value={transactionIdSearch}
            />
          </div>
        </div>

        {/* Transaction table */}
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
            loading={loader}
            merchant={merchant.name || ""}
            isAdmin={role}
          />
        </Table>

        {/* Page size selector */}
        {/* <div className="row mt-3">
        <div className="col-md-3 col-sm-12">
          <Label htmlFor="pageSize" label="Page Size" />
          <select
            id="pageSize"
            className="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default PayoutTransactionList;
