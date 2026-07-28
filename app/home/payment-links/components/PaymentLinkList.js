"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { use, useEffect, useState } from "react";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { loadingMsg } from "@/app/utils/message";
import { headers } from "./column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import useTableExports from "@/app/hooks/useTableExports";
import DownloadDetailModal from "@/app/ui/table/DownloadDetailModal";
import useGetRequest from "@/app/hooks/useFetch";

const currencyTypes = [
  // { id: "", name: "All" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
  // { id: "INR", name: "Indian Rupee" },
];

const paymentStatusTypes = [
  { id: "", name: "All" },
  { id: "Pending", name: "Pending" },
  { id: "Success", name: "Success" },
  { id: "Failed", name: "Failed" },
  { id: "Rejected", name: "Rejected" },
  { id: "Declined", name: "Declined" },
];

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={7} className="text-center">
            {loadingMsg("payment link")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.paymentLinkId | "NA"}>
                <td>{item.payableAmount || 0.0}</td>
                <td>{item.orderId || "NA"}</td>
                <td>{item.customerName || "NA"}</td>
                <td>{item.customerEmailId || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td style={{ width: 800 }}>{item.paymentLinkUrl || "NA"}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No Payment Links Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const PaymentLinkList = ({
  role,
  isMerchant,
  subAdmin,
  subMerchant,
  userEmail,
  resellerRole,
}) => {
  // fetch merchant list for dropdown
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const [merchantList, setMerchantList] = useState([]);

  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.allMerchantList);
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

  const { response: permissionResponse, getData: permissionData } =
    useGetRequest();

  useEffect(() => {
    // Call only for Sub Admin or Sub Merchant
    if ((subAdmin || subMerchant) && userEmail) {
      permissionData(endPoints.settings.getPermission + userEmail);
    }
  }, [subAdmin, subMerchant, userEmail]);

  // end of merchant fetch logic
  useEffect(() => {
    if (merchantResponse && !merchantError) {
      setMerchant({
        id: "",
        name: "All",
      });
    }
  }, [merchantError, merchantResponse]);

  const [paymentStatus, setPaymentStatus] = useState({
    id: "",
    name: "All",
  });
  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "All",
  });
  //   fetching Payment links logic
  const [currentPage, setCurrentPage] = useState(0);
  // handling search keyword
  const [paymentkeyword, setPaymentKeyword] = useState("");
  const handlePaymentLinkKeyword = (e) => setPaymentKeyword(e.target.value);
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
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.paymentLink.getPaymentLink);

  const getPaymentLinkData = async () => {
    await postData(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        paymentkeyword,
        paymentStatus.id || "All",
        dateRange.dateFrom,
        dateRange.dateTo,
        merchant.id || "",
        currencyType.id || "",
      ),
    );
  };

  useEffect(() => {
    // Remove the condition that checks for merchant.id, always call the API
    getPaymentLinkData();
  }, [
    currentPage,
    paymentkeyword,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchant.id,
    paymentStatus.id || "All",
    currencyType.id,
  ]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  if (error) return <p>Error fetching payment links</p>;
  const { showModal, handleViewModal } = useTableExports(headers);
  return (
    <>
      {showModal && (
        <DownloadDetailModal
          downloadUrl={endPoints.paymentLink.downloadPaymentLink}
          downloadData={{
            userName: merchant.id || "",
            dateFrom: dateRange.dateFrom,
            dateTo: dateRange.dateTo,
            status: paymentStatus.name || "All",
            currencyCode: currencyType.id || "",
          }}
          onClose={handleViewModal}
          source="payment_list"
        />
      )}
      <div className="wrapper">
        <div className="row">
          {(role || subAdmin) && (
            <div className="col-md-2 col-sm-12 mb-4">
              <>
                <Label htmlFor="merchant" label="Merchant" />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={merchant}
                  options={
                    resellerRole
                      ? mapData?.data?.data || []
                      : merchantList || []
                    // : merchantResponse?.data?.data || []
                  }
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
            <Label htmlFor="currencyType" label="Payment Status" />
            <Dropdown
              initialLabel="Select Status"
              selectedValue={paymentStatus}
              options={paymentStatusTypes}
              onChange={(id, name) => {
                setPaymentStatus({ id, name });
              }}
              id="id"
              value="name"
            />
          </div>
          <div className="col-md-2 col-sm-12 mb-4">
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
        </div>
        <Table
          headers={headers}
          currentPage={response?.data.pageNumber || 0}
          pageSize={response?.data.pageSize || 0}
          totalElement={response?.data.totalElement || 0}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={
            role ||
            isMerchant ||
            (subAdmin && permissionResponse?.data?.addPaymentLink) ||
            (subMerchant && permissionResponse?.data?.addPaymentLink)
              ? "/home/payment-links/add-payment-link"
              : ""
          }
          download={true}
          search={false}
          onChange={handlePaymentLinkKeyword}
          handleExportExcelModel={handleViewModal}
        >
          <BodyMapping data={response?.data.data || null} loading={loader} />
        </Table>
      </div>
    </>
  );
};

export default PaymentLinkList;
