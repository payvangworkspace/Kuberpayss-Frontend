import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { bankAccount } from "@/app/formBuilder/account";
import { validate } from "@/app/validations/forms/AccountFormValidations";
import usePostRequest from "@/app/hooks/usePost";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";
import usePutRequest from "@/app/hooks/usePut";

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({
  merchant,
  id,
  onClick,
  onSuccess,
  responseBank,
  bankDetailId,
}) => {
  const { putData, error, response } = usePutRequest(
    endPoints.users.user + endPoints.users.account.bank + "/" + bankDetailId
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
  useEffect(() => {
    if (responseBank?.[0]) {
      setFormData({
        bankName: responseBank[0].bankName || "",
        branchName: responseBank[0].branchName || "",
        bankAccountNumber: responseBank[0].bankAccountNumber || "",
        ifscCode: responseBank[0].ifscCode || "",
        iban: responseBank[0].iban || "",
        swiftCode: responseBank[0].swiftCode || "",
        cardNumber: responseBank[0].cardNumber || "",
        vpa: responseBank[0].vpa || "",
      });
    }
  }, [responseBank]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    await putData(formData);
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
      <h6>Update Bank Details</h6>
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
              value={formData.bankName || ""}
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
              value={formData.branchName || ""}
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
              value={formData.bankAccountNumber || ""}
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
              value={formData.ifscCode || ""}
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
            <Label htmlFor="iban" label="IBAN" />
            <input
              type="text"
              name="iban"
              id="iban"
              placeholder="Enter IBAN "
              className="forminput"
              autoComplete="on"
              value={formData.iban || ""}
              onChange={handleChange}
            />
            {/* {errors.iban && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.iban}
              </small>
            )} */}
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="swiftCode" label="SWIFT Code" />
            <input
              type="text"
              name="swiftCode"
              id="swiftCode"
              placeholder="Enter SWIFT code"
              className="forminput"
              autoComplete="on"
              value={formData.swiftCode || ""}
              onChange={handleChange}
            />
            {/* {errors.swiftCode && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.swiftCode}
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
              value={formData.cardNumber || ""}
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
              value={formData.vpa || ""}
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
            Update
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const UpdateBank = ({
  name,
  id,
  onClose,
  onSuccess,
  responseBank,
  bankDetailId,
}) => {
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
          responseBank={responseBank}
          bankDetailId={bankDetailId}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdateBank;
