"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import { data, headers } from "./Column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import RemittanceDetails from "../modal/remittanceDetails";
const currencyTypes = [
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];

const paymentStatusTypes = [
  { id: 1, name: "Pending" },
  { id: 2, name: "Success" },
  { id: 3, name: "Failed" },
];
const BodyMapping = ({ data = [], loading = true, role, merchant }) => {
  const [viewModal, setViewModal] = useState(false);
  const [remittanceData, setRemittanceData] = useState(null);
  const handleViewRemittanceDetail = (data) => {
    setRemittanceData(data);
    setViewModal(true);
  };
  return (
    <>
      {viewModal && (
        <RemittanceDetails
          role={role}
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={remittanceData}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={14} className="text-center">
              {loadingMsg("remittance")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.remittanceId}>
                  <td>{item.utr || "N/A"}</td>
                  <td>{item.payableAmount || "NA"}</td>
                  <td>{item.createdDate || "NA"}</td>
                  <td>{item.merchant.fullName || "NA"}</td>
                  <td>{item.currencyCode || "NA"}</td>
                  {role && <td>{item.acquirerCode || "NA"}</td>}
                  <td>
                    <i
                      className="bi bi-display-fill text-info"
                      title="View Details"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleViewRemittanceDetail(item)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14}>No data Available</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};
const Details = ({ role, isMerchant, isSubMerchant }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
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
  } = usePostRequest(endPoints.users.merchantList);
  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId
      )
    );
  }, [keyword.userId]);
  // end of merchant fetch logic
  useEffect(() => {
    if (merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "",
      });
    }
  }, [merchantError, merchantResponse]);

  const [paymentStatus, setPaymentStatus] = useState({
    id: "1",
    name: "Pending",
  });
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });

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

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };
  const { postData, response, error, loading } = usePostRequest(
    endPoints.remittance.remittance
  );
  useEffect(() => {
    postData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        "ALL",
        "",
        "",
        merchant.id,
        currencyType.id
      )
    );
  }, [merchant, currencyType, currentPage, currencyType.id]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
  return (
    <div className="wrapper">
      <div className="row">
        {role && (
          <div className="col-md-2 col-sm-12 mb-4">
            <>
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data.data}
                onChange={handleChangeMerchant}
                id="userId"
                value="fullName"
                search={true}
                onSearch={handleKeyword}
              />
            </>
          </div>
        )}

        {/* <div className="col-md-2 col-sm-12 mb-4">
          <Label htmlFor="currencyType" label="Payment Status" />
          <Dropdown
            initialLabel="Select Payment Status"
            selectedValue={paymentStatus}
            options={paymentStatusTypes}
            onChange={(id, name) => setPaymentStatus({ id, name })}
            id="id"
            value="name"
          />
        </div> */}
        <div className="col-md-3 col-sm-12 mb-2">
          <Label htmlFor="paymentStatus" label="Currency" />
          <Dropdown
            initialLabel="Select Currency"
            selectedValue={currencyType}
            options={currencyTypes}
            onChange={(id, name) => setCurrencyType({ id, name })}
            id="id"
            value="name"
          />
        </div>
        {/* <div className="col-md-2 col-sm-12 mb-4">
          <Label htmlFor="dateFrom" label="Date From" />
          <input
            type="date"
            id="inputDate"
            name="dateFrom"
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
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateTo)}
          />
        </div> */}
      </div>
      <Table
        headers={headers(role, isSubMerchant)}
        currentPage={response?.data.pageNumber || 0}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={(isMerchant || role) && "/home/remittance/add-remittance"}
        download={false}
        search={false}
      >
        <BodyMapping
          role={role}
          data={response?.data.data || null}
          loading={loader}
          merchant={merchant.name || ""}
        />
      </Table>
    </div>
  );
};

export default Details;
