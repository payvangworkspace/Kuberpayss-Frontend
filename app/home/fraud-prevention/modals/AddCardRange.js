import { Fragment, useEffect, useState } from "react";
import styles from "../page.module.css";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { addAmountLimit } from "@/app/formBuilder/fraudPrevention";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/AddCardRangeValidation";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, type, id, onClick, onSuccess }) => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.fraudPrevention.addNew
  );
  // form json state data
  const [formData, setFormData] = useState(() => addAmountLimit(id, type));
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
      setFormData(() => addAmountLimit(id, type));
    }
  }, [response, error]);
  return (
    <div className={styles.modal}>
      <h6>Add Card Range</h6>
      <label htmlFor="username">Merchant Name:{merchant}</label>
      <h5 id="username">ID:{id}</h5>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-2">
            <Label htmlFor="value" label="Card Starting Range" required={true}/>
            <input
              type="text"
              name="value"
              id="value"
              placeholder="Enter card first 4 digit"
              className="forminput"
              onChange={handleChange}
            />
            {errors.value && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.value}
              </small>
            )}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="value2" label="Card Ending Range" required={true} />
            <input
              type="text"
              name="value2"
              id="value2"
              placeholder="Enter card last 4 digit"
              className="forminput"
              onChange={handleChange}
            />
            {errors.value && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.value}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
          <button
            type={loading ? "button" : "submit"}
            form="add"
            disabled={loading}
          >
            {loading ? "processing.." : "Add"}
          </button>
          <span className="mx-2"></span>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const AddCardRange = ({ merchant, type, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={merchant}
          id={id}
          type={type}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddCardRange;
