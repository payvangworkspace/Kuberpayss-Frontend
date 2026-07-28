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
  // fetch all merchants
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const { response: merchantResponse = [], postData: getAllMerchants } =
    usePostRequest(endPoints.users.merchantList);

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
        keyword.userId
      )
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
  // API for getting currencies based on merchant
  const { getData: getCurrencyData, response: currencyResponse } =
    useGetRequest();
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  // hanlde form
  const [formData, setFormData] = useState(addBeneficiary);
  const [errors, setErrors] = useState({});
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.beneficiary
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
        formRef.current.reset();
      }
    }
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          {isAdmin && (
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="userId" label="Merchant" required={true} />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                // options={merchantResponse?.data?.data || []}
                options={allMerchants}
                onChange={handleChangeMerchant}
                id="userId"
                value="fullName"
                search={true}
                onSearch={handleKeyword}
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
            {errors.currencyCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.currencyCode}
              </small>
            )}
          </div>
        </div>
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
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
            {errors.beneficiaryContactNumber && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryContactNumber}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
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
            {errors.beneficiaryEmail && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryEmail}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
            {errors.beneficiaryBankName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryBankName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="paymentType" label="Payment Type" required={true} />
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

        {/* Conditionally render fields based on payment type */}
        {formData.paymentType === "BANK" && (
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
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
              {errors.accountNumber && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.accountNumber}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
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
              {errors.bankCode && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.bankCode}
                </small>
              )}
            </div>
          </div>
        )}

        {formData.paymentType === "UPI" && (
          <div className="row">
            <div className="col-md-12 col-sm-12 mb-2">
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
              {errors.vpa && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.vpa}
                </small>
              )}
            </div>
          </div>
        )}
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
                setFormData(addBeneficiary);
                setMerchant({ id: "", name: "Select Merchant" });
                setCurrencyType({ id: "", name: "Select Currency" });
              }}
            >
              Clear
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
