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

const AddForm = ({isAdmin}) => {
  const router = useRouter();
  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Currency selection state
  const [currencyTypes, setCurrencyTypes] = useState([]);
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
    endPoints.payout.addLoadMoney
  );
  const [filePreview, setFilePreview] = useState(null);
  const [formData, setFormData] = useState(addLoadMoney);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
        successMsg(response.data.message);
        formRef.current.reset();
        setErrors({});
      }
    }
  }, [error, response]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          {isAdmin && <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="merchant" label="Merchant" required={true} />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={selectedMerchant}
              options={merchantResponse?.data?.data || []}
              onChange={handleMerchantChange}
              id="userId"
              value="fullName"
            />
            {errors.merchantId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.merchantId}
              </small>
            )}
          </div>}
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="currency" label="Currency" required={true} />
            <Dropdown
              initialLabel="Select Currency"
              selectedValue={selectedCurrency}
              options={currencyResponse?.data || []}
              onChange={handleCurrencyChange}
              id="currencyId"
              value="currencyName"
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
            <Label htmlFor="amount" label="Amount" required={true} />
            <div className="input-group">
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
            </div>
            {errors.amount && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.amount}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
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
            {errors.receiptId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.receiptId}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="receipt" label="Upload Receipt" />
            <input
              type="file"
              name="receipt"
              id="receipt"
              className="forminput"
              onChange={handleChange}
              accept="image/*"
            />
            {filePreview && (
              <div className="mt-2">
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="remark" label="Remark" />
            <textarea
              name="remark"
              id="remark"
              placeholder="Enter remarks"
              className="forminput"
              rows="4"
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
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
                setFormData(addLoadMoney);
                setSelectedMerchant({ id: "", name: "Select Merchant" });
                setSelectedCurrency({ id: "", name: "Select Currency" });
                setFilePreview(null);
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
