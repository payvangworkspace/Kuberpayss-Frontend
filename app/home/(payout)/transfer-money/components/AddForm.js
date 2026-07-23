"use client";
import Label from "@/app/ui/label/Label";
import { useState } from "react";
import { addSinglePayout } from "@/app/formBuilder/payout";
import Single from "./Single";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/TransferMoneyValidations";
import styles from "./AddForm.module.css";

const AddForm = ({ isAdmin }) => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.singlePayout,
  );

  const [formData, setFormData] = useState({
    ...addSinglePayout(),
  });

  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData, isAdmin);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = {
      appKey: formData.appKey,
      amount: formData.amount,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      transferMode: formData.transferMode,
      orderId: formData.orderId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      remark: formData.remark,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryBankName: formData.beneficiaryBankName,
      beneficiaryAccount: formData.beneficiaryAccount,
      beneficiaryIFSCCode: formData.beneficiaryIFSCCode,
      vpaAddress: formData.vpaAddress,
      returnUrl: formData.returnUrl,
    };
    await postData(dataToSend);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [transferList, setTransferList] = useState([]);

  const handleBulkTransferSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await validate(formData, isAdmin);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = {
      appKey: formData.appKey,
      amount: formData.amount,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      transferMode: formData.transferMode,
      orderId: formData.orderId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      remark: formData.remark,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryAccount: formData.beneficiaryAccount,
      beneficiaryIFSCCode: formData.beneficiaryIFSCCode,
      vpaAddress: formData.vpaAddress,
      returnUrl: formData.returnUrl,
    };

    setTransferList((prevList) => [...prevList, dataToSend]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payout</p>
          <h2 className={styles.title}>Transfer Money</h2>
          <p className={styles.subtitle}>
            Create a single or bulk payout transfer with beneficiary details
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form
          className={styles.form}
          onSubmit={
            formData.transferType === "single"
              ? handleSubmit
              : handleBulkTransferSubmit
          }
        >
          <div className={styles.row}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <Label label="Transfer Type" required={true} />
              <div className={styles.radioGroup}>
                <label
                  className={`${styles.radioOption} ${
                    formData.transferType === "single"
                      ? styles.radioOptionActive
                      : ""
                  }`}
                  htmlFor="singleTransfer"
                >
                  <input
                    type="radio"
                    name="transferType"
                    id="singleTransfer"
                    value="single"
                    checked={formData.transferType === "single"}
                    onChange={handleChange}
                  />
                  <span>Single Transfer</span>
                </label>
                <label
                  className={`${styles.radioOption} ${
                    formData.transferType === "bulk"
                      ? styles.radioOptionActive
                      : ""
                  }`}
                  htmlFor="bulkTransfer"
                >
                  <input
                    type="radio"
                    name="transferType"
                    id="bulkTransfer"
                    value="bulk"
                    checked={formData.transferType === "bulk"}
                    onChange={handleChange}
                  />
                  <span>Bulk Transfer</span>
                </label>
              </div>
            </div>
          </div>

          <Single
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
    </div>
  );
};

export default AddForm;
