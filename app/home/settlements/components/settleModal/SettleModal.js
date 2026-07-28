import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import apiClient from "@/app/services/apiClient";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  // form json state data
  const [formData, setFormData] = useState({});
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
    const utrNumber = formData.utrNumber;
    const desc = formData.desc;

    const body = {
      merchantId: id,
      utrNumber: utrNumber || "",
      desc: desc || "",
    };

    try {
      setLoading(true);
      const url = endPoints.payin.settlementStatus;
      const res = await apiClient.put(url, body);
      if (res) {
        setResponse(res);
        successMsg(res.data.message || "Settled successfully");
        onSuccess();
        onClick();
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
      <h6>Settlement</h6>
      <h5 id="username">Merchant Id: {id}</h5>
      <form id="refund" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="utrNumber" label="UTR Number" />
            <input
              type="text"
              name="utrNumber"
              id="utrNumber"
              placeholder="Enter UTR Number"
              className="forminput"
              onChange={handleChange}
              defaultValue={formData.utrNumber || ""}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="desc" label="Description" />
            <textarea
              type="text"
              name="desc"
              id="desc"
              placeholder="Enter description"
              className="forminput"
              onChange={handleChange}
              defaultValue={formData.desc || ""}
            />
          </div>
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="refund"
            disabled={loading}
          >
            {loading ? "Processing..." : "Settle"}
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
const Settle = ({ id, onClick, onSuccess, settlementId }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClick} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          id={id}
          onClick={onClick}
          onSuccess={onSuccess}
          settlementId={settlementId}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default Settle;
