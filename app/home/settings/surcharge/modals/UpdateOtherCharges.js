import { updateSurchargeValue } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/UpdateSurchargeValueFormValidatios";
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
    endPoints.surcharge.updateSurchargeValue
  );
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() =>
    updateSurchargeValue(merchant.id, paymentType.id, currentValue)
  );
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : parseInt(value),
    });
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
            <Label htmlFor="bankCharge" label="Enter Bank Charge " />
            <input
              type="text"
              name="bankCharge"
              id="bankCharge"
              placeholder="Enter bank charge"
              className="forminput"
              defaultValue={currentValue.bankCharge}
              onChange={handleChange}
            />
            {errors.bankCharge && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.bankCharge}
              </small>
            )}
          </div>

          {formData && (
            <div className="col-12 mb-2">
              <Label htmlFor="onOffUs" label=" Status" />
              <span className="d-flex gap-5">
               {formData.onOffUs === true && <span className="d-flex gap-2 align-items-center">
                  <input
                    type="radio"
                    name="onOffUs"
                    id="onus"
                    value={true}
                    defaultChecked={formData.onOffUs === true}
                    onChange={handleChange}
                  />
                  <Label htmlFor="fixChrage" label="On Us" />
                </span>}
                {formData.onOffUs === false && <span className="d-flex gap-2 align-items-center">
                  <input
                    type="radio"
                    name="onOffUs"
                    id="offus"
                    value={false}
                    defaultChecked={formData.onOffUs === false}
                    onChange={handleChange}
                  />
                  <Label htmlFor="fixChrage" label="Off Us" />
                </span>}
              </span>
            </div>
          )}
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
const UpdateSurchargeValue = ({
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

export default UpdateSurchargeValue;
