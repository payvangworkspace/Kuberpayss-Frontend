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

const AddForm = () => {
  const router = useRouter();
  const { postData, error, response, loading } = usePostRequest(
    endPoints.remittance.remittance
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
        keyword.currencyId
      )
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
    

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
      <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="merchant" label="Merchant Name" required={true} />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={merchant}
              options={merchantResponse?.data?.data || []}
              onChange={handleMerchantChange}
              id="userId"
              value="fullName"
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
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
            {errors.currency && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.currency}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="bankName" label="Bank Name" required={true} />
            <input
              type="text"
              name="bankName"
              id="bankName"
              className="forminput"
              onChange={handleChange}
              value={formData.bankName}
              autoComplete="off"
            />
            {errors.bankName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.bankName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="transactionDate" label="Transaction Date" required={true} />
            <input
              type="date"
              name="transactionDate"
              id="transactionDate"
              className="forminput"
              value={formData.transactionDate}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="accountHolderName" label="Account Holder Name" required={true} />
            <input
              type="text"
              name="accountHolderName"
              id="accountHolderName"
              className="forminput"
              onChange={handleChange}
              value={formData.accountHolderName}
              autoComplete="off"
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="remittableAmount" label="Remittable Amount" required={true} />
            <input
              type="number"
              name="remittableAmount"
              id="remittableAmount"
              className="forminput"
              value={formData.remittableAmount}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="accountNumber" label="Account Number" required={true} />
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              className="forminput"
              onChange={handleChange}
              value={formData.accountNumber}
              autoComplete="off"
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="remittedAmount" label="Remitted Amount" required={true} />
            <input
              type="number"
              name="remittedAmount"
              id="remittedAmount"
              className="forminput"
              value={formData.remittedAmount}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="ifscCode" label="IFSC Code" />
            <input
              type="text"
              name="ifscCode"
              id="ifscCode"
              className="forminput"
              onChange={handleChange}
              value={formData.ifscCode}
              autoComplete="off"
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="utr" label="UTR" required={true} />
            <input
              type="text"
              name="utr"
              id="utr"
              className="forminput"
              value={formData.utr}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="remittanceDate" label="Remittance Date" required={true} />
            <input
              type="date"
              name="remittanceDate"
              id="remittanceDate"
              className="forminput"
              value={formData.transactionDate}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mb-2">
          <button type={loading ? "button" : "submit"} className="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
