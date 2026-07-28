"use client";
import { useState } from "react";
import { payGovtTax } from "@/app/formBuilder/payout";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { useSearchParams } from "next/navigation";
import ElectricityForm from "./ElectricityForm";
import ElectricityResponse from "../model/ElectricityResponseModel";
import { validateUtility } from "@/app/validations/forms/ValidateUtility";

const AddForm = ({ isAdmin }) => {
  const type = useSearchParams().get("type");
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.electricity
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

  return (
    <>
      {responseModel && (
        <ElectricityResponse
          response={response?.data?.data}
          selectedTransferModeRef={selectedTransferModeRef}
          selectedMerchant={selectedMerchantAppKey}
          type={type}
          onClose={() => setResponseModel(!responseModel)}
        />
      )}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <ElectricityForm
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
