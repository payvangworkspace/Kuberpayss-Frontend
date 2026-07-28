import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { merchantAmountLimit } from "@/app/formBuilder/mapping";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess, data }) => {
  const formRef = useRef(null);
  // form json state data
  const [formData, setFormData] = useState(() => merchantAmountLimit(id));

  // set form data
  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        dailyCountLimit: data?.dailyCountLimit,
        dailyAmountLimit: data?.dailyAmountLimit,
        minimumAmountPerTxn: data?.minimumAmountPerTxn,
        maximumAmountPerTxn: data?.maximumAmountPerTxn,
      });
    }
  }, [data]);

  // handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.setAmountLimit
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData(formData);
  };
  useEffect(() => {
    if (!error && response) {
      onSuccess();
      onClick();
    }
  }, [error, response]);

  return (
    <div className="overlay w-30">
      <h6>Add Amount Setting</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label
              htmlFor="dailyCountLimit"
              label="Daily Count Limit"
              required={true}
            />
            <input
              type="text"
              name="dailyCountLimit"
              id="dailyCountLimit"
              placeholder="Enter daily count limit"
              className="forminput"
              onChange={handleChange}
              defaultValue={data?.dailyCountLimit}
            />
          </div>

          <div className="col-12 mb-2">
            <Label
              htmlFor="dailyAmountLimit"
              label="Daily amount limit"
              required={true}
            />
            <input
              type="text"
              name="dailyAmountLimit"
              id="dailyAmountLimit"
              placeholder="Enter daily amount limit"
              className="forminput"
              onChange={handleChange}
              defaultValue={data?.dailyAmountLimit}
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="minimumAmountPerTxn"
              label="Minimum Amount Limit"
              required={true}
            />
            <input
              type="text"
              name="minimumAmountPerTxn"
              id="minimumAmountPerTxn"
              placeholder="Enter minimum amount limit"
              className="forminput"
              onChange={handleChange}
              defaultValue={data?.minimumAmountPerTxn}
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="maximumAmountPerTxn"
              label="Maximum amount limit"
              required={true}
            />
            <input
              type="text"
              name="maximumAmountPerTxn"
              id="maximumAmountPerTxn"
              placeholder="Enter maximum amount limit"
              className="forminput"
              onChange={handleChange}
              defaultValue={data?.maximumAmountPerTxn}
            />
          </div>
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="add"
            disabled={loading}
          >
            {loading ? "Processing..." : data ? "Update" : "Add"}
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddTransferLimit = ({ name, id, onClose, onSuccess, data }) => {
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
          data={data}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddTransferLimit;
