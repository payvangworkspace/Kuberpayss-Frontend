"use client";
import Label from "@/app/ui/label/Label";
import { useEffect, useRef, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { addPaymentType } from "@/app/formBuilder/settings";
import { validate } from "@/app/validations/forms/AddPaymentTypeValidations";
import { useRouter } from "next/navigation";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { successMsg } from "@/app/services/notify";

const AddForm = () => {
  const router = useRouter();

  // handling search keyword
  const [keyword, setKeyword] = useState({ currencyId: "", countryId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  const { response: countries = [], postData: getAllCountry } = usePostRequest(
    endPoints.settings.countryList
  );
  const { response: currencies = [], postData: getAllCurrency } =
    usePostRequest(endPoints.settings.currencyList);

  const [country, setCountry] = useState({ id: "", name: "Select Country" });
  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });

  useEffect(() => {
    getAllCountry(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.countryId
      )
    );
  }, [keyword.countryId]);

  useEffect(() => {
    getAllCurrency(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.currencyId
      )
    );
  }, [keyword.currencyId]);

  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.settings.paymentType
  );
  const [formData, setFormData] = useState(addPaymentType);
  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  const handleCountryDropDownChange = (id, name) => {
    setCountry({ id, name });
    setFormData((prev) => ({
      ...prev,
      country: { ...prev.country, countryId: id },
    }));
    setErrors({});
  };
  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currency: { ...prev.currency, currencyId: id },
    }));
    setErrors({});
  };
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
        successMsg(response.data.message || "Payment Type added successfully");
        setFormData(addPaymentType);
        setCountry({ id: "", name: "Select Country" });
        setCurrency({ id: "", name: "Select Currency" });
        formRef.current.reset();
      }
    }
  }, [response, error]);

  if (currencies && countries)
    return (
      <div className="wrapper">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="country" label="Country" required={true} />
              <Dropdown
                initialLabel="Select Country"
                selectedValue={country}
                options={countries.data.data}
                onChange={handleCountryDropDownChange}
                id="countryId"
                value="countryName"
                search={true}
                onSearch={handleKeyword}
              />
              {errors.country && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.country}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currency}
                options={currencies.data.data}
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
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="paymentTypeName" label="Name" required={true} />
              <input
                type="text"
                name="paymentTypeName"
                id="paymentTypeName"
                placeholder="Enter payment type name"
                className="forminput"
                onChange={handleChange}
              />
              {errors.paymentTypeName && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.paymentTypeName}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="paymentTypeCode" label="Code" required={true} />
              <input
                type="text"
                name="paymentTypeCode"
                id="paymentTypeCode"
                placeholder="Enter payment type code"
                className="forminput"
                onChange={handleChange}
              />
              {errors.paymentTypeCode && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.paymentTypeCode}
                </small>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
            <button
              type="button"
              className="back"
              onClick={() => router.back()}
            >
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
                  setFormData(addPaymentType);
                  setCountry({ id: "", name: "Select Country" });
                  setCurrency({ id: "", name: "Select Currency" });
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
