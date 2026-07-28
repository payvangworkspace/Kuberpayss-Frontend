"use client";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { useEffect, useState } from "react";
import { headers } from "./Columns";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={9} className="text-center">
            {loadingMsg("merchant")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userAccountId}>
                <td>{item?.userAccount?.user?.fullName || "NA"}</td>
                <td>{item?.createdDate || "NA"}</td>
                <td>
                  {item.currency.currencyName} ({item.currency.currencyCode})
                </td>
                <td>{item.previousBalance || "0.0"}</td>
                <td>{item.amount || "0.0"}</td>
                <td>{item.updatedBalance || "0.0"}</td>
                <td>{item.transactionTypes || "CREDIT"}</td>
                <td>{item.remark || "NA"}</td>
                <td>{item.receiptId || "NA"}</td>
                <td>
                  {item.image ? (
                    <i
                      className="bi bi-file-earmark-image text-info"
                      title="View Image"
                    ></i>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No Data Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const Details = ({ isAdmin, isMerchant, isSubMerchant, userId }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  // fetch all merchants
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const { response: merchantResponse = [], postData: getAllMerchants } =
    usePostRequest(endPoints.users.merchantList);

  const handleChangeMerchant = async (id, name) => {
    setCurrencyType({
      id: "",
      name: "All",
    });
    setMerchant({ id, name });
    setCurrentPage(0);
  };

  useEffect(() => {
    if (isAdmin) {
      if (merchant.id) {
        getCurrencyData(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      getCurrencyData(endPoints.users.mappedCurrency + userId);
    }
  }, [isAdmin, merchant.id, userId]);

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId
      )
    );
  }, [keyword.userId]);
  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "All",
  });
  // API for getting currencies based on merchant
  const { getData: getCurrencyData, response: currencyResponse } =
    useGetRequest();

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
  // API for getting user accounts based on merchant
  const { postData, response, loading } = usePostRequest(
    endPoints.payout.loadMoney
  );
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  useEffect(() => {
    const userName = isAdmin ? merchant.id : userId;
    postData({
      userName,
      currencyCode: currencyType.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  }, [isAdmin, merchant.id, userId, currencyType.id, dateRange, currentPage]);

  return (
    <div className="wrapper">
      <div className="row">
        {isAdmin && (
          <div className="col-md-3 col-sm-12 mb-2">
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
          </div>
        )}
        <div className="col-md-3 col-sm-12 mb-2">
          <Label htmlFor="currency" label="Currency" />
          <Dropdown
            initialLabel="Select Currency"
            selectedValue={currencyType}
            options={currencyResponse?.data || []}
            onChange={(id, name) => setCurrencyType({ id, name })}
            id="currencyId"
            value="currencyName"
            search={false}
          />
        </div>
        <div className="col-md-3 col-sm-12 mb-2">
          <Label htmlFor="dateFrom" label="Date From" />
          <input
            type="date"
            id="inputDate"
            name="dateFrom"
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateFrom)}
          />
        </div>
        <div className="col-md-3 col-sm-12 mb-2">
          <Label htmlFor="dateTo" label="Date To" />
          <input
            type="date"
            id="inputDate"
            name="dateTo"
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateTo)}
          />
        </div>
      </div>
      <Table
        headers={headers}
        link={isAdmin ? "/home/load-money/add-load-money" : undefined}
        currentPage={response?.data?.pageNumber || 0}
        pageSize={response?.data?.pageSize || 0}
        totalElement={response?.data?.totalElement || null}
        search={false}
        handleNext={handleNext}
        handlePrev={handlePrev}
      >
        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </Table>
      {/* <Table
        headers={headers}
        link={isAdmin ? "/home/load-money/add-load-money" : undefined}
        download={false}
        search={false}
        onChange={handleKeyword}
      >
        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </Table> */}
    </div>
  );
};

export default Details;
