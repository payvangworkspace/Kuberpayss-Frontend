"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import useGetRequest from "@/app/hooks/useFetch";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import BlockedIP from "./BlockedIp";
import BlockedIssuerCountry from "./BlockIssuerCountry";
import BlockedCard from "./BlockCard";
import BlockedCurrency from "./BlockCurrency";
import BlockedCallbackUrl from "./BlockCallBackUrl";
import BlockedPaymentType from "./BlockPaymentTypes";
import BlockedCustomerCountry from "./BlockCustomerCountry";
import BlockedDomainURL from "./BlockDomainUrl";
import BlockedURL from "./BlockReturnUrl";
import BlockedCustName from "./BlockCustomerName";
import BlockedMOP from "./BlockMOP";
import BlockedCardRange from "./BlockCardRange";
import BlockedProductDesc from "./BlockProductDesc";
import BlockedVPA from "./BlockVPAAddress";
import BlockedEmailAdd from "./BlockEmailAddress";
import BlockedCustomerPhone from "./BlockCustomerPhone";
import BlockedAmtLimit from "./BlockAmountLimit";
import Label from "@/app/ui/label/Label";
const Details = ({ role = false, userId = null, fullName = null }) => {
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  const [tab, setTab] = useState("IP_ADDRESS");
  const { response: merchantResponse = [], postData: getAllMerchants } =
    usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(0, process.env.NEXT_PUBLIC_PAGINATION_SIZE)
    );
  }, []);

  const {
    loading,
    error,
    response: response,
    getData: getAllFraudPrevention,
  } = useGetRequest();

  useEffect(() => {
    if (merchantResponse && role) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
      getAllFraudPrevention(endPoints.fraudPrevention.allFraudPrevention);
    } else {
      setMerchant({ id: userId, fullName: fullName });
      getAllFraudPrevention(endPoints.fraudPrevention.allFraudPrevention);
    }
  }, [merchantResponse]);

  const handleMerchantData = async (id, name) => {
    setMerchant({ id, name });
  };
  function handleClick(value) {
    setTab(value);
  }
  if (loading)
    return <p className="text-center">Please wait while fetching data</p>;
  if (error)
    return (
      <p className="text-center">
        Failed to fetch data. Please try again later
      </p>
    );
  if (response)
    return (
      <div className="row">
        <div className="col-md-3 col-sm-12 mb-2 d-flex flex-column gap-3">
          {role && (
            <span>
              <Label htmlFor="merchant" label="Select Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data.data}
                onChange={handleMerchantData}
                id="userId"
                value="fullName"
              />
            </span>
          )}
          <ul className={styles.prevention}>
            {response?.data.length > 0 &&
              response?.data.map((res) => (
                <li key={res.value}>
                  <button
                    className={
                      tab === res.value
                        ? styles.button + " " + styles.active
                        : styles.button
                    }
                    onClick={() => handleClick(res.value)}
                  >
                    {res.name} &nbsp;
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="col-md-9 col-sm-12 mb-2 mt-4">
          <div className="wrapper">
            {tab === "IP_ADDRESS" && (
              <BlockedIP
                type="IP_ADDRESS"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "ISSUER_COUNTRY" && (
              <BlockedIssuerCountry
                type="ISSUER_COUNTRY"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CARD_NUMBER" && (
              <BlockedCard
                type="CARD_NUMBER"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CURRENCY" && (
              <BlockedCurrency
                type="CURRENCY"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CALLBACK_URL" && (
              <BlockedCallbackUrl
                type="CALLBACK_URL"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "PAYMENT_TYPES" && (
              <BlockedPaymentType
                type="PAYMENT_TYPES"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CUSTOMER_COUNTRY" && (
              <BlockedCustomerCountry
                type="CUSTOMER_COUNTRY"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "DOMAIN_URL" && (
              <BlockedDomainURL
                type="DOMAIN_URL"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "RETURN_URL" && (
              <BlockedURL
                type="RETURN_URL"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CUSTOMER_NAME" && (
              <BlockedCustName
                type="CUSTOMER_NAME"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "MODE_OF_PAYMENT" && (
              <BlockedMOP
                type="MODE_OF_PAYMENT"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CARD_RANGE" && (
              <BlockedCardRange
                type="CARD_RANGE"
                userId={merchant.id}
                name={merchant.name}
              />
            )}

            {tab === "PRODUCT_DESC" && (
              <BlockedProductDesc
                type="PRODUCT_DESC"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "VPA_ADDRESS" && (
              <BlockedVPA
                type="VPA_ADDRESS"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "EMAIL_ADDRESS" && (
              <BlockedEmailAdd
                type="EMAIL_ADDRESS"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "CUSTOMER_PHONE" && (
              <BlockedCustomerPhone
                type="CUSTOMER_PHONE"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
            {tab === "AMOUNT_LIMIT" && (
              <BlockedAmtLimit
                type="AMOUNT_LIMIT"
                userId={merchant.id}
                name={merchant.name}
              />
            )}
          </div>
        </div>
      </div>
    );
};

export default Details;
