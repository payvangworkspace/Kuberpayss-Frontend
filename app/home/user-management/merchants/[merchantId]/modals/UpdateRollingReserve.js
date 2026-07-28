import usePutRequest from "@/app/hooks/usePut";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess, rollingResponse }) => {
  const {
    putData,
    error: putError,
    response: putResponse,
  } = usePutRequest(endPoints.rollingReserve.rollingReserve);
  // form json state data
  const [formData, setFormData] = useState({
    reservePercentage: "",
    holdDays: "",
    currency: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // build payload for create/update
    const payload = {
      reservePercentage: parseFloat(formData.reservePercentage) || 0,
      holdDays: parseInt(formData.holdDays) || 0,
      active:
        typeof rollingResponse?.active === "boolean"
          ? rollingResponse.active
          : true,
    };
    // Use PUT to update rolling reserve for this merchant (merchantId in rollingResponse or fallback to id)
    const merchantIdentifier = rollingResponse?.merchantId || id;
    await putData(payload, {
      url: endPoints.rollingReserve.rollingReserve + merchantIdentifier,
    });
  };

  useEffect(() => {
    if (putResponse && !putError) {
      successMsg("Rolling reserve config updated successfully");
      onSuccess();
      onClick();
    }
  }, [putResponse, putError]);

  // initialize form fields from rollingResponse when modal opens for update
  useEffect(() => {
    if (rollingResponse) {
      setFormData({
        reservePercentage:
          rollingResponse?.data?.reservePercentage ??
          rollingResponse?.reservePercentage ??
          "",
        holdDays:
          rollingResponse?.data?.holdDays ?? rollingResponse?.holdDays ?? "",
      });
    }
  }, [rollingResponse]);

  return (
    <div className="overlay w-30">
      <h6>Update Rolling Reserve</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>

      <form id="add" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label
              htmlFor="reservePercentage"
              label="Reserve Percentage"
              required={true}
            />
            <input
              type="number"
              step="0.1"
              name="reservePercentage"
              id="reservePercentage"
              placeholder="Enter reserve percentage (e.g. 5.0)"
              className="forminput"
              value={formData.reservePercentage}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="holdDays" label="Hold Days" required={true} />
            <input
              type="number"
              name="holdDays"
              id="holdDays"
              placeholder="Enter number of hold days (e.g. 120)"
              className="forminput"
              value={formData.holdDays}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex mt-4 align-items-center gap-3">
          <button type="submit" form="add">
            Update
          </button>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const UpdateRollingReserve = ({
  name,
  id,
  onClose,
  onSuccess,
  rollingResponse,
}) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop"),
      )}
      {createPortal(
        <Overlay
          merchant={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
          rollingResponse={rollingResponse}
        />,
        document.getElementById("overlay"),
      )}
    </Fragment>
  );
};

export default UpdateRollingReserve;
