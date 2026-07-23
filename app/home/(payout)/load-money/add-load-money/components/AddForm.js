"use client";
import { addLoadMoney, addLoadMoneyBuilder } from "@/app/formBuilder/payout";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddLoadMoneyFormValidation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AddForm.module.css";

const AddForm = ({ isAdmin }) => {
  const router = useRouter();
  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Currency selection state
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
  });
  // Get merchants API
  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);

  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Get merchant currencies API
  const { getData: getCurrency, response: currencyResponse } = useGetRequest();

  const handleMerchantChange = async (id, name) => {
    setSelectedMerchant({ id, name });
    setFormData((prev) => ({
      ...prev,
      userId: id,
    }));
    setSelectedCurrency({ id: "", name: "Select Currency" });
    await getCurrency(endPoints.users.mappedCurrency + id);
  };
  const handleCurrencyChange = async (id, name) => {
    setFormData((prev) => ({
      ...prev,
      currencyId: id,
    }));
    setSelectedCurrency({ id, name });
  };

  // Handle form event
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.addLoadMoney,
  );
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState(addLoadMoney);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const applySelectedFile = (file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) return;

    setFormData((prev) => ({
      ...prev,
      receipt: file,
    }));
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedFile = () => {
    setFormData((prev) => ({
      ...prev,
      receipt: null,
    }));
    setFileName("");
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      applySelectedFile(e.target.files?.[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    applySelectedFile(e.dataTransfer.files?.[0]);
  };

  // State to handle errors on form submission
  const formRef = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await validate(formData, isAdmin);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const buildformData = addLoadMoneyBuilder(formData);
    await postData(buildformData, true);
  };
  useEffect(() => {
    if (response && !error) {
      if (response.status === 200) {
        setFormData(addLoadMoney);
        setSelectedMerchant({ id: "", name: "Select Merchant" });
        setSelectedCurrency({ id: "", name: "Select Currency" });
        setFilePreview(null);
        setFileName("");
        successMsg(response.data.message);
        formRef.current.reset();
        setErrors({});
      }
    }
  }, [error, response]);

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
          <p className={styles.eyebrow}>Load Money</p>
          <h2 className={styles.title}>Add Load Money</h2>
          <p className={styles.subtitle}>
            Credit a merchant wallet with amount and receipt details
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.row}>
            {isAdmin && (
              <div className={styles.field}>
                <Label htmlFor="merchant" label="Merchant" required={true} />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={selectedMerchant}
                  options={merchantResponse?.data?.data || []}
                  onChange={handleMerchantChange}
                  id="userId"
                  value="fullName"
                />
                {renderError("merchantId")}
              </div>
            )}
            <div className={styles.field}>
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={selectedCurrency}
                options={currencyResponse?.data || []}
                onChange={handleCurrencyChange}
                id="currencyId"
                value="currencyName"
              />
              {renderError("currencyCode")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="amount" label="Amount" required={true} />
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
              {renderError("amount")}
            </div>
            <div className={styles.field}>
              <Label htmlFor="receiptId" label="Receipt ID" required={true} />
              <input
                type="text"
                name="receiptId"
                id="receiptId"
                placeholder="Enter Receipt ID"
                className="forminput"
                onChange={handleChange}
                value={formData.receiptId}
                autoComplete="off"
              />
              {renderError("receiptId")}
            </div>

            <div className={`${styles.field} ${styles.fieldGrow}`}>
              <Label htmlFor="receipt" label="Upload Receipt" />
              <div
                className={`${styles.uploadZone} ${
                  isDragging ? styles.uploadZoneDragging : ""
                } ${fileName ? styles.uploadZoneHasFile : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="receipt"
                  id="receipt"
                  className={styles.uploadInput}
                  onChange={handleChange}
                  accept="image/*"
                />
                <span className={styles.uploadIcon}>
                  <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                </span>
                <p className={styles.uploadTitle}>
                  {fileName ? "Receipt selected" : "Drop receipt image here"}
                </p>
                <p className={styles.uploadHint}>
                  PNG, JPG up to 5MB · or click to browse
                </p>
                {!fileName && (
                  <span className={styles.uploadBtn}>
                    <i className="bi bi-folder2-open" aria-hidden="true" />
                    Choose File
                  </span>
                )}
                {fileName && (
                  <div
                    className={styles.fileMeta}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className={styles.fileName} title={fileName}>
                      <i
                        className="bi bi-file-earmark-image"
                        aria-hidden="true"
                      />{" "}
                      {fileName}
                    </p>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={clearSelectedFile}
                      title="Remove file"
                    >
                      <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
              {filePreview && (
                <div className={styles.previewBox}>
                  <img
                    src={filePreview}
                    alt="Receipt Preview"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
            <div className={`${styles.field} ${styles.fieldGrow}`}>
              <Label htmlFor="remark" label="Remark" />
              <textarea
                name="remark"
                id="remark"
                placeholder="Enter remarks"
                className={styles.remarkArea}
                value={formData.remark}
                onChange={handleChange}
              ></textarea>
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
                type="reset"
                className={styles.clearBtn}
                onClick={() => {
                  setErrors({});
                  setFormData(addLoadMoney);
                  setSelectedMerchant({ id: "", name: "Select Merchant" });
                  setSelectedCurrency({ id: "", name: "Select Currency" });
                  setFilePreview(null);
                  setFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
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
