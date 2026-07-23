import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import {
  merchantTdrMapping,
  minimumAccount,
  priority,
} from "@/app/formBuilder/mapping";
import { validate } from "@/app/validations/forms/TdrSetupFormValidation";
import { successMsg } from "@/app/services/notify";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import useGetRequest from "@/app/hooks/useFetch";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import { queryStringWithKeyword } from "@/app/services/queryString";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  const bankChargeRef = useRef(null);
  const merchantChargeRef = useRef(null);
  // form json state data
  const [formData, setFormData] = useState(() => merchantTdrMapping(id));
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handling search keyword
  const [keyword, setKeyword] = useState({ acquirerId: "", countryId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  // Logics to get all the fields required for the form like acquirer,payment type and mop type
  const { response: acquirers = [], postData: getAllAcquirer } = usePostRequest(
    endPoints.users.acquirerList
  );
  const [acquirer, setAcquirer] = useState({ id: "", name: "Select Acquirer" });
  useEffect(() => {
    getAllAcquirer(queryStringWithKeyword(0, 25, keyword.acquirerId));
  }, [keyword.acquirerId]);

  // logic to fetch all payment type and mop Type of acquirer
  const { response: paymentTypes = [], getData: getAllPaymentTypes } =
    useGetRequest();
  const [paymentType, setPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  // Post API to get priority value
  const { postData: getPriority, response: priorityResponse } = usePostRequest(
    endPoints.mapping.priority
  );

  const handlePaymentTypeOfAcquirer = async (acquirerId, name) => {
    setAcquirer({ id: acquirerId, name });
    setFormData({ ...formData, ["acquirerId"]: acquirerId });
    await getPriority(priority(id, acquirerId));
    getAllPaymentTypes(endPoints.mapping.all + "/" + acquirerId);
  };
  // Setting Priority value
  useEffect(() => {
    setFormData({ ...formData, ["priority"]: priorityResponse?.data.data });
  }, [priorityResponse]);

  const [mopType, setMopType] = useState({ id: "", name: "Select Mop Type" });
  const [mopTypes, setMopTypes] = useState([]);
  const handleMopTypeOfPaymentType = (id, name, index) => {
    setMopType({ id: "", name: "Select Mop Type" });
    setPaymentType({ id, name });
    setMopTypes(paymentTypes?.data[index]?.mopTypeDetails);
    setFormData({ ...formData, ["paymentTypeId"]: id });
  };

  // Podt API to get minimum amount
  const { postData: getMinimumAmount, response: minAmountResponse } =
    usePostRequest(endPoints.mapping.minimumAmt);
  const handleSelectedMopType = async (mopTypeId, name) => {
    setFormData({ ...formData, ["mopTypeId"]: mopTypeId });
    setMopType({ id, name });
    await getMinimumAmount(
      minimumAccount(
        id,
        formData.acquirerId,
        formData.paymentTypeId,
        mopTypeId,
        formData.priority
      )
    );
  };
  useEffect(() => {
    setFormData({
      ...formData,
      ["minimumAmountLimit"]: minAmountResponse?.data.data,
    });
  }, [minAmountResponse]);
  const { postData, error, response } = usePostRequest(
    endPoints.mapping.merchantTdr
  );

  // handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        setFormData(() => merchantTdrMapping(id));
        setAcquirer({ id: "", name: "Select Acquirer" });
        setMopType({ id: "", name: "Select Mop Type" });
        setPaymentType({ id: "", name: "Select Payment Type" });
        successMsg(response.data.message);
        onSuccess();
        onClick();
      }
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>Add TDR Setting</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="acquireId" label="Acquirer" required={true} />
            <Dropdown
              initialLabel="Select Acquirer"
              selectedValue={acquirer}
              options={acquirers?.data.data}
              onChange={handlePaymentTypeOfAcquirer}
              id="acquirerId"
              search={true}
              onSearch={handleKeyword}
              value="fullName"
            />
            {errors.acquirerId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerId}
              </small>
            )}
          </div>
          {formData.acquirerId !== "" && (
            <>
              <div className="col-12 mb-2">
                <Label htmlFor="priority" label="Priority" required={true} />
                <input
                  type="text"
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  className="forminput"
                  readOnly
                  disabled
                  autoComplete="on"
                />
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="paymenttype"
                  label="Payment Type"
                  required={true}
                />
                <Dropdown
                  initialLabel="Select Payment Type"
                  selectedValue={paymentType}
                  options={paymentTypes?.data}
                  onChange={handleMopTypeOfPaymentType}
                  id="paymentTypeId"
                  value="paymentTypeName"
                />
                {errors.paymentTypeId && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.paymentTypeId}
                  </small>
                )}
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="bankaccountnumber"
                  label="Select Mop Type"
                  required={true}
                />
                <Dropdown
                  initialLabel="Select Mop Type"
                  selectedValue={mopType}
                  options={mopTypes}
                  onChange={handleSelectedMopType}
                  id="mopTypeId"
                  value="mopTypeName"
                />
                {errors.mopTypeId && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.mopTypeId}
                  </small>
                )}
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="gstvat"
                  label="GST/VAT in percentage"
                  required={true}
                />
                <input
                  type="number"
                  name="gstVat"
                  id="gstvat"
                  placeholder="Enter GST/VAT in percentage"
                  className="forminput"
                  required
                  autoComplete="on"
                  onChange={handleChange}
                />
                {errors.cardNumber && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.cardNumber}
                  </small>
                )}
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="isfixedcharge"
                  label="Fixed Charge"
                  required={true}
                />
                <br />
                <div className="d-flex gap-5">
                  <span className="d-flex align-items-center gap-2">
                    <Label htmlFor="isfixedcharge" label="Yes" />
                    <input
                      type="radio"
                      name="isFixCharge"
                      id="dynamiccharges"
                      value={true}
                      onChange={handleChange}
                    />
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <Label htmlFor="isfixedcharge" label="No" />
                    <input
                      type="radio"
                      name="isFixCharge"
                      id="staticcharges"
                      value={false}
                      onChange={handleChange}
                    />
                  </span>
                </div>
                {errors.isFixedCharge && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.isFixedCharge}
                  </small>
                )}
              </div>
            </>
          )}

          {formData.isFixCharge !== "" && (
            <>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="merchantCharge"
                  label="Merchant Charges"
                  required={true}
                />
                <input
                  type="text"
                  name="merchantCharge"
                  id="merchantCharge"
                  placeholder="Enter Merchant charge"
                  className="forminput"
                  required
                  ref={merchantChargeRef}
                  value={formData.merchantCharge}
                  onChange={handleChange}
                />

                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter merchant charge amount"
                      : "Enter merchant charge percentage"
                  }
                />

                {errors.cardNumber && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.cardNumber}
                  </small>
                )}
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="bankcharge"
                  label="Bank Charges"
                  required={true}
                />
                <input
                  type="text"
                  name="bankCharge"
                  id="bankcharge"
                  placeholder="Enter bank charge"
                  className="forminput"
                  required
                  ref={bankChargeRef}
                  onChange={handleChange}
                />
                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter bank charge amount"
                      : "Enter bank charge percentage"
                  }
                />
                {errors.vpa && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.vpa}
                  </small>
                )}
              </div>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="vpa"
                  label="Minimum Amount Limit"
                  required={true}
                />
                <input
                  type="text"
                  name="vpa"
                  id="vpa"
                  readOnly
                  disabled
                  value={formData.minimumAmountLimit}
                  className="forminput"
                  required
                  autoComplete="on"
                />
                {errors.vpa && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.vpa}
                  </small>
                )}
              </div>
              <div className="col-12 mb-4">
                <Label
                  htmlFor="maximumamountlimit"
                  label="Max Amount Limit"
                  required={true}
                />
                <input
                  type="text"
                  name="maximumAmountLimit"
                  id="maximumamountlimit"
                  placeholder="Enter max. amount limit"
                  className="forminput"
                  required
                  autoComplete="on"
                  onChange={handleChange}
                />
                {errors.vpa && (
                  <small className="text-white">
                    <span className="text-danger"> *</span>
                    {errors.vpa}
                  </small>
                )}
              </div>
            </>
          )}
        </div>
        <div className="d-flex mt-2">
          <button type="submit" form="add">
            Add
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddTdr = ({ name, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddTdr;
