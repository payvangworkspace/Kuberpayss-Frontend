import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { merchantAmountLimit } from "@/app/formBuilder/mapping";
import apiClient from "@/app/services/apiClient";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess, payableAmount }) => {
  const formRef = useRef(null);
  // form json state data
  const [formData, setFormData] = useState(() => merchantAmountLimit(id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const enteredAmount = formData.refundAmount;
    const enteredReason = formData.reason;
    const amountToSend =
      enteredAmount && enteredAmount.toString().trim() !== ""
        ? enteredAmount
        : payableAmount;

    const body = {
      amount: amountToSend,
      reason: enteredReason || "",
    };

    try {
      setLoading(true);
      const url = endPoints.payin.refund + `${id}`;
      const res = await apiClient.post(url, body);
      if (res) {
        setResponse(res);
        successMsg(res.data.message || "Refund processed successfully");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!error && response) {
      onSuccess();
      onClick();
    }
  }, [error, response]);

  return (
    <div className="overlay w-30">
      <h6>Refund</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="refund" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="refundAmount" label="Amount" />
            <input
              type="text"
              name="refundAmount"
              id="refundAmount"
              placeholder={`Enter refund amount (default ${payableAmount})`}
              className="forminput"
              onChange={handleChange}
              defaultValue={formData.refundAmount || ""}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="reason" label="Reason" />
            <input
              type="text"
              name="reason"
              id="reason"
              placeholder="Enter reason for refund"
              className="forminput"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="refund"
            disabled={loading}
          >
            {loading ? "Processing..." : "Refund"}
          </button>
          <span className="mx-2"></span>
          <button type="button" onClick={onClick} disabled={loading}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const Refund = ({ name, id, onClick, onSuccess, payableAmount }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClick} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={name}
          id={id}
          onClick={onClick}
          onSuccess={onSuccess}
          payableAmount={payableAmount}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default Refund;
