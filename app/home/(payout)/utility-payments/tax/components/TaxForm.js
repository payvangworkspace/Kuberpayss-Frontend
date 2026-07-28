"use client";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { payGovtTax } from "@/app/formBuilder/payout";

export default function TaxForm({
  formData,
  handleChange,
  setFormData,
  response,
  loading,
  error,
  errors,
  setErrors,
  isAdmin,
  setSelectedMerchantAppKey,
}) {
  const router = useRouter();

  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Get merchants API
  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);

  // Load merchants on component mount
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Handle merchant selection
  const handleMerchantChange = (id, name) => {
    setSelectedMerchant({ id, name });
    setSelectedMerchantAppKey({ id });
    setFormData((prev) => ({
      ...prev,
      appKey: id,
    }));
  };

  // Handle successful submission
  useEffect(() => {
    if (response?.data?.status === "success" && !error) {
      successMsg(response.message || "Utility payment created successfully");
      // Reset form
      setFormData({
        ...payGovtTax(),
      });
      setSelectedMerchant({ id: "", name: "Select Merchant" });
      // setSelectedTransferMode({ id: "", name: "Select Utility Type" });
    }
  }, [response, error]);
  return (
    <>
      {/* Fields for utility payments */}
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
          <Label htmlFor="account" label="Account Number" />
          <input
            type="text"
            name="account"
            id="account"
            placeholder="Enter Account Number"
            className="forminput"
            value={formData.account}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.account && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.account}
            </small>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-12 mb-2">
          <Label htmlFor="transactionRef" label="Order ID" required={true} />
          <input
            type="text"
            name="transactionRef"
            id="transactionRef"
            placeholder="Enter Order ID"
            className="forminput"
            value={formData.transactionRef}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.transactionRef && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.transactionRef}
            </small>
          )}
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
                ...payGovtTax(),
              });
              setSelectedMerchant({ id: "", name: "Select Merchant" });
            }}
          >
            Clear
          </button>
        </span>
      </div>
    </>
  );
}
