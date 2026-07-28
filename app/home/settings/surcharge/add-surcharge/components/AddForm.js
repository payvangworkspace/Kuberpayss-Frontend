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
import { useEffect, useRef, useState } from "react";

const AddForm = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(addSurcharge);
  const [errors, setErrors] = useState({});
  // Get Merchants
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
        endPoints.settings.merchantPaymentType + "/" + selectedMerchant.id
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
          paymentType.id
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
    endPoints.surcharge.addSurcharge
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
        formRef.current.reset();
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
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-4 col-sm-12 mb-3">
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
          <div className="col-md-4 col-sm-12 mb-3">
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
          <div className="col-md-4 col-sm-12 mb-3">
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
          <div className="col-12 mb-2">
            <span className="d-flex gap-5">
              <span className="d-flex gap-2 align-items-center">
                <input
                  type="radio"
                  name="fixCharge"
                  id="yes"
                  value={false}
                  onChange={handleChange}
                />
                <Label htmlFor="fixChrage" label="Percentage Charge" />
              </span>
              <span className="d-flex gap-2 align-items-center">
                <input
                  type="radio"
                  name="fixCharge"
                  id="no"
                  value={true}
                  onChange={handleChange}
                />
                <Label htmlFor="fixChrage" label="Fixed Charge" />
              </span>
            </span>
          </div>
          <div className="col-md-4 col-sm-12 mb-2">
            <Label
              htmlFor="serviceTax"
              label={`Enter Service Tax(${
                formData.fixCharge ? "in amount" : "in percentage"
              })`}
            />
            <input
              type="text"
              name="serviceTax"
              id="serviceTax"
              placeholder="Enter Service Tax"
              className="forminput"
              onChange={handleChange}
              value={formData.serviceTax}
              required
            />
            {errors.serviceTax && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.serviceTax}
              </small>
            )}
          </div>
          <div className="col-md-4 col-sm-12 mb-2">
            <Label
              htmlFor="surchargeValue"
              label={`Enter Surcharge Tax(${
                formData.fixCharge ? "in amount" : "in percentage"
              })`}
            />
            <input
              type="text"
              name="surchargeValue"
              id="surchargeValue"
              placeholder="Enter Surcharge Value"
              className="forminput"
              onChange={handleChange}
              value={formData.surchargeValue}
              required
            />
            {errors.surchargeValue && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.surchargeValue}
              </small>
            )}
          </div>
          <div className="col-md-4 col-sm-12 mb-2">
            <Label
              htmlFor="bankChargeValue"
              label={`Enter Bank Charge(${
                formData.fixCharge ? "in amount" : "in percentage"
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
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.settlementStatus}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="onOffUs" label="Select Status" />
            <span className="d-flex gap-5">
              <span className="d-flex gap-2 align-items-center">
                <input
                  type="radio"
                  name="onOffUs"
                  id="onus"
                  value={true}
                  onChange={handleChange}
                />
                <Label htmlFor="fixChrage" label="On Us" />
              </span>
              <span className="d-flex gap-2 align-items-center">
                <input
                  type="radio"
                  name="onOffUs"
                  id="offus"
                  value={false}
                  onChange={handleChange}
                />
                <Label htmlFor="fixChrage" label="Off Us" />
              </span>
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2 mt-3 mb-2">
          <span className="d-flex gap-2">
            <button type={"submit"} className="submit" disabled={loading}>
              {loading ? "Please Wait..." : "Submit"}
            </button>
            <button type="reset" className="reset" onClick={() => {}}>
              Clear
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
