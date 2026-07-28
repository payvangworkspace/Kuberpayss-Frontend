import { updateSurcharge } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/UpdateSurchargeFormValidation";
import React, { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};

const Overlay = ({
  merchant,
  paymentType,
  currentValue,
  onClick,
  onSuccess,
}) => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.surcharge.updateSurcharge
  );
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() =>
    updateSurcharge(merchant.id, paymentType.id, currentValue)
  );
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message || "Data updated successfully");
      onSuccess();
      onClick();
    }
  }, [response, error]);

  return (
    <div className="overlay w-30">
      <h6>Update Surcharge Value</h6>
      <label htmlFor="username">Merchant Name:{merchant.name}</label>
      <h5 id="username">ID:{merchant.id}</h5>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-2">
            <Label htmlFor="serviceTax" label="Enter Service Tax" />
            <input
              type="text"
              name="serviceTax"
              id="serviceTax"
              placeholder="Enter service tax"
              className="forminput"
              defaultValue={currentValue.serviceTax}
              onChange={handleChange}
            />
            {errors.serviceTax && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.serviceTax}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="surchargeValue" label="Enter Surcharge Value" />
            <input
              type="text"
              name="surchargeValue"
              id="surchargeValue"
              placeholder="Enter surcharge value"
              className="forminput"
              defaultValue={currentValue.surchargeValue}
              onChange={handleChange}
            />
            {errors.surchargeValue && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.surchargeValue}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
          <button
            type={loading ? "button" : "submit"}
            form="add"
            disabled={loading}
          >
            {loading ? "processing.." : "Update"}
          </button>
          <span className="mx-2"></span>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const UpdateSurcharge = ({
  merchant,
  paymentType,
  currentValue,
  onClose,
  onSuccess,
}) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={merchant}
          paymentType={paymentType}
          currentValue={currentValue}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdateSurcharge;
