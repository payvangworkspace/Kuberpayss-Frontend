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

  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Currency selection state
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
  });
  const [symbol, setSymbol] = useState("₹");

  // Country selection state
  const [countryTypes, setCountryTypes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    id: "",
    name: "Select Country",
    currencyId: "",
  });

  // Get merchants API
  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);

  // Get merchant currencies API
  const {
    getData,
    response: currencyResponse,
    loading: currencyLoading,
    error: currencyError,
  } = useGetRequest();

  // Get countries API
  const {
    response: countryResponse,
    getData: getAllCountries,
    error: countryError,
  } = useGetRequest();

  // Load merchants and countries on component mount
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Fetch countries when merchant changes
  useEffect(() => {
    if (!selectedMerchant.id) return;
    getAllCountries(endPoints.mapping.country + "/" + selectedMerchant.id);
  }, [selectedMerchant]);

  // Fetch currencies when merchant changes
  useEffect(() => {
    if (!selectedMerchant.id) return;
    getData(endPoints.users.mappedCurrency + selectedMerchant.id);
  }, [selectedMerchant]);

  // Handle country response
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

  // Handle currency response
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

  // transfer modes

  const [transferModes, setTransferModes] = useState([]);

  const [selectedTransferMode, setSelectedTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });

  const {
    response: transferModeResponse,
    getData: getTransferMode,
    error: transferModeError,
    loading: transferModeLoading,
  } = useGetRequest();

  // Fetch transfer modes when merchant changes
  useEffect(() => {
    if (!selectedMerchant.id) return;
    getTransferMode(
      endPoints.payout.merchantTransferMode + "/" + selectedMerchant.id
    );
  }, [selectedMerchant]);

  // Handle transfer mode response
  useEffect(() => {
    if (transferModeResponse && transferModeResponse?.data) {
      const transferModes = transferModeResponse?.data?.map((mode) => ({
        id: mode.transferModeCode,
        name: mode.transferModeName,
      }));
      setTransferModes(transferModes);
    }
    if (transferModeError) {
      setTransferModes([]);
      handleTransferModeChange("", "Select Transfer Mode");
    }
  }, [transferModeResponse, transferModeError]);

  // Handle merchant selection
  const handleMerchantChange = (id, name) => {
    setSelectedMerchant({ id, name });
    setFormData((prev) => ({
      ...prev,
      appKey: id,
      currencyCode: "",
    }));
    setSelectedCurrency({ id: "", name: "Select Currency" });
  };

  // Handle currency selection
  const handleCurrencyChange = (id, name) => {
    setSelectedCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyCode: id,
    }));

    // Set currency symbol based on currency code
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

  // Handle country selection
  const handleCountryChange = (id, name) => {
    setSelectedCountry({ id, name });
    setFormData((prev) => ({
      ...prev,
      countryCode: id,
    }));
  };

  // Handle transfer mode selection
  const handleTransferModeChange = (id, name) => {
    setFormData((prev) => ({
      ...prev,
      transferMode: id,
    }));
    setSelectedTransferMode({ id, name });
  };

  // Update form data from child components
  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Handle successful submission
  useEffect(() => {
    if (response?.data?.status === "success" && !error) {
      successMsg(response.message || "Transaction created successfully");
      // Reset form
      setFormData({
        ...addSinglePayout(),
      });
      setSelectedMerchant({ id: "", name: "Select Merchant" });
      setSelectedCurrency({ id: "", name: "Select Currency" });
      setSelectedCountry({ id: "", name: "Select Country" });
      setSelectedTransferMode({ id: "", name: "Select Transfer Mode" });
    }
  }, [response, error]);
  return (
    <>
      {/* Common fields for all transfer types */}
      <div className="row">
        {isAdmin && (
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="merchant" label="Merchant" required={true} />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={selectedMerchant}
              options={merchantResponse?.data?.data || []}
              onChange={handleMerchantChange}
              id="userId"
              value="fullName"
            />
            {errors.merchantId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.merchantId}
              </small>
            )}
          </div>
        )}
        <div className="col-md-6 col-sm-12 mb-2">
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
          {errors.currencyCode && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.currencyCode}
            </small>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-2">
          <Label htmlFor="country" label="Country" required={true} />
          <Dropdown
            initialLabel="Select Country"
            selectedValue={selectedCountry}
            options={countryTypes ?? []}
            onChange={handleCountryChange}
            id="id"
            value="name"
          />
          {errors.countryCode && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.countryCode}
            </small>
          )}
        </div>
        <div className="col-md-6 col-sm-12 mb-2">
          <Label htmlFor="transferMode" label="Transfer Mode" required={true} />
          <Dropdown
            initialLabel="Select Transfer Mode"
            selectedValue={selectedTransferMode}
            options={transferModes ?? []}
            onChange={handleTransferModeChange}
            id="id"
            value="name"
          />

          {errors.transferMode && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.transferMode}
            </small>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-2">
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
          {errors.orderId && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.orderId}
            </small>
          )}
        </div>
        <div className="col-md-6 col-sm-12 mb-2">
          <Label htmlFor="amount" label="Amount" required={true} />
          <div className="input-group">
            {/* <span className="input-group-text">{symbol}</span> */}
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
          </div>
          {errors.amount && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.amount}
            </small>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-2">
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
          {errors.contactNumber && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.contactNumber}
            </small>
          )}
        </div>
        <div className="col-md-6 col-sm-12 mb-2">
          <Label htmlFor="email" label="Email" required={true} />
          <div className="input-group">
            {/* <span className="input-group-text">{symbol}</span> */}
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
          </div>
          {errors.email && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.email}
            </small>
          )}
        </div>
      </div>

      {/* Render SingleTransfer or BulkTransfer based on selection */}
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

      <div className="row">
        <div className="col-12 mb-2">
          <Label htmlFor="remark" label="Remarks" />
          <textarea
            name="remark"
            id="remark"
            placeholder="Enter remarks"
            className="forminput"
            rows="4"
            value={formData.remark}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mb-2">
        <button type="button" className="back" onClick={() => router.back()}>
          Back
        </button>
        <span className="d-flex gap-2">
          <button
            type={loading ? "button" : "submit"}
            className="submit"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Submit"}
          </button>
          <button
            type="reset"
            className="reset"
            onClick={() => {
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
            }}
          >
            Clear
          </button>
        </span>
      </div>
    </>
  );
}
