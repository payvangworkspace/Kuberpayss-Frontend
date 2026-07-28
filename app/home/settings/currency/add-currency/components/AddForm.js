"use client";
import { addCurrency } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddCurrencyValidation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const AddForm = () => {
  const router = useRouter();

  const formRef = useRef(null);
  const { postData, loading, error, response } = usePostRequest(
    endPoints.settings.currency
  );
  const [formData, setFormData] = useState(addCurrency);
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    console.log("🚀 ~ handleSubmit ~ formData:", formData)
    console.log("🚀 ~ handleSubmit ~ validationErrors:", validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  }
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response?.data.message || "Currency added successfully");
        setFormData(addCurrency);
        formRef.current.reset();
      }
    }
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="name" label="Currency Name" required={true} />
            <input
              type="text"
              name="currencyName"
              id="name"
              placeholder="Enter currency name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.currencyName}
            />
            {errors.currencyName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.currencyName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="currencyCode"
              label="Currency Code"
              required={true}
            />
            <input
              type="text"
              name="currencyCode"
              id="currencyCode"
              placeholder="Enter currency code"
              className="forminput"
              onChange={handleChange}
              maxLength={3}
              value={formData.currencyCode}
            />
            {errors.currencyCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.currencyCode}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="currencyDecimalPlace"
              label="Currency Decimal Place"
            />
            <input
              type="text"
              name="currencyDecimalPlace"
              id="currencyDecimalPlace"
              placeholder="Enter currency number"
              className="forminput"
              inputMode="numeric"
              maxLength={5}
              onChange={handleChange}
              value={formData.currencyDecimalPlace}
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="symbol" label="Symbol" required={true} />
            <input
              type="text"
              name="symbol"
              id="symbol"
              placeholder="Enter symbol"
              className="forminput"
              onChange={handleChange}
              value={formData.symbol}
            />
            {errors.symbol && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.symbol}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
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
                setFormData(addCurrency);
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
