"use client";
import { useState } from "react";
import { payWaterPayment } from "@/app/formBuilder/payout";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/TransferMoneyValidations";
import { useSearchParams } from "next/navigation";
import WaterForm from "./WaterForm";
import WaterResponse from "../model/WaterResponseModel";
import { validateWaterUtility } from "@/app/validations/forms/ValidateUtility";

const AddForm = ({ isAdmin, merchantId, merchantRole }) => {
  const type = useSearchParams().get("type");
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.water
  );

  // Form json state data with initial values
  const [formData, setFormData] = useState({
    ...payWaterPayment(),
  });
  //  state to handle the response model
  const [responseModel, setResponseModel] = useState(false);

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = await validateWaterUtility(formData, isAdmin);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create data to send
    const dataToSend = {
      appKey: formData.appKey,
      location: formData.location,
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
    if (name === "account") {
      setAccount(value);
    }
  };
  const [account, setAccount] = useState("");
  const [selectedMerchantAppKey, setSelectedMerchantAppKey] = useState([]);
  const [selectedTransferModeRef, setSelectedTransferModeRef] = useState([]);

  return (
    <>
      {responseModel && (
        <WaterResponse
          response={response?.data?.data}
          selectedMerchant={selectedMerchantAppKey}
          selectedTransferModeRef={selectedTransferModeRef}
          type={type}
          onClose={() => setResponseModel(!responseModel)}
          account={account}
        />
      )}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <WaterForm
            setSelectedMerchantAppKey={setSelectedMerchantAppKey}
            merchantRole={merchantRole}
            merchantId={merchantId}
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            validate={validate}
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
