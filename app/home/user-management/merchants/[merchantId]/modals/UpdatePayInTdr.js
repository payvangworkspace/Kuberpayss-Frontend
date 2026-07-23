import Label from "@/app/ui/label/Label";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updatePayIn } from "../components/PayInColumn";
import { validate } from "@/app/validations/forms/UpdatePayInValidation";
import usePutRequest from "@/app/hooks/usePut";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import usePostRequest from "@/app/hooks/usePost";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ updateData, onClick, onSuccess }) => {
  const [formData, setFormData] = useState(() => updatePayIn(updateData));
  const [errors, setErrors] = useState({});
  const {
    response: editResponse,
    error: editError,
    loading: editLoading,
    postData,
  } = usePostRequest(endPoints.mapping.updateMerchantTdr);
  const calculatePgCharge = () => {
    const merchant = parseFloat(formData.merchantCharge) || 0;
    const bank = parseFloat(formData.bankCharge) || 0;
    return (merchant - bank).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (editResponse && !editError) {
      successMsg(
        editResponse.data.message || "merchant Tdr Updated Successfully"
      );
      onSuccess();
      onClick();
    }
  }, [editError, editResponse]);
  return (
    <div className="overlay w-30">
      <h6>Update TDR Setting</h6>
      <form id="update" onSubmit={handleSubmit}>
        <div className="row mt-1">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="merchantCharge" label="Merchant Charge"></Label>
            <input
              value={formData.merchantCharge}
              type="text"
              name="merchantCharge"
              id="merchantCharge"
              className="forminput"
              required
              autoComplete="off"
              placeholder="Enter merchant charge"
              onChange={handleChange}
            />
            {errors.merchantCharge && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.merchantCharge}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="bankCharge" label="Bank Charge"></Label>
            <input
              value={formData.bankCharge}
              type="text"
              name="bankCharge"
              id="bankCharge"
              className="forminput"
              required
              autoComplete="off"
              placeholder="Enter bank charge"
              onChange={handleChange}
            />
            {errors.bankCharge && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.bankCharge}
              </small>
            )}
          </div>
          <div className="col-12 col-sm-12 mb-2">
            <Label htmlFor="pgCharge" label="Pg Charge"></Label>
            <input
              disabled
              value={calculatePgCharge()}
              type="text"
              id="pgCharge"
              className="forminput"
              placeholder="Auto-calculated"
            />
            {errors.pgCharge && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.pgCharge}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
          <button type="submit" form="update">
            Update
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
      <div className="mt-2">
        <h5>
          Minimum Charge: <small>{updateData.minimumAmountLimit}</small>
        </h5>
        <h5>
          Maximum Charge: <small>{updateData.maximumAmountLimit}</small>
        </h5>
      </div>
    </div>
  );
};
const UpdatePayInTdr = ({ updateData, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          updateData={updateData}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdatePayInTdr;
