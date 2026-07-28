import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { endPoints } from "@/app/services/apiEndpoints";
import { updateMerchant } from "@/app/formBuilder/merchant";
import usePutRequest from "@/app/hooks/usePut";
import { dateFormatter } from "@/app/utils/dateFormatter";
import { validate } from "@/app/validations/forms/UpdateAccountValidation";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ onClick, onSuccess, currentData }) => {
  const { response, error, loading, putData } = usePutRequest(
    endPoints.users.updateUser
  );
  // form json state data
  const [formData, setFormData] = useState(() => updateMerchant(currentData));
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    const { type, name, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "date" ? dateFormatter(value) : value,
    });
  };
  const formRef = useRef(null);
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await putData(formData);
  }
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
    }
  }, [response, error]);


  if (currentData);
  {
    return (
      <div className="overlay">
        <h6>Update Account</h6>
        <h5 id="username">Merchant Name: &nbsp; {currentData.fullName}</h5>
        <small>ID:&nbsp;{currentData.userId}</small>
        <form id="add" onSubmit={handleSubmit} ref={formRef}>
          <div className="row mt-3">
            <div className="col-12 mb-2">
              <Label htmlFor="contactNumber" label="Contact Number" required={true}/>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Phone Number"
                className="forminput"
                defaultValue={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.contactNumber}
                </small>
              )}
            </div>
            <div className="col-12 mb-2">
              <Label htmlFor="dateOfBirth" label="Select Date Of Birth" required={true}/>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                placeholder="Enter DOB"
                max={new Date().toISOString().split("T")[0]}
                className="forminput"
                defaultValue={formData.dateOfBirth}
                onChange={handleChange}
              />
              {errors.dateOfBirth && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.dateOfBirth}
                </small>
              )}
            </div>
            <div className="col-12 mb-2">
              <Label htmlFor="gender" label="Select Gender" required={true}/>
              <select
                className="forminput"
                name="gender"
                id="gender "
                defaultValue={formData.gender}
                onChange={handleChange}
              >
                <option value="">--Select gender--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="col-12 mb-2">
            <Label htmlFor="address" label="Address Detail" required={true}/>
            <textarea
              rows={5}
              name="address"
              id="address"
              placeholder="Enter full Address"
              className="forminput"
              defaultValue={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.address}
              </small>
            )}
          </div>

          <div className="d-flex mt-4">
            <button
              type={loading ? "button" : "submit"}
              form="add"
              disabled={loading}
            >
              {loading ? "Processing..." : "Update"}
            </button>
            <span className="mx-2"></span>
            <button onClick={onClick}>Close</button>
          </div>
        </form>
      </div>
    );
  }
};
const UpdateAccount = ({ onClose, onSuccess, response }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          onClick={onClose}
          onSuccess={onSuccess}
          currentData={response}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdateAccount;
