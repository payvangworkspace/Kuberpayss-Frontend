"use client";
import { addRemittance } from "@/app/formBuilder/remittance";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { validate } from "@/app/validations/forms/AddRemittancevalidation";
import styles from "./AddForm.module.css";

const AddForm = () => {
  const router = useRouter();
  const { postData, error, response, loading } = usePostRequest(
    endPoints.remittance.remittance,
  );
  // Merchant Dropdown API Call
  const [merchant, setMerchant] = useState({ id: "", name: "Select Merchant" });
  const { response: merchantResponse, postData: getAllMerchants } =
    usePostRequest(endPoints.users.merchantList);

  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  useEffect(() => {
    if (merchantResponse?.data?.data?.length) {
      setMerchant({
        id: merchantResponse.data.data[0].userId,
        name: merchantResponse.data.data[0].fullName,
      });
    }
  }, [merchantResponse]);

  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
    setFormData((prev) => ({
      ...prev,
      merchantId: id,
    }));
  };

  // Currency Dropdown API Call
  const [keyword, setKeyword] = useState({ currencyId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  const { response: currencies = [], postData: getAllCurrency } =
    usePostRequest(endPoints.settings.currencyList);

  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });

  useEffect(() => {
    getAllCurrency(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.currencyId,
      ),
    );
  }, [keyword.currencyId]);

  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currency: { ...prev.currency, currencyId: id },
    }));
  };

  // Form State
  const [formData, setFormData] = useState(addRemittance);
  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Remittance</p>
          <h2 className={styles.title}>Add Remittance</h2>
          <p className={styles.subtitle}>
            Create a new remittance with bank and payment details
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <Label
                htmlFor="merchant"
                label="Merchant Name"
                required={true}
              />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data?.data || []}
                onChange={handleMerchantChange}
                id="userId"
                value="fullName"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currency}
                options={currencies?.data?.data || []}
                onChange={handleCurrencyDropDownChange}
                id="currencyId"
                value="currencyName"
                search={true}
                onSearch={handleKeyword}
              />
              {renderError("currency")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="bankName" label="Bank Name" required={true} />
              <input
                type="text"
                name="bankName"
                id="bankName"
                className="forminput"
                placeholder="Enter bank name"
                onChange={handleChange}
                value={formData.bankName}
                autoComplete="off"
              />
              {renderError("bankName")}
            </div>
            <div className={styles.field}>
              <Label
                htmlFor="transactionDate"
                label="Transaction Date"
                required={true}
              />
              <input
                type="date"
                name="transactionDate"
                id="transactionDate"
                className="forminput"
                value={formData.transactionDate}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("transactionDate")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="accountHolderName"
                label="Account Holder Name"
                required={true}
              />
              <input
                type="text"
                name="accountHolderName"
                id="accountHolderName"
                className="forminput"
                placeholder="Enter account holder name"
                onChange={handleChange}
                value={formData.accountHolderName}
                autoComplete="off"
              />
              {renderError("accountHolderName")}
            </div>
            <div className={styles.field}>
              <Label
                htmlFor="remittableAmount"
                label="Remittable Amount"
                required={true}
              />
              <input
                type="number"
                name="remittableAmount"
                id="remittableAmount"
                className="forminput"
                placeholder="Enter remittable amount"
                value={formData.remittableAmount}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("remittableAmount")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="accountNumber"
                label="Account Number"
                required={true}
              />
              <input
                type="text"
                name="accountNumber"
                id="accountNumber"
                className="forminput"
                placeholder="Enter account number"
                onChange={handleChange}
                value={formData.accountNumber}
                autoComplete="off"
              />
              {renderError("accountNumber")}
            </div>
            <div className={styles.field}>
              <Label
                htmlFor="remittedAmount"
                label="Remitted Amount"
                required={true}
              />
              <input
                type="number"
                name="remittedAmount"
                id="remittedAmount"
                className="forminput"
                placeholder="Enter remitted amount"
                value={formData.remittedAmount}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("remittedAmount")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="ifscCode" label="IFSC Code" />
              <input
                type="text"
                name="ifscCode"
                id="ifscCode"
                className="forminput"
                placeholder="Enter IFSC code"
                onChange={handleChange}
                value={formData.ifscCode}
                autoComplete="off"
              />
              {renderError("ifscCode")}
            </div>
            <div className={styles.field}>
              <Label htmlFor="utr" label="UTR" required={true} />
              <input
                type="text"
                name="utr"
                id="utr"
                className="forminput"
                placeholder="Enter UTR"
                value={formData.utr}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("utr")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="remittanceDate"
                label="Remittance Date"
                required={true}
              />
              <input
                type="date"
                name="remittanceDate"
                id="remittanceDate"
                className="forminput"
                value={formData.remittanceDate}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("remittanceDate")}
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
                className={styles.clearBtn}
                onClick={() => {
                  setErrors({});
                  setFormData(addRemittance);
                  setCurrency({ id: "", name: "Select Currency" });
                  if (merchantResponse?.data?.data?.length) {
                    setMerchant({
                      id: merchantResponse.data.data[0].userId,
                      name: merchantResponse.data.data[0].fullName,
                    });
                  } else {
                    setMerchant({ id: "", name: "Select Merchant" });
                  }
                }}
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
