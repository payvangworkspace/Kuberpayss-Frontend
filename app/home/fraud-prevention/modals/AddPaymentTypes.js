import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { endPoints } from "@/app/services/apiEndpoints";
import { addWithValue } from "@/app/formBuilder/fraudPrevention";
import usePostRequest from "@/app/hooks/usePost";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { validate } from "@/app/validations/forms/AddPaymentTypeValidations";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, type, id, onClick, onSuccess }) => {
  // logic to fetch all payment type and mop Type of acquirer
  const { response: paymentTypes = [], getData: getAllPaymentTypes } =
    useGetRequest();
  const [paymentType, setPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  useEffect(() => {
    getAllPaymentTypes(endPoints.settings.paymentType);
  }, []);
  const handlePaymentType = (id, name) => {
    setPaymentType({ id, name });
    setFormData((prev) => ({
      ...prev,
      value: name,
    }));
  };
  const { postData, error, response, loading } = usePostRequest(
    endPoints.fraudPrevention.addNew
  );
  // form json state data
  const [formData, setFormData] = useState(() => addWithValue(id, type));
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    
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
      setFormData(() => addWithValue(id, type));
    }
  }, [response, error]);
  return (
    <div className={styles.modal}>
      <h6>Add Payment Type to Block</h6>
      <label htmlFor="username">Merchant Name:{merchant}</label>
      <h5 id="username">ID:{id}</h5>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-2">
            <Label htmlFor="value" label="Select Payment Type" required={true}/>
            <Dropdown
              initialLabel="Select Payment Type"
              selectedValue={paymentType}
              options={paymentTypes?.data}
              onChange={handlePaymentType}
              id="paymentTypeId"
              value="paymentTypeName"
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
const AddPaymentTypes = ({ merchant, type, id, onClose, onSuccess }) => {
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

export default AddPaymentTypes;
