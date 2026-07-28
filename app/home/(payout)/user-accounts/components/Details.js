"use client";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import { use, useEffect, useState } from "react";
import WalletCard from "./WalletCard";
const currencyTypes = [
  { id: "INR", name: "Indian Rupee" },
  { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "Pound Sterling" },
];

const BodyMapping = ({ data, loading }) => {
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
          {Object.keys(data) && Object.keys(data).length > 0 ? (
            <>
              {Object.entries(data)?.map(([key, wallets]) => (
                <tr key={key} className="wallet-row">
                  <td colSpan={9}>
                    <h6 className="mb-0">{key}</h6>
                    <small className="">id: {wallets[0].user.userId}</small>
                    <div className="d-flex flex-wrap gap-3">
                      {wallets?.map((item, index) => (
                        <WalletCard
                          key={index}
                          wallet={{
                            walletId: item.userAccountId,
                            currency: item.currency?.currencyCode,
                            balance: item.amountBalance,
                            lastUpdated: item.lastModifiedDate,
                          }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </>
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

const Details = ({ isAdmin, userId, isMerchant }) => {
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
  };

  useEffect(() => {
    if (isAdmin) {
      // If admin, fetch currencies for selected merchant
      if (merchant.id) {
        getCurrencyData(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      // If not admin, fetch currencies for userId from props
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

  // API for getting user accounts based on merchant
  const { postData, response, loading } = usePostRequest(
    endPoints.payout.getUserAccounts
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
      </div>
      <Table download={false} search={false} pagination={false}>
        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </Table>
    </div>
  );
};

export default Details;
