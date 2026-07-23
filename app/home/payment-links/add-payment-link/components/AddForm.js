"use client";
import {
  addPaymentLink,
  buildPaymentLinkPayload,
  CARD_PAYLOAD_FIELDS,
  CARD_TXN_TYPE,
} from "@/app/formBuilder/payout";
import useGetRequest from "@/app/hooks/useFetch";
import useMerchant from "@/app/hooks/useMerchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
// import { userEmail } from "@/app/services/storageData";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { dateTimeFormatter } from "@/app/utils/dateFormatter";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AddForm.module.css";
const txnTypes = [
  { id: "SALE", name: "SALE" },
  { id: "AUTH", name: "AUTH" },
  { id: CARD_TXN_TYPE, name: CARD_TXN_TYPE },
];

const currentYear = new Date().getFullYear();

const cardExpMonthOptions = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1).padStart(2, "0");
  return { id: month, name: month };
});

const cardExpYearOptions = Array.from({ length: 16 }, (_, index) => {
  const year = String(currentYear + index);
  return { id: year, name: year };
});

const AddForm = ({ merchantId, role, merchantRole }) => {
  //   Logic to fetch all mapped currency and countries of merchant
  // handling search keyword
  const [keyword, setKeyword] = useState({ currencyId: "", countryId: "" });
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const router = useRouter();
  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();
  const { getData: getCountryData, response: countries = [] } = useGetRequest();
  const { getData: getAppKey, response: appKeyResponse = [] } = useGetRequest();
  const { getData: getCurrencyData, response: currencies = [] } =
    useGetRequest();
  useEffect(() => {
    const idToUse = merchantRole ? merchantId : selectedMerchant.id;
    if (idToUse) {
      getCountryData(endPoints.mapping.country + "/" + idToUse);
    }
  }, [merchantId, selectedMerchant.id, merchantRole]);
  useEffect(() => {
    const idToUse = merchantRole ? merchantId : selectedMerchant.id;
    if (idToUse) {
      getCurrencyData(endPoints.mapping.currency + "/" + idToUse);
    }
  }, [merchantId, selectedMerchant.id, merchantRole]);

  useEffect(() => {
    const idToUse = merchantRole ? merchantId : selectedMerchant.id;
    if (idToUse) getAppKey(endPoints.paymentLink.appKey + idToUse);
  }, [merchantId, selectedMerchant.id, merchantRole]);

  const [country, setCountry] = useState({ id: "", name: "Select Country" });
  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });

  // End of fetching mapped country and currency
  const [txnType, setTxnType] = useState({
    id: "",
    name: "Select Transaction Type",
  });
  const [cardExpMonth, setCardExpMonth] = useState({
    id: "",
    name: "Select Month",
  });
  const [cardExpYear, setCardExpYear] = useState({
    id: "",
    name: "Select Year",
  });

  const isCardTxn = (txnType.id || txnType.name) === CARD_TXN_TYPE;

  // oderid

  const {
    getData: getOrderData,
    response: orderResponse,
    loading: orderLoading,
    error: orderError,
  } = useGetRequest();
  useEffect(() => {
    getOrderData(endPoints.payout.getOrderId);
  }, []);

  useEffect(() => {
    if (orderResponse?.data) {
      const autoId = `${orderResponse?.data}`;

      setFormData((prev) => ({
        ...prev,
        ordRequestId: autoId,
      }));
    }
  }, [orderResponse]);

  // Form submission
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.paymentLink.addPaymentLinkMerchant
  );

  const [formData, setFormData] = useState(
    addPaymentLink(selectedMerchant, appKeyResponse?.data?.appKey)
  );
  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "expDate") {
      setFormData({ ...formData, [name]: dateTimeFormatter(value).toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
  };
  const [notificationToggles, setNotificationToggles] = useState({
    email: false,
    phone: false,
    expiry: false,
  });

  const handleCheckboxChange = (type) => {
    setNotificationToggles((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));

    // Clear the field when unchecked
    if (notificationToggles[type]) {
      handleChange({
        target: {
          name: type,
          value: "",
        },
      });
    }

    if (type === "expiry") {
      setFormData((prev) => ({
        ...prev,
        notifyDate: "",
      }));
    }

    if (type === "email") {
      setFormData((prev) => ({
        ...prev,
        notifyEmail: "",
      }));
    }
    if (type === "phone") {
      setFormData((prev) => ({
        ...prev,
        notifyPhone: "",
      }));
    }
  };
  const handleCountryDropDownChange = (id, name) => {
    setCountry({ id, name });
    setFormData((prev) => ({
      ...prev,
      countryCode: id,
    }));
    setErrors({});
  };
  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyCode: id,
    }));
    setErrors({});
  };

  const handleTxnTypeChange = (id, name) => {
    setTxnType({ id, name });
    setGeneratedLink("");
    setFormData((prev) => {
      const next = { ...prev, txnType: id || name };

      if ((id || name) !== CARD_TXN_TYPE) {
        CARD_PAYLOAD_FIELDS.forEach((field) => {
          delete next[field];
        });
      }

      return next;
    });
    if ((id || name) !== CARD_TXN_TYPE) {
      setCardExpMonth({ id: "", name: "Select Month" });
      setCardExpYear({ id: "", name: "Select Year" });
    }
    setErrors({});
  };

  const handleCardExpMonthChange = (id, name) => {
    setCardExpMonth({ id, name });
    setFormData((prev) => ({
      ...prev,
      cardExpMonth: id,
    }));
    setErrors({});
  };

  const handleCardExpYearChange = (id, name) => {
    setCardExpYear({ id, name });
    setFormData((prev) => ({
      ...prev,
      cardExpYear: id,
    }));
    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const option = {
      merchantAppId: appKeyResponse?.data?.appKey || "",
      merchantSecretId: appKeyResponse?.data?.secretKey || "",
    };
    await postData(
      buildPaymentLinkPayload(formData, txnType.id || txnType.name),
      false,
      false,
      option
    );
  }

  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    if (response && !error) {
      // console.log("response from payment Link", response);
      if (response.data.status === "success") {
        setFormData(
          addPaymentLink(selectedMerchant, appKeyResponse?.data?.appKey)
        );
        setTxnType({ id: "", name: "Select Transaction Type" });
        setCardExpMonth({ id: "", name: "Select Month" });
        setCardExpYear({ id: "", name: "Select Year" });
        setCountry({ id: "", name: "Select State" });
        setCurrency({ id: "", name: "Select Currency" });

        setGeneratedLink(response?.data?.data?.paymentUrl);
        successMsg("Payment link created successfully");

        formRef.current.reset();
      }
    }
  }, [response, error, appKeyResponse]);

  function convertFormatWithMoment(comingFormat) {
    const momentObj = moment(comingFormat, "DD MMM YYYY hh:mm:ss a");
    if (momentObj.isValid()) {
      // Subtract 24 hours (1 day)
      // momentObj.subtract(1, "day");
      return momentObj.format("YYYY-MM-DDTHH:mm");
    } else {
      return "Invalid Date Format";
    }
  }

  useEffect(() => {
    const idToUse = merchantRole ? merchantId : selectedMerchant.id;
    if (idToUse) {
      setFormData((prev) => ({
        ...prev,
        merchantId: idToUse,
      }));
    }
  }, [merchantId, selectedMerchant.id, merchantRole]);

  // Ensure appKey from API is injected into formData when it becomes available
  useEffect(() => {
    const appKey = appKeyResponse?.data?.appKey;
    if (appKey) {
      setFormData((prev) => ({
        ...prev,
        appKey,
      }));
    }
  }, [appKeyResponse?.data?.appKey]);

  if (countries && currencies) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Payment Links</p>
            <h2 className={styles.title}>Add Payment Link</h2>
            <p className={styles.subtitle}>
              Create a new payment link with customer and transaction details
            </p>
          </div>
        </div>

        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
            <div className={styles.row}>
              {role && (
                <div className={styles.field}>
                  <Label
                    htmlFor="merchant"
                    label="Select Merchant"
                    required={true}
                  />
                  <Dropdown
                    initialLabel="Select Merchant"
                    selectedValue={selectedMerchant}
                    options={merchantList?.data?.data}
                    onChange={handleMerchantChange}
                    id="userId"
                    value="fullName"
                  />
                  {errors.merchant && (
                    <small className={styles.errorText}>
                      <span className={styles.errorMarker}> *</span>
                      {errors.merchant}
                    </small>
                  )}
                </div>
              )}
              <div className={styles.field}>
                <Label
                  htmlFor="txnType"
                  label="Select Transaction Type"
                  required={true}
                />
                <Dropdown
                  initialLabel="Select Transaction Type"
                  selectedValue={txnType}
                  options={txnTypes}
                  onChange={handleTxnTypeChange}
                  id="id"
                  value="name"
                />
                {errors.txnTypes && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.txnTypes}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label htmlFor="country" label="Country" required={true} />
                <Dropdown
                  initialLabel="Select Country"
                  selectedValue={country}
                  options={countries?.data}
                  onChange={handleCountryDropDownChange}
                  id="countryCode"
                  value="countryName"
                  search={true}
                  onSearch={handleKeyword}
                />
                {errors.country && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.country}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label htmlFor="currency" label="Currency" required={true} />
                <Dropdown
                  initialLabel="Select Currency"
                  selectedValue={currency}
                  options={currencies?.data}
                  onChange={handleCurrencyDropDownChange}
                  id="currencyCode"
                  value="currencyName"
                  search={true}
                  onSearch={handleKeyword}
                />
                {errors.currency && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.currency}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label
                  htmlFor="payableAmount"
                  label="Payable Amount"
                  required={true}
                />
                <input
                  type="text"
                  name="payableAmount"
                  id="payableAmount"
                  placeholder="Enter payable amount"
                  className="forminput"
                  onChange={handleChange}
                />
                {errors.payableAmount && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.payableAmount}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label
                  htmlFor="ordRequestId"
                  label="Order Request ID"
                  required={true}
                />
                <input
                  type="text"
                  name="ordRequestId"
                  id="ordRequestId"
                  placeholder="Enter payment type code"
                  className="forminput"
                  value={orderResponse?.data ? `${orderResponse.data}` : ""}
                  onChange={handleChange}
                  disabled
                />
                {errors.ordRequestId && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.ordRequestId}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label
                  htmlFor="customerName"
                  label="Customer Name"
                  required={true}
                />
                <input
                  type="text"
                  name="customerName"
                  id="customerName"
                  placeholder="Enter customer name"
                  className="forminput"
                  onChange={handleChange}
                  required
                />
                {errors.customerName && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.customerName}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label
                  htmlFor="customerEmailId"
                  label="Customer Email ID"
                  required={true}
                />
                <input
                  type="text"
                  name="customerEmailId"
                  id="customerEmailId"
                  placeholder="Enter customer email id"
                  className="forminput"
                  onChange={handleChange}
                  required
                />
                {errors.customerEmailId && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.customerEmailId}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label
                  htmlFor="customerContactNumber"
                  label="Customer Contact Number"
                  required={true}
                />
                <input
                  type="text"
                  name="customerContactNumber"
                  id="customerContactNumber"
                  placeholder="Enter customer contact number"
                  className="forminput"
                  onChange={handleChange}
                />
                {errors.customerContactNumber && (
                  <small className={styles.errorText}>
                    <span className={styles.errorMarker}> *</span>
                    {errors.customerContactNumber}
                  </small>
                )}
              </div>
              <div className={styles.field}>
                <Label htmlFor="returnUrl" label="Return Url" required={false} />
                <input
                  type="text"
                  name="return_url"
                  id="return_url"
                  placeholder="Enter return url"
                  className="forminput"
                  onChange={handleChange}
                />
              </div>
            </div>

            {isCardTxn && (
              <div className={styles.section}>
                <h6 className={styles.sectionTitle}>Card Details</h6>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <Label
                      htmlFor="cardNo"
                      label="Card Number"
                      required={true}
                    />
                    <input
                      type="text"
                      name="cardNo"
                      id="cardNo"
                      placeholder="Enter card number"
                      className="forminput"
                      value={formData.cardNo || ""}
                      onChange={handleChange}
                      required
                    />
                    {errors.cardNo && (
                      <small className={styles.errorText}>
                        <span className={styles.errorMarker}> *</span>
                        {errors.cardNo}
                      </small>
                    )}
                  </div>
                  <div className={styles.field}>
                    <Label
                      htmlFor="cardHolderName"
                      label="Card Holder Name"
                      required={true}
                    />
                    <input
                      type="text"
                      name="cardHolderName"
                      id="cardHolderName"
                      placeholder="Enter card holder name"
                      className="forminput"
                      value={formData.cardHolderName || ""}
                      onChange={handleChange}
                      required
                    />
                    {errors.cardHolderName && (
                      <small className={styles.errorText}>
                        <span className={styles.errorMarker}> *</span>
                        {errors.cardHolderName}
                      </small>
                    )}
                  </div>
                  <div className={styles.field}>
                    <Label
                      htmlFor="cardExpMonth"
                      label="Card Expiry Month"
                      required={true}
                    />
                    <Dropdown
                      initialLabel="Select Month"
                      selectedValue={cardExpMonth}
                      options={cardExpMonthOptions}
                      onChange={handleCardExpMonthChange}
                      id="id"
                      value="name"
                    />
                    {errors.cardExpMonth && (
                      <small className={styles.errorText}>
                        <span className={styles.errorMarker}> *</span>
                        {errors.cardExpMonth}
                      </small>
                    )}
                  </div>
                  <div className={styles.field}>
                    <Label
                      htmlFor="cardExpYear"
                      label="Card Expiry Year"
                      required={true}
                    />
                    <Dropdown
                      initialLabel="Select Year"
                      selectedValue={cardExpYear}
                      options={cardExpYearOptions}
                      onChange={handleCardExpYearChange}
                      id="id"
                      value="name"
                    />
                    {errors.cardExpYear && (
                      <small className={styles.errorText}>
                        <span className={styles.errorMarker}> *</span>
                        {errors.cardExpYear}
                      </small>
                    )}
                  </div>
                  <div className={styles.field}>
                    <Label htmlFor="cardCVV" label="Card CVV" required={true} />
                    <input
                      type="password"
                      name="cardCVV"
                      id="cardCVV"
                      placeholder="Enter card CVV"
                      className="forminput"
                      value={formData.cardCVV || ""}
                      onChange={handleChange}
                      maxLength={4}
                      required
                    />
                    {errors.cardCVV && (
                      <small className={styles.errorText}>
                        <span className={styles.errorMarker}> *</span>
                        {errors.cardCVV}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h6 className={styles.sectionTitle}>Notifications & Expiry</h6>
              <div className={styles.optionsGrid}>
                <div className={styles.optionField}>
                  <label className={styles.permItem}>
                    <input
                      type="checkbox"
                      checked={notificationToggles.email}
                      onChange={() => handleCheckboxChange("email")}
                    />
                    <span>Notify via Email</span>
                  </label>
                  {notificationToggles.email && (
                    <>
                      <input
                        type="email"
                        name="notifyEmail"
                        id="notifyEmail"
                        value={formData.notifyEmail || ""}
                        onChange={handleChange}
                        className="forminput"
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <small className={styles.errorText}>
                          <span className={styles.errorMarker}> *</span>
                          {errors.email}
                        </small>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.optionField}>
                  <label className={styles.permItem}>
                    <input
                      type="checkbox"
                      checked={notificationToggles.phone}
                      onChange={() => handleCheckboxChange("phone")}
                    />
                    <span>Notify via Phone</span>
                  </label>
                  {notificationToggles.phone && (
                    <>
                      <input
                        type="tel"
                        name="notifyPhone"
                        id="notifyPhone"
                        value={formData.notifyPhone || ""}
                        onChange={handleChange}
                        className="forminput"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <small className={styles.errorText}>
                          <span className={styles.errorMarker}> *</span>
                          {errors.phone}
                        </small>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.optionField}>
                  <label className={styles.permItem}>
                    <input
                      type="checkbox"
                      checked={notificationToggles.expiry}
                      onChange={() => handleCheckboxChange("expiry")}
                    />
                    <span>Link Expiry</span>
                  </label>
                  {notificationToggles.expiry && (
                    <>
                      <input
                        type="datetime-local"
                        name="expDate"
                        id="expDate"
                        value={
                          formData.expDate
                            ? convertFormatWithMoment(formData.expDate)
                            : ""
                        }
                        onChange={handleChange}
                        className="forminput"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {errors.expiry && (
                        <small className={styles.errorText}>
                          <span className={styles.errorMarker}> *</span>
                          {errors.expiry}
                        </small>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {generatedLink && (
              <div className={styles.generatedBox}>
                <h6 className={styles.generatedTitle}>
                  Generated Payment Link
                </h6>
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.generatedLink}
                >
                  {generatedLink}
                </a>
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => router.back()}
              >
                Back
              </button>
              <span className={styles.actionsRight}>
                <button
                  type={loading ? "button" : "submit"}
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Please Wait..." : "Submit"}
                </button>
                <button
                  type="reset"
                  className={styles.clearBtn}
                  onClick={() => {
                    setErrors({});
                    setFormData(
                      addPaymentLink(
                        selectedMerchant,
                        appKeyResponse?.data?.appKey,
                      ),
                    );
                    setTxnType({ id: "", name: "Select Transaction Type" });
                    setCardExpMonth({ id: "", name: "Select Month" });
                    setCardExpYear({ id: "", name: "Select Year" });
                    setCountry({ id: "", name: "Select Country" });
                    setCurrency({ id: "", name: "Select Currency" });
                    setNotificationToggles({
                      email: false,
                      phone: false,
                      expiry: false,
                    });
                  }}
                >
                  Clear
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default AddForm;
