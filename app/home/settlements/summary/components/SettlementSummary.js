"use client";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import React, { useEffect, useState } from "react";
import ChargeCard from "@/app/ui/cards/ChargeCard";
import Settle from "../../components/settleModal/SettleModal";
import {
  SUPPORTED_CURRENCIES as currencyTypes,
  DEFAULT_CURRENCY,
  getCurrencySymbol,
} from "@/app/utils/currency";

const SettlementSummary = ({ role, userId, resellerRole }) => {
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const [merchantList, setMerchantList] = useState([]);
  const [currencyType, setCurrencyType] = useState(DEFAULT_CURRENCY);
  const symbol = getCurrencySymbol(currencyType.id);

  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.allMerchantList);
  useEffect(() => {
    if (merchant.id) {
      getSummaryData(
        `${endPoints.payin.settlementSummary}${merchant.id}?currencyCode=${currencyType.id}`,
      );
    }
  }, [merchant.id, currencyType.id]);
  const { getData: getSummaryData, response: summaryResponse } =
    useGetRequest();

  // useEffect(() => {
  //   getAllMerchants(queryStringWithKeyword(0));
  // }, []);

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

  useEffect(() => {
    if (merchantResponse?.data?.data?.length > 0) {
      setMerchant({
        id: merchantResponse.data.data[0].userId || "",
        name: merchantResponse.data.data[0].fullName || "Select Merchant",
      });
    }
  }, [merchantResponse]);
  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
  };
  const handleCurrencyChange = (id, name) => {
    setCurrencyType({ id, name });
  };
  const [viewSettle, setViewSettle] = useState(false);
  const handleSettleClick = () => {
    setViewSettle(true);
  };
  if (merchantError)
    return <p className="text-center">Error: Failed to fetch data</p>;

  if (merchantResponse)
    return (
      <>
        {viewSettle && (
          <Settle
            id={merchant.id}
            onClick={() => setViewSettle(false)}
            onSuccess={() => {
              getSummaryData(
                `${endPoints.payin.settlementSummary}${merchant.id}?currencyCode=${currencyType.id}`,
              );
            }}
            settlementId={null}
          />
        )}
        <div className="wrapper">
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={
                  resellerRole ? mapData?.data?.data || [] : merchantList || []
                  // : merchantResponse?.data?.data || []
                }
                onChange={handleMerchantChange}
                id={"userId"}
                value={"fullName"}
              />
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <Label htmlFor="currencyType" label="Currency" />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={handleCurrencyChange}
                id="id"
                value="name"
                all={false}
              />
            </div>
          </div>
          <div className="row">
            {(() => {
              const summary =
                summaryResponse?.data?.data ||
                summaryResponse?.data ||
                summaryResponse ||
                {};
              return (
                <>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Count"
                      value={summary.totalCount ?? 0}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Payable Amount"
                      value={summary.totalPayableAmount ?? 0}
                      symbol={symbol}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Settlement Amount"
                      value={summary.totalSettlementAmount ?? 0.0}
                      symbol={symbol}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Sale Amount"
                      value={summary.totalSaleAmount ?? 0.0}
                      symbol={symbol}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Refund Amount"
                      value={summary.totalRefundAmount ?? 0.0}
                      symbol={symbol}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Total Auth Amount"
                      value={summary.totalAuthAmount ?? 0.0}
                      symbol={symbol}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Settled Count"
                      value={summary.settledCount ?? 0.0}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Unsettled Count"
                      value={summary.unsettledCount ?? 0}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <ChargeCard
                      type="Left Settlement Amount"
                      value={summary.leftSettlementAmount ?? 0.0}
                      symbol={symbol}
                      onClick={handleSettleClick}
                      allAmountsSettled={summary.allAmountsSettled}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </>
    );
};

export default SettlementSummary;
