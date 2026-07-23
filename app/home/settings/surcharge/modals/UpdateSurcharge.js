import { updateSurcharge } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/UpdateSurchargeFormValidation";
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
    endPoints.surcharge.updateSurcharge,
  );
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() =>
    updateSurcharge(merchant.id, paymentType.id, currentValue),
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
    <div className={`${styles.modal} overlay`}>
      <h6 className={styles.modalTitle}>Update Surcharge Value</h6>
      <div className={styles.merchantMeta}>
        <span className={styles.merchantMetaLabel}>Merchant</span>
        <span className={styles.merchantMetaValue}>{merchant.name}</span>
        <span className={styles.merchantMetaLabel}>ID</span>
        <span className={styles.merchantMetaValue}>{merchant.id}</span>
      </div>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-2">
            <Label htmlFor="serviceTax" label="Service Tax" />
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
              <small className="text-danger">*{errors.serviceTax}</small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="surchargeValue" label="Surcharge Value" />
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
              <small className="text-danger">*{errors.surchargeValue}</small>
            )}
          </div>
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

export default UpdateSurcharge;
