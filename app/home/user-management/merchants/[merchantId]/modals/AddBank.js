import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { bankAccount } from "@/app/formBuilder/account";
import { validate } from "@/app/validations/forms/AccountFormValidations";
import usePostRequest from "@/app/hooks/usePost";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const { postData, error, response } = usePostRequest(
    endPoints.users.user + endPoints.users.account.bank
  );
  // form json state data
  const [formData, setFormData] = useState(bankAccount);
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message);
      onSuccess();
      onClick();
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>Add Bank</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="bankname" label="Bank Name" />
            <input
              type="text"
              name="bankName"
              id="bankname"
              placeholder="Enter bank name"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.bankName && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.bankName}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="branchname" label="Branch Name" />
            <input
              type="text"
              name="branchName"
              id="branchname"
              placeholder="Enter branch name"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.branchName && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.branchName}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label
              htmlFor="bankaccountnumber"
              label="Account Number"
              required={true}
            />
            <input
              type="text"
              name="bankAccountNumber"
              id="bankaccountnumber"
              placeholder="Enter account number"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.bankAccountNumber && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.bankAccountNumber}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="iban" label="IBAN" required={true} />
            <input
              type="text"
              name="iban"
              id="iban"
              placeholder="Enter IBAN"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.bankAccountNumber && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.bankAccountNumber}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="swiftCode" label="SWIFT Code" required={true} />
            <input
              type="text"
              name="swiftCode"
              id="swiftCode"
              placeholder="Enter SWIFT code"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.bankAccountNumber && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.bankAccountNumber}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="ifscCode" label="IFSC Code" />
            <input
              type="text"
              name="ifscCode"
              id="ifsccode"
              placeholder="Enter IFSC code"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.ifscCode && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.ifscCode}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="cardnumber" label="Card Number" />
            <input
              type="text"
              name="cardNumber"
              id="cardnumber"
              placeholder="Enter card number"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.cardNumber && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.cardNumber}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="vpa" label="Virtual Payment Address" />
            <input
              type="text"
              name="vpa"
              id="vpa"
              placeholder="Enter card number"
              className="forminput"
              autoComplete="on"
              onChange={handleChange}
            />
            {/* {errors.vpa && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.vpa}
              </small>
            )} */}
          </div>
        </div>
        <div className="d-flex mt-2">
          <button type="submit" form="add">
            Add
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddBank = ({ name, id, onClose, onSuccess }) => {
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

export default AddBank;
