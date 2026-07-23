"use client";
import { addSurcharge } from "@/app/formBuilder/settings";
import useGetRequest from "@/app/hooks/useFetch";
import useMerchant from "@/app/hooks/useMerchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddSurchargeFormValidations";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AddForm.module.css";

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [formData, setFormData] = useState(addSurcharge);
  const [errors, setErrors] = useState({});
  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();

  const [paymentType, setPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  const [mopType, setMopTypes] = useState({
    id: "",
    name: "Select Mop Type",
  });
  const { getData: getAllPaymentType, response: allPaymentType } =
    useGetRequest();
  const { getData: getAllMopType, response: allMopType } = useGetRequest();

  useEffect(() => {
    if (selectedMerchant.id) {
      getAllPaymentType(
        endPoints.settings.merchantPaymentType + "/" + selectedMerchant.id,
      );
    }
  }, [selectedMerchant]);

  useEffect(() => {
    if (paymentType.id) {
      getAllMopType(
        endPoints.settings.merchantMopType +
          "/" +
          selectedMerchant.id +
          "/" +
          paymentType.id,
      );
    }
  }, [paymentType]);

  const handlePaymentTypeChange = (id, name) => {
    setPaymentType({ id, name });
    setFormData((prev) => ({
      ...prev,
      paymentType: { ...prev.paymentType, paymentTypeId: id },
    }));
  };

  const handleMopTypeChange = (id, name) => {
    setMopTypes({ id, name });
    setFormData((prev) => ({
      ...prev,
      mopType: { ...prev.mopType, mopTypeId: id },
    }));
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
    setErrors({});
  };

  const { postData, response, error, loading } = usePostRequest(
    endPoints.surcharge.addSurcharge,
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  }

  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.message || "Data added successfully");
        setMopTypes({ id: "", name: "Select Mop Type" });
        setPaymentType({ id: "", name: "Select Payment Type" });
        setFormData(addSurcharge);
        setErrors({});
        formRef.current?.reset();
      }
    }
  }, [response, error]);

  const handleMerchantSelect = (id, name) => {
    handleMerchantChange(id, name);
    setFormData((prev) => ({
      ...prev,
      userName: id,
    }));
  };

  const handleClear = () => {
    setMopTypes({ id: "", name: "Select Mop Type" });
    setPaymentType({ id: "", name: "Select Payment Type" });
    setFormData(addSurcharge);
    setErrors({});
    formRef.current?.reset();
  };

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settings</p>
          <h1 className={styles.title}>Add Surcharge</h1>
          <p className={styles.subtitle}>
            Configure surcharge and charge values for a merchant
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.row}>
            <div className={styles.field}>
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={selectedMerchant}
                options={merchantList?.data.data}
                onChange={handleMerchantSelect}
                id="userId"
                value="fullName"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="paymentType" label="Payment Type" />
              <Dropdown
                initialLabel="Select payment Type"
                selectedValue={paymentType}
                options={allPaymentType?.data}
                onChange={handlePaymentTypeChange}
                id="paymentTypeId"
                value="paymentTypeName"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="mopType" label="Mop Type" />
              <Dropdown
                initialLabel="Select Mop Type"
                selectedValue={mopType}
                options={allMopType?.data}
                onChange={handleMopTypeChange}
                id="mopTypeId"
                value="mopTypeName"
              />
            </div>

            <div className={styles.fieldFull}>
              <Label htmlFor="fixCharge" label="Charge Type" />
              <div className={styles.radioGroup}>
                <span className={styles.radioItem}>
                  <input
                    type="radio"
                    name="fixCharge"
                    id="percentage"
                    value={false}
                    onChange={handleChange}
                  />
                  <Label htmlFor="percentage" label="Percentage Charge" />
                </span>
                <span className={styles.radioItem}>
                  <input
                    type="radio"
                    name="fixCharge"
                    id="fixed"
                    value={true}
                    onChange={handleChange}
                  />
                  <Label htmlFor="fixed" label="Fixed Charge" />
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="serviceTax"
                label={`Service Tax (${
                  formData.fixCharge ? "amount" : "percentage"
                })`}
              />
              <input
                type="text"
                name="serviceTax"
                id="serviceTax"
                placeholder="Enter service tax"
                className="forminput"
                onChange={handleChange}
                value={formData.serviceTax}
                required
              />
              {errors.serviceTax && (
                <small className={styles.errorText}>
                  *{errors.serviceTax}
                </small>
              )}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="surchargeValue"
                label={`Surcharge Tax (${
                  formData.fixCharge ? "amount" : "percentage"
                })`}
              />
              <input
                type="text"
                name="surchargeValue"
                id="surchargeValue"
                placeholder="Enter surcharge value"
                className="forminput"
                onChange={handleChange}
                value={formData.surchargeValue}
                required
              />
              {errors.surchargeValue && (
                <small className={styles.errorText}>
                  *{errors.surchargeValue}
                </small>
              )}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="bankChargeValue"
                label={`Bank Charge (${
                  formData.fixCharge ? "amount" : "percentage"
                })`}
              />
              <input
                type="text"
                name="bankChargeValue"
                id="bankChargeValue"
                placeholder="Enter bank charge"
                className="forminput"
                onChange={handleChange}
                maxLength={256}
                value={formData.bankChargeValue}
                required
              />
              {errors.settlementStatus && (
                <small className={styles.errorText}>
                  *{errors.settlementStatus}
                </small>
              )}
            </div>

            <div className={styles.fieldFull}>
              <Label htmlFor="onOffUs" label="Status" />
              <div className={styles.radioGroup}>
                <span className={styles.radioItem}>
                  <input
                    type="radio"
                    name="onOffUs"
                    id="onus"
                    value={true}
                    onChange={handleChange}
                  />
                  <Label htmlFor="onus" label="On Us" />
                </span>
                <span className={styles.radioItem}>
                  <input
                    type="radio"
                    name="onOffUs"
                    id="offus"
                    value={false}
                    onChange={handleChange}
                  />
                  <Label htmlFor="offus" label="Off Us" />
                </span>
              </div>
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
            <span className={styles.actionsRight}>
              <button
                type={loading ? "button" : "submit"}
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Submit"}
              </button>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleClear}
              >
                Clear
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
