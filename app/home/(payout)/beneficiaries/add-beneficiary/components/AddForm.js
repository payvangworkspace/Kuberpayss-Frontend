"use client";
import { addBeneficiary } from "@/app/formBuilder/payout";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/addBeneficiaryFormValidations";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AddForm.module.css";

const AddForm = ({ isAdmin, isMerchant, userId }) => {
  const formRef = useRef(null);
  const paymentTypes = [
    { id: "BANK", name: "Bank Transfer" },
    { id: "UPI", name: "UPI" },
  ];
  const router = useRouter();
  const [keyword, setKeyword] = useState({ userId: "" });
  const [allMerchants, setAllMerchants] = useState([]);

  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const { postData: getAllMerchants } = usePostRequest(
    endPoints.users.merchantList,
  );

  useEffect(() => {
    const fetchAllMerchants = async () => {
      let allData = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const res = await getAllMerchants({
          start: page,
          size: 25,
        });

        const data = res?.data?.data || [];
        totalPages = res?.data?.totalPage || 1;

        allData = [...allData, ...data];
        page++;
      }

      setAllMerchants(allData);
    };

    fetchAllMerchants();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (merchant.id) {
        getCurrencyData(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      getCurrencyData(endPoints.users.mappedCurrency + userId);
    }
  }, [isAdmin, merchant.id, userId]);

  const handleChangeMerchant = async (id, name) => {
    setCurrencyType({
      id: "",
      name: "Select Currency",
    });
    setMerchant({ id, name });
    await getCurrencyData(endPoints.users.mappedCurrency + id);
    setFormData((prev) => ({
      ...prev,
      user: { ...prev.user, userId: id },
    }));
    setErrors({});
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId,
      ),
    );
  }, [keyword.userId]);

  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "Select Currency",
  });

  const handleCurrencyChange = (id, name) => {
    setCurrencyType({ id, name });
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      currency: { ...prev.currency, currencyId: id },
    }));
  };

  const handleChangePaymentType = (id, name) => {
    setErrors({});
    setFormData({
      ...formData,
      paymentType: id,
      accountNumber: "",
      bankCode: "",
      vpa: "",
    });
    setSelectedPaymentType({ id, name });
  };

  const { getData: getCurrencyData, response: currencyResponse } =
    useGetRequest();
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });

  const [formData, setFormData] = useState(addBeneficiary);
  const [errors, setErrors] = useState({});
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.beneficiary,
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validate(formData, isAdmin);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await postData(formData);
  };

  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.message || "Beneficiary added successfully");
        setFormData(addBeneficiary);
        setCurrencyType({ id: "", name: "Select Currency" });
        setSelectedPaymentType({ id: "", name: "Select Payment Type" });
        formRef.current.reset();
      }
    }
  }, [response, error]);

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  const handleClear = () => {
    setErrors({});
    setFormData(addBeneficiary);
    setMerchant({ id: "", name: "Select Merchant" });
    setCurrencyType({ id: "", name: "Select Currency" });
    setSelectedPaymentType({ id: "", name: "Select Payment Type" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Beneficiaries</p>
          <h2 className={styles.title}>Add Beneficiary</h2>
          <p className={styles.subtitle}>
            Add a payout beneficiary with bank or UPI details
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.row}>
            {isAdmin && (
              <div className={styles.field}>
                <Label htmlFor="userId" label="Merchant" required={true} />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={merchant}
                  options={allMerchants}
                  onChange={handleChangeMerchant}
                  id="userId"
                  value="fullName"
                  search={true}
                  onSearch={handleKeyword}
                />
                {renderError("merchantId")}
              </div>
            )}
            <div className={styles.field}>
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyResponse?.data || []}
                onChange={handleCurrencyChange}
                id="currencyId"
                value="currencyName"
                search={false}
              />
              {renderError("currencyCode")}
            </div>
          </div>

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
              <Label htmlFor="beneficiaryNickName" label="Nickname" />
              <input
                type="text"
                name="beneficiaryNickName"
                id="beneficiaryNickName"
                placeholder="Enter Nickname"
                className="forminput"
                value={formData.beneficiaryNickName}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <Label
                htmlFor="beneficiaryContactNumber"
                label="Contact Number"
                required={true}
              />
              <input
                type="text"
                name="beneficiaryContactNumber"
                id="beneficiaryContactNumber"
                placeholder="Enter Contact Number"
                className="forminput"
                value={formData.beneficiaryContactNumber}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("beneficiaryContactNumber")}
            </div>
            <div className={styles.field}>
              <Label htmlFor="beneficiaryEmail" label="Email" required={true} />
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
              {renderError("beneficiaryEmail")}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <Label
                htmlFor="beneficiaryBankName"
                label="Beneficiary Bank Name"
                required={true}
              />
              <input
                type="text"
                name="beneficiaryBankName"
                id="beneficiaryBankName"
                placeholder="Enter Bank Name"
                className="forminput"
                value={formData.beneficiaryBankName}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("beneficiaryBankName")}
            </div>
            <div className={styles.field}>
              <Label
                htmlFor="paymentType"
                label="Payment Type"
                required={true}
              />
              <Dropdown
                initialLabel="Select Payment Type"
                selectedValue={selectedPaymentType}
                options={paymentTypes}
                onChange={handleChangePaymentType}
                id="id"
                value="name"
              />
            </div>
          </div>

          {formData.paymentType === "BANK" && (
            <div className={styles.row}>
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
                  placeholder="Enter Account Number"
                  className="forminput"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {renderError("accountNumber")}
              </div>
              <div className={styles.field}>
                <Label htmlFor="bankCode" label="IFSC Code" required={true} />
                <input
                  type="text"
                  name="bankCode"
                  id="bankCode"
                  placeholder="Enter Bank Code"
                  className="forminput"
                  value={formData.bankCode}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {renderError("bankCode")}
              </div>
            </div>
          )}

          {formData.paymentType === "UPI" && (
            <div className={styles.row}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <Label
                  htmlFor="vpa"
                  label="UPI ID / Virtual Payment Address"
                  required={true}
                />
                <input
                  type="text"
                  name="vpa"
                  id="vpa"
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  className="forminput"
                  value={formData.vpa}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {renderError("vpa")}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => router.back()}
            >
              Back
            </button>
            <div className={styles.actionsRight}>
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
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
