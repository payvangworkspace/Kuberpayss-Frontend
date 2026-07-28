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
import useTableExports from "@/app/hooks/useTableExports";
import DownloadDetailModal from "@/app/ui/table/DownloadDetailModal";
const currencyTypes = [
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];
const orderStatusTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Pending" },
  { id: 3, name: "Success" },
  { id: 4, name: "Failed" },
];

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={8} className="text-center">
            {loadingMsg("orders")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.orderId}>
                <td>{item.orderId || "NA"}</td>
                <td>{item.ordRequestId || "NA"}</td>
                <td>{item.payableAmount || 0.0}</td>
                <td>{item.txnType || "NA"}</td>
                <td>{item.customerName || "NA"}</td>
                <td>{item.customerEmail || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td>{item.transactionStatus || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No Orders Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const OrderList = ({
  role,
  isMerchant,
  resellerRole,
  userId,
  subMerchantRole,
  admin,
  subAdmin,
}) => {
  const [symbol, setSymbol] = useState("$");

  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const {
    loading: orderLoading,
    error: errorOrder,
    response: responseOrder,
    postData: getAllOrder,
  } = usePostRequest(endPoints.payments.orders);

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };

  const getAllOrdersList = async () => {
    if (!merchant?.id) return;
    await getAllOrder(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        orderStatus.name,
        dateRange.dateFrom,
        dateRange.dateTo,
        merchantIdToUse,
        currencyType.id,
      ),
    );
  };

  const {
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.allMerchantList);

  // Handle for pagination
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // All Merchant list for filter
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const merchantIdToUse = isMerchant ? userId : merchant.id;
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

  useEffect(() => {
    if (mapLoadingData) setLoader(true);
  }, [mapLoadingData]);

  useEffect(() => {
    if (resellerRole && mapData?.data?.data?.length > 0) {
      setMerchant({
        id: mapData.data.data[0].merchantUserName || "",
        name: mapData.data.data[0].merchantFullName || "Select Merchant",
      });
    } else if (merchantResponse?.data?.data?.length > 0) {
      setMerchant({
        id: merchantResponse.data.data[0].userId || "",
        name: merchantResponse.data.data[0].fullName || "Select Merchant",
      });
    }
  }, [merchantResponse, mapData, resellerRole]);

  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
  };

  const [orderStatus, setOrderStatus] = useState(orderStatusTypes[0]);

  useEffect(() => {
    getAllOrdersList();
  }, [
    currentPage,
    dateRange.dateTo,
    dateRange.dateFrom,
    merchantIdToUse,
    orderStatus,
    currencyType.id,
  ]);

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
        setSymbol("$");
        break;
    }
  };

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (orderLoading) setLoader(true);
  }, [orderLoading]);
  if (merchantError || errorOrder) {
    return (
      <p className="text-center">
        Error:{" "}
        {merchantError?.message || "Something went wrong while fetching data"}
      </p>
    );
  }
  const { showModal, handleViewModal } = useTableExports(headers);
  if (merchantResponse) {
    return (
      <>
        {showModal && (
          <DownloadDetailModal
            downloadUrl={endPoints.orders.downloadOrder}
            downloadData={{
              userName: merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              status: orderStatus.name,
              currencyCode: currencyType.id !== "" ? currencyType.id : "",
              merchantName: isMerchant ? "Select Merchant" : merchant.name,
            }}
            onClose={handleViewModal}
            source="orders_report"
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
                  options={
                    resellerRole
                      ? mapData?.data?.data || []
                      : merchantResponse?.data?.data || []
                  }
                  onChange={handleMerchantChange}
                  id={resellerRole ? "merchantUserName" : "userId"}
                  value={resellerRole ? "merchantFullName" : "fullName"}
                />
              </div>
            )}
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
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
                selectedValue={orderStatus}
                options={orderStatusTypes}
                onChange={(id, name) => setOrderStatus({ id, name })}
                id="id"
                value="name"
              />
            </div>
          </div>
          <CardPayIn data={responseOrder?.data?.summary} symbol={symbol} />
          <Table
            headers={headers}
            currentPage={responseOrder?.data.pageNumber}
            pageSize={responseOrder?.data.pageSize}
            totalElement={responseOrder?.data.totalElement}
            handleNext={handleNext}
            handlePrev={handlePrev}
            link={false}
            search={false}
            handleExportExcelModel={handleViewModal}
          >
            <BodyMapping
              data={responseOrder?.data.data || null}
              loading={loader}
            />
          </Table>
        </div>
      </>
    );
  }
};

export default OrderList;
