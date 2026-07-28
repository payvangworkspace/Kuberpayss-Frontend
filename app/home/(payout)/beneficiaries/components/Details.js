"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { headers } from "./Column";
import { loadingMsg } from "@/app/utils/message";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { useEffect, useState } from "react";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={7} className="text-center">
            {loadingMsg("beneficiary")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.beneficiaryId || "NA"}>
                <td>{item.beneficiaryName || "NA"}</td>
                <td>{item.beneficiaryNickName || "NA"}</td>
                <td>{item.beneficiaryContactNumber || "NA"}</td>
                <td>{item.beneficiaryEmail || "NA"}</td>
                <td>{item.accountNumber || "NA"}</td>
                <td>{item.ifscCode || "NA"}</td>
                <td>{item.vpa || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No beneficiaries Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const Details = ({ isAdmin, isMerchant, userId }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const [allMerchants, setAllMerchants] = useState([]);
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

  // Fetch all merchants

  useEffect(() => {
    const fetchAllMerchants = async () => {
      let allData = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const res = await getAllMerchants({
          start: page,
          size: 25,
        });

        const data = res?.data?.data || [];
        totalPages = res?.data?.totalPage || 1;

        allData = [...allData, ...data];
        page++;
      }

      setAllMerchants(allData);
    };

    fetchAllMerchants();
  }, []);

  const handleChangeMerchant = async (id, name) => {
    setCurrencyType({
      id: "",
      name: "All",
    });
    setMerchant({ id, name });
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

  //   const [dateRange, setDateRange] = useState({
  //     dateFrom: dateFormatter(new Date()),
  //     dateTo: dateFormatter(new Date()),
  //   });

  //   const handleDateChange = (event) => {
  //     const { name, value } = event.target;
  //     setDateRange((prev) => ({
  //       ...prev, // Spread the previous state
  //       [name]: dateFormatter(value), // Update the specific property
  //     }));
  //   };
  // API for getting user accounts based on merchant
  const { postData, response, loading } = usePostRequest(
    endPoints.payout.beneficiaryList
  );

  useEffect(() => {
    const userName = isAdmin ? merchant.id : userId;
    postData({ userName, currencyCode: currencyType.id });
  }, [isAdmin, merchant.id, userId, currencyType.id]);

  return (
    <div className="wrapper">
      <div className="row">
        {isAdmin && (
          <div className="col-md-3 col-sm-12 mb-2">
            <Label htmlFor="merchant" label="Merchant" />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={merchant}
              // options={merchantResponse?.data.data}
              options={allMerchants}
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
        {/* <div className="col-md-3 col-sm-12 mb-2">
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
        </div> */}
      </div>
      <Table
        headers={headers}
        link="/home/beneficiaries/add-beneficiary"
        download={false}
        search={false}
        pagination={false}
        onChange={handleKeyword}
      >
        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </Table>
    </div>
  );
};

export default Details;
