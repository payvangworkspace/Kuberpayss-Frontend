"use client";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import useGetRequest from "@/app/hooks/useFetch";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { addSinglePayout } from "@/app/formBuilder/payout";
import BeneficiaryDetails from "./BeneficiaryDetails";
import styles from "./AddForm.module.css";

export default function Single({
  formData,
  handleChange,
  setFormData,
  response,
  loading,
  error,
  errors,
  setErrors,
  isAdmin,
}) {
  const router = useRouter();

  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
  });
  const [symbol, setSymbol] = useState("₹");

  const [countryTypes, setCountryTypes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    id: "",
    name: "Select Country",
    currencyId: "",
  });

  const {
    response: merchantResponse,
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantListOnly);

  const {
    getData,
    response: currencyResponse,
    error: currencyError,
  } = useGetRequest();

  const { response: countryResponse, getData: getAllCountries } =
    useGetRequest();

  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  useEffect(() => {
    if (!selectedMerchant.id) return;
    getAllCountries(endPoints.mapping.country + "/" + selectedMerchant.id);
  }, [selectedMerchant]);

  useEffect(() => {
    if (!selectedMerchant.id) return;
    getData(endPoints.users.mappedCurrency + selectedMerchant.id);
  }, [selectedMerchant]);

  useEffect(() => {
    if (countryResponse && countryResponse.data) {
      const countries = countryResponse.data
        .filter((country) => country !== null)
        .map((country) => ({
          id: country.countryCode,
          name: country.countryName,
        }));
      setCountryTypes(countries);
    }
  }, [countryResponse]);

  useEffect(() => {
    if (currencyResponse) {
      const data = currencyResponse?.data;
      const currencyList = data?.map((item) => ({
        id: item?.currencyCode,
        name: item?.currencyName,
      }));
      setCurrencyTypes(currencyList);

      if (currencyList?.length > 0) {
        handleCurrencyChange(currencyList[0]?.id, currencyList[0]?.name);
      } else {
        handleCurrencyChange("", "Select Currency");
      }
    }
    if (currencyError) {
      setCurrencyTypes([]);
      handleCurrencyChange("", "Select Currency");
    }
  }, [currencyResponse, currencyError]);

  const [transferModes, setTransferModes] = useState([]);

  const [selectedTransferMode, setSelectedTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });

  const {
    response: transferModeResponse,
    getData: getTransferMode,
    error: transferModeError,
  } = useGetRequest();

  useEffect(() => {
    if (!selectedMerchant.id) return;
    getTransferMode(
      endPoints.payout.merchantTransferMode + "/" + selectedMerchant.id,
    );
  }, [selectedMerchant]);

  useEffect(() => {
    if (transferModeResponse && transferModeResponse?.data) {
      const modes = transferModeResponse?.data?.map((mode) => ({
        id: mode.transferModeCode,
        name: mode.transferModeName,
      }));
      setTransferModes(modes);
    }
    if (transferModeError) {
      setTransferModes([]);
      handleTransferModeChange("", "Select Transfer Mode");
    }
  }, [transferModeResponse, transferModeError]);

  const handleMerchantChange = (id, name) => {
    setSelectedMerchant({ id, name });
    setFormData((prev) => ({
      ...prev,
      appKey: id,
      currencyCode: "",
    }));
    setSelectedCurrency({ id: "", name: "Select Currency" });
  };

  const handleCurrencyChange = (id, name) => {
    setSelectedCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyCode: id,
    }));

    switch (id) {
      case "USD":
        setSymbol("$");
        break;
      case "UGX":
        setSymbol("USh");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      default:
        setSymbol("₹");
        break;
    }
  };

  const handleCountryChange = (id, name) => {
    setSelectedCountry({ id, name });
    setFormData((prev) => ({
      ...prev,
      countryCode: id,
    }));
  };

  const handleTransferModeChange = (id, name) => {
    setFormData((prev) => ({
      ...prev,
      transferMode: id,
    }));
    setSelectedTransferMode({ id, name });
  };

  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  useEffect(() => {
    if (response?.data?.status === "success" && !error) {
      successMsg(response.message || "Transaction created successfully");
      setFormData({
        ...addSinglePayout(),
      });
      setSelectedMerchant({ id: "", name: "Select Merchant" });
      setSelectedCurrency({ id: "", name: "Select Currency" });
      setSelectedCountry({ id: "", name: "Select Country" });
      setSelectedTransferMode({ id: "", name: "Select Transfer Mode" });
    }
  }, [response, error]);

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  const handleClear = () => {
    setErrors({});
    setFormData({
      ...addSinglePayout(),
      transferType: "single",
      transferMode: "NEFT",
      returnUrl: "https://google.com",
      orderId: "",
      countryCode: "IND",
    });
    setSelectedMerchant({ id: "", name: "Select Merchant" });
    setSelectedCurrency({ id: "", name: "Select Currency" });
    setSelectedCountry({ id: "", name: "Select Country" });
    setSelectedTransferMode({ id: "", name: "Select Transfer Mode" });
  };

  return (
    <>
      <div className={styles.row}>
        {isAdmin && (
          <div className={styles.field}>
            <Label htmlFor="merchant" label="Merchant" required={true} />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={selectedMerchant}
              options={merchantResponse?.data?.data || []}
              onChange={handleMerchantChange}
              id="userId"
              value="fullName"
            />
            {renderError("merchantId")}
          </div>
        )}
        <div className={styles.field}>
          <Label htmlFor="currency" label="Currency" required={true} />
          <Dropdown
            initialLabel="Select Currency"
            selectedValue={selectedCurrency}
            options={currencyTypes ?? []}
            onChange={handleCurrencyChange}
            id="id"
            value="name"
            disabled={!selectedMerchant.id || currencyTypes?.length === 0}
          />
          {renderError("currencyCode")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="country" label="Country" required={true} />
          <Dropdown
            initialLabel="Select Country"
            selectedValue={selectedCountry}
            options={countryTypes ?? []}
            onChange={handleCountryChange}
            id="id"
            value="name"
          />
          {renderError("countryCode")}
        </div>
        <div className={styles.field}>
          <Label htmlFor="transferMode" label="Transfer Mode" required={true} />
          <Dropdown
            initialLabel="Select Transfer Mode"
            selectedValue={selectedTransferMode}
            options={transferModes ?? []}
            onChange={handleTransferModeChange}
            id="id"
            value="name"
          />
          {renderError("transferMode")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="orderId" label="Order ID" required={true} />
          <input
            type="text"
            name="orderId"
            id="orderId"
            placeholder="Enter Order ID"
            className="forminput"
            value={formData.orderId}
            onChange={handleChange}
            autoComplete="off"
          />
          {renderError("orderId")}
        </div>
        <div className={styles.field}>
          <Label htmlFor="amount" label="Amount" required={true} />
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Enter Amount"
            className="forminput"
            value={formData.amount}
            onChange={handleChange}
            autoComplete="off"
          />
          {renderError("amount")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label
            htmlFor="contactNumber"
            label="Contact Number"
            required={true}
          />
          <input
            type="text"
            name="contactNumber"
            id="contactNumber"
            placeholder="Enter Contact Number"
            className="forminput"
            value={formData.contactNumber}
            onChange={handleChange}
            autoComplete="off"
          />
          {renderError("contactNumber")}
        </div>
        <div className={styles.field}>
          <Label htmlFor="email" label="Email" required={true} />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="forminput"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
          {renderError("email")}
        </div>
      </div>

      {formData.transferMode !== "MOM" && (
        <BeneficiaryDetails
          formData={formData}
          onFormDataChange={handleFormDataChange}
          selectedMerchant={selectedMerchant}
          selectedCurrency={selectedCurrency}
          currencies={currencyResponse?.data || []}
          errors={errors}
          response={response}
          error={error}
          loading={loading}
        />
      )}

      <div className={styles.row}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <Label htmlFor="remark" label="Remarks" />
          <textarea
            name="remark"
            id="remark"
            placeholder="Enter remarks"
            className={styles.remarkArea}
            value={formData.remark}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          Back
        </button>
        <div className={styles.actionsRight}>
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
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
