import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { updatePayinAcquirer, updatePayoutAcquirer } from "@/app/formBuilder/acquirer";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/PayinUpdateFormValidation";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, id, onClick, onSuccess, response }) => {
  const {
    error,
    postData,
    response: update = [],
    loading,
  } = usePostRequest(endPoints.users.acquirerPayout);
  // form json state data
  const [formData, setFormData] = useState(() =>
    updatePayoutAcquirer(
      id,
      response?.acquirerPgId || "",
      response?.acquirerPgKey || "",
      response?.acquirerPgPassword || ""
    )
  );
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };
  const formRef = useRef(null);
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
    if (update && !error) {
      successMsg("Payout details updated successfully");
      onClick();
      onSuccess();
    }
  }, [update, error]);
  return (
    <div className="overlay w-30">
      <h6>Update Payin Details</h6>
      <h5 id="username">Acquirer Name: &nbsp; {response.fullName}</h5>
      <small>ID:&nbsp;{response.acquirerId}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerPayoutPgId" label="Payout PG Id" />
            <input
              type="text"
              name="acquirerPayoutPgId"
              id="acquirerPayoutPgId"
              placeholder="Enter Payin PG Id"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPayoutPgId}
              autoComplete="off"
            />
            {errors.acquirerPayoutPgId && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPayoutPgId}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerPayoutPgKey" label="Payout PG Key" />
            <input
              type="text"
              name="acquirerPayoutPgKey"
              id="acquirerPayoutPgKey"
              placeholder="Enter Acquirer PG Key"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPayoutPgKey}
              autoComplete="off"
            />
            {errors.acquirerPayoutPgKey && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPayoutPgKey}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerPayoutPgPassword" label="Payout PG Password" />
            <input
              type="text"
              name="acquirerPayoutPgPassword"
              id="acquirerPayoutPgPassword"
              placeholder="Enter acquirer pg password"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPayoutPgPassword}
              autoComplete="off"
            />
            {errors.acquirerPayoutPgPassword && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPayoutPgPassword}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            disabled={loading}
            form="add"
          >
            {loading ? "Processing..." : "Update"}
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};

const UpdatePayout = ({ name, id, onClose, onSuccess, response }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          acquirer={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
          response={response}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdatePayout;
