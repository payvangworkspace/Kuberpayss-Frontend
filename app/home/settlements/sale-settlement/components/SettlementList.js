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
import Refund from "./RefundModal";
import ChargeBack from "./AddChargeBackModal";

const currencyTypes = [
  { id: "USD", name: "US Dollar" },
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];
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
  handleViewRefund,
  handleViewChargeBack,
}) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={18} className="text-center">
            {loadingMsg("settlement")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.settlementId}>
                <td>{item.settlementId || "NA"}</td>
                <td>{item.payableAmount || "NA"}</td>
                <td>{item.acquirerCode || "NA"}</td>
                <td>{item.currencyCode || "NA"}</td>
                <td>{item.countryCode || "NA"}</td>
                <td>{item.customerName}</td>
                <td>{item.customerEmail || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td>{item.ordRequestId || "NA"}</td>
                <td>{item.merchantCharge || 0.0}</td>
                <td>{item.pgCharge || 0.0}</td>
                <td>{item.bankCharge || 0.0}</td>
                <td>{item.gstVat || 0.0}</td>
                <td>{item.netSettleAmount || 0.0} $</td>
                <td>{dateFormatter(item.createdDate)}</td>
                <td>{item.utr || "NA"}</td>
                <td>{item.rollingReserveAmount}</td>
                <td>
                  {item.settlementStatus === "SETTLE" ? (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      SETTLED
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: 600 }}>
                      UNSETTLED
                    </span>
                  )}
                </td>
                <td className="">
                  {(item?.order?.transactionStatus === "CAPTURED" ||
                    item?.order?.transactionStatus === "SUCCESS") &&
                    item?.order?.transactionType !== "REFUND" && (
                      <button
                        style={{
                          background: "transparent",
                          padding: "3px",
                          border: "1px solid #007bff",
                          borderRadius: "5px",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                        type="button"
                        onClick={() =>
                          handleViewRefund(
                            item.order.orderId,
                            item.order.payableAmount,
                          )
                        }
                      >
                        REFUND
                      </button>
                    )}
                  {item?.order?.transactionType === "REFUND" && (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      REFUNDED
                    </span>
                  )}
                </td>
                <td>
                  {(item?.order?.transactionStatus === "CAPTURED" ||
                    item?.order?.transactionStatus === "SUCCESS") &&
                    item?.order?.statusDisplay !== "Open" &&
                    item?.hasChargeback === false && (
                      <button
                        style={{
                          background: "transparent",
                          padding: "3px",
                          border: "1px solid #007bff",
                          borderRadius: "5px",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                        type="button"
                        onClick={() => handleViewChargeBack(item.order.orderId)}
                      >
                        Add Charge Back
                      </button>
                    )}
                  {item?.hasChargeback === true && (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      Charged
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={18}>No settlement Available</td>
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

  // useEffect(() => {
  //   getAllMerchants(
  //     JSON.stringify({
  //       keyword: "",
  //       start: 0,
  //       size: 50,
  //     })
  //   );
  // }, []);

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

  // useEffect(() => {
  //   if (mapLoadingData) setLoader(true);
  // }, [mapLoadingData]);

  // useEffect(() => {
  //   if (resellerRole && mapData?.data?.data?.length > 0) {
  //     setMerchant({
  //       id: mapData.data.data[0].merchantUserName || "",
  //       name: mapData.data.data[0].merchantFullName || "Select Merchant",
  //     });
  //   } else if (merchantResponse?.data?.data?.length > 0) {
  //     setMerchant({
  //       id: merchantResponse.data.data[0].userId || "",
  //       name: merchantResponse.data.data[0].fullName || "Select Merchant",
  //     });
  //   }
  // }, [merchantResponse, mapData, resellerRole]);

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
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };
  const merchantIdToUse = isMerchant ? userId : merchant.id;
  const merchantOptions = [
    ...(resellerRole ? [] : [ALL_MERCHANT_OPTION]),
    ...((resellerRole ? mapData?.data?.data : merchantList) || []).map(
      (item) => ({
        id: resellerRole ? item.merchantUserName : item.userId,
        name: resellerRole ? item.merchantFullName : item.fullName,
      }),
    ),
  ];
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });
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
        merchantIdToUse,
        currencyType.id,
        "SALE",
      ),
    );
  }, [
    currentPage,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchantIdToUse,
    settlementStatus,
    currencyType,
  ]);

  const [viewRefund, setViewRefund] = useState(false);
  const [viewChargeBack, setViewChargeBack] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [payableAmount, setPayableAmount] = useState(null);
  const handleViewRefund = async (orderId, payableAmount) => {
    setViewRefund(true);
    setOrderId(orderId);
    setPayableAmount(payableAmount);
  };

  const handleViewChargeBack = (orderId) => {
    setViewChargeBack(true);
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
        {viewRefund && (
          <Refund
            name={merchant.name}
            id={orderId}
            payableAmount={payableAmount}
            onClick={() => setViewRefund(!viewRefund)}
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
                  "SALE",
                ),
              );
            }}
          />
        )}
        {viewChargeBack && (
          <ChargeBack
            name={merchant.name}
            id={orderId}
            onClick={() => setViewChargeBack(false)}
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
                  "SALE",
                ),
              );
            }}
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
            <div className="col-lg-2 col-md-6 col-sm-12 mb-4">
              <Label htmlFor="currencyType" label="Currency" />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={(id, name) => setCurrencyType({ id, name })}
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
                selectedValue={settlementStatus}
                options={settlementStatusTypes}
                onChange={(id, name) => setSettlementStatus({ id, name })}
                id="id"
                value="name"
                all={false}
              />
            </div>
          </div>
          {/* <div className="d-flex row">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
              <ChargeCard type="Total Count" value="0.00" />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
              <ChargeCard type="Total Amount" value="10000$" />
            </div>
          </div> */}
          <Table
            headers={headers}
            currentPage={settlementResponse?.data.pageNumber}
            pageSize={settlementResponse?.data.pageSize}
            totalElement={settlementResponse?.data.totalElement}
            handleNext={handleNext}
            handlePrev={handlePrev}
            link={false}
            search={false}
            handleExportExcelModel={handleViewModal}
          >
            <BodyMapping
              data={settlementResponse?.data.data || null}
              loading={loader}
              handleViewRefund={handleViewRefund}
              handleViewChargeBack={handleViewChargeBack}
            />
          </Table>
        </div>
      </>
    );
};

export default SettlementList;
