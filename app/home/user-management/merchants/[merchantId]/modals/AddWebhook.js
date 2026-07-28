
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { webhookMapping } from "@/app/formBuilder/mapping";
import usePostRequest from "@/app/hooks/usePost";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/WebHookUrlValidation";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, data, onClick, onSuccess }) => {
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // webhook add
  const { postData, response, error, loading } = usePostRequest(data.url);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = validate(event.target.url.value);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    const formdata = await webhookMapping(
      id,
      event.target.url.value,
      data.type
    );
    await postData(formdata);
  };
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
    }
  }, [response, error]);

  return (
    <div className="overlay w-30">
      <h6>
        {data.action} {data.type} Webhook
      </h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="url" label="Enter Webhook URL" required={true} />
            <input
              type="text"
              name="url"
              id="url"
              placeholder="Enter url here"
              className="forminput"
              defaultValue={data.defaultValue && data.defaultValue}
            />
            {errors.url && (
              <small className="">
                <span className="text-danger"> *</span>
                {errors.url}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
          {!data.defaultValue && (
            <button type={loading ? "button" : "submit"}>
              {loading ? "Please wait..." : "Add"}
            </button>
          )}
          {data.defaultValue && (
            <button type={loading ? "button" : "submit"}>
              {loading ? "Please wait..." : "Update"}
            </button>
          )}
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddWebhook = ({ name, id, data, onClose, onSuccess }) => {
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
          data={data}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddWebhook;
