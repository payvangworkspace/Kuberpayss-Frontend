"use client";
import { useState } from "react";
import { payGovtTax } from "@/app/formBuilder/payout";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import TaxForm from "./TaxForm";
import { useSearchParams } from "next/navigation";
import UtilityUraResponse from "../model/UtilityUraResponseModel";
import UtilityNssfResponse from "../model/UtilityNssfResponseModel";
import { validateUtility } from "@/app/validations/forms/ValidateUtility";

const AddForm = ({ isAdmin }) => {
  const type = useSearchParams().get("type");
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.govtTax
  );

  // Form json state data with initial values
  const [formData, setFormData] = useState({
    ...payGovtTax(),
  });
  //  state to handle the response model
  const [responseModel, setResponseModel] = useState(false);

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = await validateUtility(formData, isAdmin);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create data to send
    const dataToSend = {
      appKey: formData.appKey,
      transactionRef: formData.transactionRef,
      timeStamp: formData.timeStamp,
      account: formData.account,
      serviceProviderID: type,
    };
    await postData(dataToSend);
    setResponseModel(true);
  }

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (name === "transactionRef") {
      setSelectedTransferModeRef({ id: value });
    }
  };

  const [selectedMerchantAppKey, setSelectedMerchantAppKey] = useState([]);
  const [selectedTransferModeRef, setSelectedTransferModeRef] = useState([]);

  const renderResponseComponent = () => {
    if (!responseModel) return null;

    switch (type) {
      case "URA":
        return (
          <UtilityUraResponse
            response={response?.data?.data}
            selectedTransferModeRef={selectedTransferModeRef}
            selectedMerchant={selectedMerchantAppKey}
            onClose={() => setResponseModel(false)}
          />
        );
      case "NSSF":
        return (
          <UtilityNssfResponse
            response={response?.data?.data}
            selectedTransferModeRef={selectedTransferModeRef}
            selectedMerchant={selectedMerchantAppKey}
            onClose={() => setResponseModel(false)}
          />
        );
      default:
        return null;
    }
  };
  return (
    <>
      {renderResponseComponent()}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <TaxForm
            setSelectedMerchantAppKey={setSelectedMerchantAppKey}
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            validate={validateUtility}
            response={response}
            error={error}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
            isAdmin={isAdmin}
          />
        </form>
      </div>
    </>
  );
};

export default AddForm;
