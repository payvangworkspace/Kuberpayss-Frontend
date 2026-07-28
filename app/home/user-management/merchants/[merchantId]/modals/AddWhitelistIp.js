import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validateIPAddress } from "@/app/validations/InputType";
import { errorMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  
  // form json state data
  const [formData, setFormData] = useState({
    merchant: {
      userId: id
    },
    ipAddress: ""
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.ipWhitelist
  );


  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validIp = await validateIPAddress(formData.ipAddress);

    if (validIp) {
      errorMsg(validIp);
      return;
    }
    

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
      <h6>Add IP Whitelist</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID: {id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label
              htmlFor="ipAddress"
              label="IP Address"
              required={true}
            />
            <input
              type="text"
              name="ipAddress"
              id="ipAddress"
              placeholder="Enter IP address (e.g. 192.168.1.2)"
              className="forminput"
              onChange={handleChange}
              value={formData.ipAddress}
            />
          </div>
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="add"
            disabled={loading}
          >
            {loading ? "Processing..." : "Add"}
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};

const AddIpWhitelist = ({ name, id, onClose, onSuccess }) => {
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

export default AddIpWhitelist;