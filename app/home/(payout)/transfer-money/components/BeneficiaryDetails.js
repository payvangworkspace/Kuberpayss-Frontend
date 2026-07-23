"use client";
import { useEffect, useState } from "react";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import styles from "./AddForm.module.css";

const BeneficiaryDetails = ({
  formData,
  onFormDataChange,
  selectedMerchant,
  selectedCurrency,
  currencies,
  errors,
  response,
}) => {
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({
    id: "",
    name: "Select Beneficiary",
  });

  const { response: beneficiaryResponse, postData: getBeneficiaries } =
    usePostRequest(endPoints.payout.getBeneficiary);

  useEffect(() => {
    if (!selectedMerchant.id || !selectedCurrency.id) return;

    getBeneficiaries({
      userName: selectedMerchant.id,
      currencyCode: currencies.find(
        (currency) => currency.currencyCode === selectedCurrency.id,
      )?.currencyId,
    });
  }, [selectedMerchant, selectedCurrency, currencies]);

  useEffect(() => {
    if (beneficiaryResponse) {
      const data = beneficiaryResponse?.data?.data || [];
      const beneficiaries = data.map((item) => ({
        id: item.beneficiaryId,
        name: item.beneficiaryName,
      }));

      const beneficiariesWithOther = [
        ...beneficiaries,
        { id: "other", name: "Other" },
      ];

      setBeneficiaryList(beneficiariesWithOther);
    }
  }, [beneficiaryResponse]);

  const handlePaymentModeChange = (mode) => {
    onFormDataChange({
      paymentMode: mode,
      beneficiaryAccount: mode === "vpa" ? "" : formData.beneficiaryAccount,
      beneficiaryIFSCCode: mode === "vpa" ? "" : formData.beneficiaryIFSCCode,
      vpaAddress: mode === "bank" ? "" : formData.vpaAddress,
    });
  };

  const handleBeneficiaryChange = (id, name) => {
    setSelectedBeneficiary({ id, name });

    if (id === "other") {
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

  const handleChange = (e) => {
    onFormDataChange({
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (response) {
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

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  return (
    <>
      <div className={styles.row}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
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
          {renderError("beneficiaryAccount")}
        </div>
      </div>

      {selectedBeneficiary.id && selectedBeneficiary.id !== "other" && (
        <div className={styles.detailCard}>
          <h5 className={styles.detailHeader}>Beneficiary Details</h5>
          <div className={styles.detailBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>
                  {formData.beneficiaryName || "—"}
                </span>
              </div>
              {formData.paymentMode === "bank" ? (
                <>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Account No.</span>
                    <span className={styles.detailValue}>
                      {formData.beneficiaryAccount || "—"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>IFSC Code</span>
                    <span className={styles.detailValue}>
                      {formData.beneficiaryIFSCCode || "—"}
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>VPA / UPI ID</span>
                  <span className={styles.detailValue}>
                    {formData.vpaAddress || "—"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedBeneficiary.id === "other" && (
        <div className={styles.detailCard}>
          <h5 className={styles.detailHeader}>Beneficiary Details</h5>
          <div className={styles.detailBody}>
            <div className={styles.row}>
              <div className={styles.field}>
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
                {renderError("beneficiaryName")}
              </div>
              <div className={styles.field}>
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
              <div className={styles.field}>
                <Label htmlFor="beneficiaryEmail" label="Beneficiary Email" />
                <input
                  type="email"
                  name="beneficiaryEmail"
                  id="beneficiaryEmail"
                  placeholder="Enter Email"
                  className="forminput"
                  value={formData.beneficiaryEmail}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label label="Payment Mode" required={true} />
                <div className={styles.radioGroup}>
                  <label
                    className={`${styles.radioOption} ${
                      formData.paymentMode === "bank"
                        ? styles.radioOptionActive
                        : ""
                    }`}
                    htmlFor="bankTransfer"
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      id="bankTransfer"
                      value="bank"
                      checked={formData.paymentMode === "bank"}
                      onChange={() => handlePaymentModeChange("bank")}
                    />
                    <span>Bank Transfer</span>
                  </label>
                  <label
                    className={`${styles.radioOption} ${
                      formData.paymentMode === "vpa"
                        ? styles.radioOptionActive
                        : ""
                    }`}
                    htmlFor="vpaTransfer"
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      id="vpaTransfer"
                      value="vpa"
                      checked={formData.paymentMode === "vpa"}
                      onChange={() => handlePaymentModeChange("vpa")}
                    />
                    <span>UPI / VPA</span>
                  </label>
                </div>
              </div>

              {formData.paymentMode === "bank" ? (
                <>
                  <div className={styles.field}>
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
                    {renderError("beneficiaryAccount")}
                  </div>
                  <div className={styles.field}>
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
                    {renderError("beneficiaryIFSCCode")}
                  </div>
                </>
              ) : (
                <div className={`${styles.field} ${styles.fieldFull}`}>
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
                  {renderError("vpaAddress")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeneficiaryDetails;
