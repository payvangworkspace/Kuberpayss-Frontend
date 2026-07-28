import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { merchantAmountLimit } from "@/app/formBuilder/mapping";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  // form json state data
  const [formData, setFormData] = useState(() => merchantAmountLimit(id));

  // handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  const { postData, error, response, loading } = usePostRequest(
    endPoints.mapping.minAmtLimit
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
              htmlFor="dailyCountLimitActive"
              label="Active Daily Count Limit"
              required={true}
            />
            <input
              type="text"
              name="dailyCountLimitActive"
              id="dailyCountLimitActive"
              placeholder="Enter active daily count limit"
              className="forminput"
              onChange={handleChange}
            />
          </div>
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
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="monthlyCountLimitActive"
              label="Active Monthly Count Limit"
              required={true}
            />
            <input
              type="text"
              name="monthlyCountLimitActive"
              id="monthlyCountLimitActive"
              placeholder="Enter active monthly count limit"
              className="forminput"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="monthlyCountLimit"
              label="Enter monthly count limit"
              required={true}
            />
            <input
              type="text"
              name="monthlyCountLimit"
              id="monthlyCountLimit"
              placeholder="Enter monthly count limit"
              className="forminput"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="dailyAmountLimitActive"
              label="Active Daily Amount Limit"
              required={true}
            />
            <input
              type="text"
              name="dailyAmountLimitActive"
              id="dailyAmountLimitActive"
              placeholder="Enter active daily amount limit"
              className="forminput"
              onChange={handleChange}
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
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="monthlyAmountLimitActive"
              label="Active Monthly Amount Limit"
              required={true}
            />
            <input
              type="text"
              name="monthlyAmountLimitActive"
              id="monthlyAmountLimitActive"
              placeholder="Enter active monthly amount limit"
              className="forminput"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label
              htmlFor="monthlyAmountLimit"
              label="Monthly amount limit"
              required={true}
            />
            <input
              type="text"
              name="monthlyAmountLimit"
              id="monthlyAmountLimit"
              placeholder="Enter monthly amount limit"
              className="forminput"
              onChange={handleChange}
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
const AddAmountLimit = ({ name, id, onClose, onSuccess }) => {
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

export default AddAmountLimit;
