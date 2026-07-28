"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Table from "@/app/ui/table/Table";
import { headers } from "./Column";
import { useEffect, useState } from "react";
import Label from "@/app/ui/label/Label";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import { queryStringWithKeyword } from "@/app/services/queryString";
import useTableExports from "@/app/hooks/useTableExports";
import ExportExcel from "../model/ExportExcelModel";

const BodyMapping = ({ data, loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={2} className="text-center">
            {loadingMsg("login")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userActivityId}>
                <td>{item.userActivityId}</td>
                <td>{item.createdBy}</td>
                <td>{item.createdDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No Login History Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const Details = ({ role }) => {
  const [merchants, setMerchants] = useState([]);
  const {
    response: merchantList,
    postData: getMerchantData,
    error,
    loading,
  } = usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    getMerchantData(queryStringWithKeyword(0));
  }, []);

  const [merchant, setMerchant] = useState({ id: "", name: "Select Merchant" });
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  useEffect(() => {
    if (merchantList && !error) {
      setMerchant({
        id: merchantList?.data?.data[0]?.userId || "",
        name: merchantList?.data?.data[0]?.fullName || "MY",
      });
      const updatedMerchants = [
        ...merchantList.data.data,
        { userId: "", fullName: "MY" },
      ];
      setMerchants(updatedMerchants);
    }
  }, [merchantList, error]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const [loader, setLoader] = useState(false);
  // Handle for pagination

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const {
    postData: getLoginData,
    response: loginData,
    loading: loginLoading,
  } = usePostRequest(endPoints.loginHistoryDetail);

  useEffect(() => {
    getLoginData({
      userName: merchant.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currentPage]);

  useEffect(() => {
    if (loginLoading) setLoader(true);
  }, [loginLoading]);

  const { showModal, handleViewModal } = useTableExports(headers);
  return (
    <>
      {showModal && (
        <ExportExcel
          downloadUrl={endPoints.downloadLoginHistory}
          downloadData={{
            userName: merchant.id,
            dateFrom: dateRange.dateFrom,
            dateTo: dateRange.dateTo,
            merchantName: merchant.name,
          }}
          onClose={handleViewModal}
          source="login-history_report"
        />
      )}
      <div className="wrapper">
        <div className="row">
          {role && (
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchants}
                onChange={(id, name) => setMerchant({ id, name })}
                id="userId"
                value="fullName"
              />
            </div>
          )}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
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
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
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
          currentPage={loginData?.data?.pageNumber || 0}
          pageSize={loginData?.data?.pageSize || 0}
          totalElement={loginData?.data?.totalElement || null}
          search={false}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          handleExportExcelModel={handleViewModal}
        >
          <BodyMapping data={loginData?.data?.data} loading={loader} />
        </Table>
      </div>
    </>
  );
};

export default Details;
