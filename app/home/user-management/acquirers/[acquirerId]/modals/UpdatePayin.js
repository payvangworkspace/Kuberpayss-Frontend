import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { updatePayinAcquirer } from "@/app/formBuilder/acquirer";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/PayinUpdateFormValidation";
import Label from "@/app/ui/label/Label";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, id, onClick, onSuccess, response }) => {
  const {
    error,
    postData,
    response: update = [],
    loading,
  } = usePostRequest(endPoints.users.acquirerPayin);
  // form json state data
  const [formData, setFormData] = useState(() =>
    updatePayinAcquirer(
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
            <Label htmlFor="acquirerPgId" label="Payin PG Id" />
            <input
              type="text"
              name="acquirerPgId"
              id="acquirerPgId"
              placeholder="Enter Payin PG Id"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPgId}
              autoComplete="off"
            />
            {errors.acquirerPgId && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPgId}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerPgKey" label="Payin PG Key" />
            <input
              type="text"
              name="acquirerPgKey"
              id="acquirerPgKey"
              placeholder="Enter Acquirer PG Key"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPgKey}
              autoComplete="off"
            />
            {errors.acquirerPgKey && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPgKey}
              </small>
            )}
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerPgPassword" label="Payin PG Password" />
            <input
              type="text"
              name="acquirerPgPassword"
              id="acquirerPgPassword"
              placeholder="Enter acquirer pg password"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={response.acquirerPgPassword}
              autoComplete="off"
            />
            {errors.acquirerPgPassword && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.acquirerPgPassword}
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

const UpdatePayin = ({ name, id, onClose, onSuccess, response }) => {
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

export default UpdatePayin;
