import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import { successMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const { postData, response, error } = usePostRequest(
    endPoints.mapping.refundLimit + id + "/" + "refund-limit"
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formdata = {
      extraRefundLimit: event.target.extraRefundLimit.value,
    };
    await postData(formdata);
  };
  useEffect(() => {
    if (response && !error) {
      successMsg(response?.data.message);
      onSuccess();
      onClick();
    }
  }, [response, error]);

  return (
    <div className="overlay w-30">
      <h6>Add Refund Limit</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="Refund Limit" label="Enter Limit" required={true} />
            <input
              type="text"
              name="extraRefundLimit"
              id="extraRefundLimit"
              className="form-control"
              placeholder="Enter Refund Limit"
              required
            />
          </div>
        </div>
        <div className="d-flex mt-2">
          <button type="submit">Add</button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddRefundLimit = ({ name, id, onClose, onSuccess }) => {
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

export default AddRefundLimit;
