"use client";
import Table from "@/app/ui/table/Table";
import { useEffect, useState } from "react";
import { data, headers } from "./Column";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import { loadingMsg } from "@/app/utils/message";
import usePutRequest from "@/app/hooks/usePut";
const currencyTypes = [
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];

const settlementStatusTypes = [
  { id: 1, name: "ALL" },
  { id: 2, name: "SETTLE" },
  { id: 3, name: "UNSETTLE" },
];
const BodyMapping = ({ data, loading }) => {
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
                <td>{item.refundReconciliationId || "NA"}</td>
                <td>{item.refundStatus || "NA"}</td>
                <td>{item.refundAmount || "NA"}</td>
                <td>{item.acquirerCode || "NA"}</td>
                <td>{item.currencyCode || "NA"}</td>
                <td>{item.countryCode || "NA"}</td>
                <td>{item.customerName}</td>
                <td>{item.customerEmail || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td>{item.ordRequestId || "NA"}</td>
                <td>{item.netSettleAmount || 0.0} $</td>
                <td>{dateFormatter(item.createdDate)}</td>
                <td>{item.refundHoldReason}</td>
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
const Details = ({ role, subAdmin, resellerRole }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const [merchantList, setMerchantList] = useState([]);

  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const {
    loading: settlementLoading,
    error: settlementError,
    response: settlementResponse,
    postData: getAllSettlement,
  } = usePostRequest(endPoints.payin.refundTxn);
  useEffect(() => {
    if (settlementLoading) setLoader(true);
  }, [settlementLoading]);
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
  const {
    loading: settlementStatusLoading,
    error: settlementStatusError,
    response: settlementStatusResponse,
    putData: settlementStatusData,
  } = usePutRequest(endPoints.payin.settlementStatus);
  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  // useEffect(() => {
  //   getAllMerchants(
  //     queryStringWithKeyword(
  //       0,
  //       process.env.NEXT_PUBLIC_PAGINATION_SIZE,
  //       keyword.userId
  //     )
  //   );
  // }, [keyword.userId]);

  useEffect(() => {
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
  }, []);

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

  // end of merchant fetch logic
  // useEffect(() => {
  //   if (merchantResponse && !merchantError) {
  //     setMerchant({
  //       id: merchantResponse?.data?.data[0]?.userId || "",
  //       name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
  //     });
  //   }
  // }, [merchantError, merchantResponse]);

  const [settlementStatus, setSettlementStatus] = useState(
    settlementStatusTypes[0],
  );
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
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

  useEffect(() => {
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
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };
  return (
    <>
      <div className="wrapper">
        <div className="row">
          {(role || subAdmin) && (
            <div className="col-md-2 col-sm-12 mb-4">
              <>
                <Label htmlFor="merchant" label="Merchant" />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={merchant}
                  // options={
                  //   resellerRole
                  //     ? mapData?.data?.data || []
                  //     : merchantList || []
                  //   // : merchantResponse?.data?.data || []
                  // }
                  options={[
                    {
                      userId: "",
                      fullName: "All",
                    },
                    ...(resellerRole
                      ? mapData?.data?.data || []
                      : merchantList || []),
                  ]}
                  onChange={handleChangeMerchant}
                  id="userId"
                  value="fullName"
                  // search={true}
                  // onSearch={handleKeyword}
                />
              </>
            </div>
          )}
          <div className="col-md-2 col-sm-12 mb-4">
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
          <div className="col-md-2 col-sm-12 mb-4">
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
          <div className="col-md-2 col-sm-12 mb-4">
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
          <div className="col-md-2 col-sm-12 mb-4">
            <Label htmlFor="status" label="Status" />
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
        <Table
          headers={headers}
          currentPage={settlementResponse?.data.pageNumber}
          pageSize={settlementResponse?.data.pageSize}
          totalElement={settlementResponse?.data.totalElement}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          search={false}
          // handleExportExcelModel={handleViewModal}
        >
          <BodyMapping
            data={settlementResponse?.data.data || null}
            loading={loader}
          />
        </Table>
      </div>
    </>
  );
};

export default Details;
