import { updateSurchargeValue } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/UpdateSurchargeValueFormValidatios";
import React, { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";

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
    endPoints.surcharge.updateSurchargeValue,
  );
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() =>
    updateSurchargeValue(merchant.id, paymentType.id, currentValue),
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
    <div className={`${styles.modal} overlay`}>
      <h6 className={styles.modalTitle}>Update Other Charges</h6>
      <div className={styles.merchantMeta}>
        <span className={styles.merchantMetaLabel}>Merchant</span>
        <span className={styles.merchantMetaValue}>{merchant.name}</span>
        <span className={styles.merchantMetaLabel}>ID</span>
        <span className={styles.merchantMetaValue}>{merchant.id}</span>
      </div>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-2">
            <Label htmlFor="bankCharge" label="Bank Charge" />
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
              <small className="text-danger">*{errors.bankCharge}</small>
            )}
          </div>

          {formData && (
            <div className="col-12 mb-2">
              <Label htmlFor="onOffUs" label="Status" />
              <span className="d-flex gap-5">
                {formData.onOffUs === true && (
                  <span className="d-flex gap-2 align-items-center">
                    <input
                      type="radio"
                      name="onOffUs"
                      id="onus"
                      value={true}
                      defaultChecked={formData.onOffUs === true}
                      onChange={handleChange}
                    />
                    <Label htmlFor="onus" label="On Us" />
                  </span>
                )}
                {formData.onOffUs === false && (
                  <span className="d-flex gap-2 align-items-center">
                    <input
                      type="radio"
                      name="onOffUs"
                      id="offus"
                      value={false}
                      defaultChecked={formData.onOffUs === false}
                      onChange={handleChange}
                    />
                    <Label htmlFor="offus" label="Off Us" />
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="d-flex mt-2">
          <button
            type={loading ? "button" : "submit"}
            className={styles.submitBtn}
            form="add"
            disabled={loading}
          >
            {loading ? "Processing..." : "Update"}
          </button>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClick}
          >
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
        document.getElementById("backdrop"),
      )}
      {createPortal(
        <Overlay
          merchant={merchant}
          paymentType={paymentType}
          currentValue={currentValue}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay"),
      )}
    </Fragment>
  );
};

export default UpdateSurchargeValue;
