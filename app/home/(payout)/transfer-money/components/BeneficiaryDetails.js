"use client";
import { useEffect, useState } from "react";
import Label from "@/app/ui/label/Label";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";

const BeneficiaryDetails = ({
  formData,
  onFormDataChange,
  selectedMerchant,
  selectedCurrency,
  currencies,
  errors,
  response,
  loading,
  error,
}) => {
  // Beneficiary state
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({
    id: "",
    name: "Select Beneficiary",
  });

  // Get beneficiaries API
  const {
    response: beneficiaryResponse,
    postData: getBeneficiaries,
    error: beneficiaryError,
  } = usePostRequest(endPoints.payout.getBeneficiary);

  // Fetch beneficiaries when merchant or currency changes
  useEffect(() => {
    if (!selectedMerchant.id || !selectedCurrency.id) return;

    getBeneficiaries({
      userName: selectedMerchant.id,
      currencyCode: currencies.find(
        (currency) => currency.currencyCode === selectedCurrency.id,
      )?.currencyId,
    });
  }, [selectedMerchant, selectedCurrency, currencies]);

  // Handle beneficiary response
  useEffect(() => {
    if (beneficiaryResponse) {
      const data = beneficiaryResponse?.data?.data || [];
      const beneficiaries = data.map((item) => ({
        id: item.beneficiaryId,
        name: item.beneficiaryName,
      }));

      // Add "Other" option to the beginning of the beneficiary list
      const beneficiariesWithOther = [
        ...beneficiaries,
        { id: "other", name: "Other" },
      ];

      setBeneficiaryList(beneficiariesWithOther);
    }
  }, [beneficiaryResponse]);

  // Handle payment mode change
  const handlePaymentModeChange = (mode) => {
    onFormDataChange({
      paymentMode: mode,
      beneficiaryAccount: mode === "vpa" ? "" : formData.beneficiaryAccount,
      beneficiaryIFSCCode: mode === "vpa" ? "" : formData.beneficiaryIFSCCode,
      vpaAddress: mode === "bank" ? "" : formData.vpaAddress,
    });
  };

  // Handle beneficiary selection
  const handleBeneficiaryChange = (id, name) => {
    setSelectedBeneficiary({ id, name });

    if (id === "other") {
      // Reset form fields for manual entry
      onFormDataChange({
        beneficiaryId: "",
        beneficiaryName: "",
        contactNumber: "",
        email: "",
        beneficiaryAccount: "",
        beneficiaryIFSCCode: "",
        vpaAddress: "",
        paymentMode: "bank",
      });
    } else {
      const selected = beneficiaryResponse?.data?.data?.find(
        (item) => item.beneficiaryId === id,
      );
      if (!selected) return;

      const paymentMode = selected.vpa ? "vpa" : "bank";
      onFormDataChange({
        beneficiaryName: selected.beneficiaryName,
        beneficiaryBankName: selected.beneficiaryBankName,
        beneficiaryAccount:
          paymentMode === "bank" ? selected.accountNumber : "",
        beneficiaryIFSCCode: paymentMode === "bank" ? selected.bankCode : "",
        vpaAddress: paymentMode === "vpa" ? selected.vpa : "",
        paymentMode,
      });
    }
  };

  // Handle input change
  const handleChange = (e) => {
    onFormDataChange({
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  useEffect(() => {
    if (response) {
      // clear selected beneficiary and form data
      setSelectedBeneficiary({ id: "", name: "Select Beneficiary" });
      onFormDataChange({
        beneficiaryId: "",
        beneficiaryName: "",
        beneficiaryAccount: "",
        beneficiaryIFSCCode: "",
        vpaAddress: "",
      });
    }
  }, [response]);

  return (
    <div id="single-transfer-form">
      <div className="row">
        <div className="col-12 mb-2">
          <Label htmlFor="beneficiary" label="Beneficiary" required={true} />
          <Dropdown
            initialLabel="Select Beneficiary"
            selectedValue={selectedBeneficiary}
            options={beneficiaryList || []}
            onChange={handleBeneficiaryChange}
            id="id"
            value="name"
            disabled={!selectedMerchant.id}
            all={false}
          />
          {errors.beneficiaryAccount && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.beneficiaryAccount}
            </small>
          )}
        </div>
      </div>
      {/* Show beneficiary details when selected from dropdown */}
      {selectedBeneficiary.id && selectedBeneficiary.id !== "other" && (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Beneficiary Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <InfoLabel label="Name" content={"Beneficiary Name"} />
                    <span className="text-muted mx-3">
                      {formData.beneficiaryName}
                    </span>
                  </div>
                  {formData.paymentMode === "bank" ? (
                    <>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <InfoLabel label="Contact" content={"Account No. "} />
                        <span className="text-muted mx-3">
                          {formData.beneficiaryAccount}
                        </span>
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <InfoLabel label="Email" content={"IFSC Code"} />
                        <span className="text-muted mx-3">
                          {formData.beneficiaryIFSCCode}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="col-md-6 col-sm-12 mb-2">
                      <InfoLabel
                        label="Virtual Payment Address (UPI ID)"
                        content={"Virtual Payment Address (UPI ID)"}
                      />
                      <span className="text-muted mx-3">
                        {formData.vpaAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual entry fields when "Other" is selected */}
      {selectedBeneficiary.id === "other" && (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Beneficiary Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Label
                      htmlFor="beneficiaryName"
                      label="Beneficiary Name"
                      required={true}
                    />
                    <input
                      type="text"
                      name="beneficiaryName"
                      id="beneficiaryName"
                      placeholder="Enter Beneficiary Name"
                      className="forminput"
                      value={formData.beneficiaryName}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    {errors.beneficiaryName && (
                      <small className="text-danger">
                        <span className="text-danger"> *</span>
                        {errors.beneficiaryName}
                      </small>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Label
                      htmlFor="beneficiaryContact"
                      label="Beneficiary Contact"
                    />
                    <input
                      type="text"
                      name="beneficiaryContact"
                      id="beneficiaryContact"
                      placeholder="Enter Contact Number"
                      className="forminput"
                      value={formData.beneficiaryContact}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Label
                      htmlFor="beneficiaryEmail"
                      label="Beneficiary Email"
                    />
                    <input
                      type="beneficiaryEmail"
                      name="beneficiaryEmail"
                      id="beneficiaryEmail"
                      placeholder="Enter Email"
                      className="forminput"
                      value={formData.beneficiaryEmail}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2 mt-3">
                    <Label label="Payment Mode" required={true} />
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMode"
                          id="bankTransfer"
                          value="bank"
                          checked={formData.paymentMode === "bank"}
                          onChange={() => handlePaymentModeChange("bank")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="bankTransfer"
                        >
                          Bank Transfer
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMode"
                          id="vpaTransfer"
                          value="vpa"
                          checked={formData.paymentMode === "vpa"}
                          onChange={() => handlePaymentModeChange("vpa")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="vpaTransfer"
                        >
                          UPI/Virtual Payment Address
                        </label>
                      </div>
                    </div>
                  </div>
                  {formData.paymentMode === "bank" ? (
                    <>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Label
                          htmlFor="beneficiaryAccount"
                          label="Account Number"
                          required={true}
                        />
                        <input
                          type="text"
                          name="beneficiaryAccount"
                          id="beneficiaryAccount"
                          placeholder="Enter Account Number"
                          className="forminput"
                          value={formData.beneficiaryAccount}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        {errors.beneficiaryAccount && (
                          <small className="text-danger">
                            <span className="text-danger"> *</span>
                            {errors.beneficiaryAccount}
                          </small>
                        )}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Label
                          htmlFor="beneficiaryIFSCCode"
                          label="IFSC Code"
                          required={true}
                        />
                        <input
                          type="text"
                          name="beneficiaryIFSCCode"
                          id="beneficiaryIFSCCode"
                          placeholder="Enter IFSC Code"
                          className="forminput"
                          value={formData.beneficiaryIFSCCode}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        {errors.beneficiaryIFSCCode && (
                          <small className="text-danger">
                            <span className="text-danger"> *</span>
                            {errors.beneficiaryIFSCCode}
                          </small>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Label
                        htmlFor="vpaAddress"
                        label="Virtual Payment Address (UPI ID)"
                        required={true}
                      />
                      <input
                        type="text"
                        name="vpaAddress"
                        id="vpaAddress"
                        placeholder="Enter Virtual Payment Address/UPI ID"
                        className="forminput"
                        value={formData.vpaAddress}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      {errors.vpaAddress && (
                        <small className="text-danger">
                          <span className="text-danger"> *</span>
                          {errors.vpaAddress}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryDetails;
