import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import apiClient from "@/app/services/apiClient";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import useGetRequest from "@/app/hooks/useFetch";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { dateTimeFormatterCaps } from "@/app/utils/dateFormatter";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    internalNotes: "",
    responseDeadline: "",
    chargebackAmount: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [chargeBackType, setChargeBackType] = useState({
    id: "",
    name: "Select Charge Back Type",
  });

  const { getData: getChargeBackType, response: chargeBackTypes } =
    useGetRequest();

  useEffect(() => {
    getChargeBackType(endPoints.payin.chargeBackTypes);
  }, []);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const body = {
      orderId: id,
      chargebackType: chargeBackType.id || "",
      reason: formData.reason || "",
      chargebackAmount: formData.chargebackAmount || "",
      currencyCode: "USD",
      responseDeadline: dateTimeFormatterCaps(formData.responseDeadline || ""),
      internalNotes: formData.internalNotes || "",
    };

    try {
      setLoading(true);
      const res = await apiClient.post(endPoints.payin.chargeBack, body);
      if (res) {
        setResponse(res);
        successMsg(res.data.message || "Chargeback processed successfully");
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
      <h6>Add Charge Back</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="chargeback" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="chargebackType" label="Charge Back Type" />
            <Dropdown
              initialLabel="Select Charge Back Type"
              selectedValue={chargeBackType}
              options={chargeBackTypes?.data || []}
              onChange={(id, name) => setChargeBackType({ id, name })}
              id="value"
              value="displayName"
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
          <div className="col-12 mb-2">
            <Label htmlFor="chargebackAmount" label="Charge Back Amount" />
            <input
              type="text"
              name="chargebackAmount"
              id="chargebackAmount"
              placeholder={"Enter charge back amount"}
              className="forminput"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="responseDeadline" label="Response Deadline" />
            <input
              type="datetime-local"
              name="responseDeadline"
              id="responseDeadline"
              className="forminput"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12 mb-2">
          <Label htmlFor="internalNotes" label="Internal Notes" />
          <input
            type="text"
            name="internalNotes"
            id="internalNotes"
            placeholder="Enter internal notes"
            className="forminput"
            onChange={handleChange}
          />
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="chargeback"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
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
const ChargeBack = ({ name, id, onClick, onSuccess }) => {
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
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ChargeBack;
