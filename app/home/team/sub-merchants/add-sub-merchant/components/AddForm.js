"use client";
import { addSubAdmin } from "@/app/formBuilder/admin";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import Label from "@/app/ui/label/Label";
import { password } from "@/app/utils/message";
import { validate } from "@/app/validations/forms/AddSubMerchantFormValidations";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { loading, error, response, postData } = usePostRequest(
    endPoints.settings.addSubMerchant
  );

  const [formData, setFormData] = useState(addSubAdmin);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // handle input change
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        permissions: { ...formData.permissions, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO Validations
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      setFormData(addSubAdmin);
      formRef.current.reset();
    }
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="fullName" label="Name" required={true} />
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.fullName}
            />
            {errors.fullName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.fullName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="userId" label="Username" required={true} />
            <input
              type="email"
              name="userId"
              id="userId"
              placeholder="Enter email/username"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.userId}
              autoComplete="off"
              readOnly
              onFocus={(e) => {
                e.target.removeAttribute("readOnly");
                e.target.setAttribute("autocomplete", "off");
              }}
            />
            {errors.userId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.userId}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="contactNumber"
              label="Contact Number"
              required={true}
            />
            <input
              type="text"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter contact number"
              className="forminput"
              onChange={handleChange}
              value={formData.contactNumber}
            />
            {errors.contactNumber && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.contactNumber}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="password" label="Password" required={true} />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter password"
                className="forminput"
                autoComplete="off"
                value={formData.password}
                onChange={handleChange}
                readOnly
                onFocus={(e) => {
                  e.target.removeAttribute("readOnly");
                  e.target.setAttribute("autocomplete", "off");
                }}
                style={{ paddingRight: "40px" }} // space for icon
              />

              {/* Eye Icon */}
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                }}
              ></i>
            </div>
            <small>
              <InfoLabel content={password} />
              <InfoLabel content="Password must contain at least one uppercase letter" />
              <InfoLabel content="Password must contain at least one special character" />
            </small>
            {errors.password && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
          </div>
          <h6>Account Permissions:</h6>
          <div className="row">
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewOrders"
                id="viewOrders"
                value="/home/transaction/orders"
                onChange={handleChange}
              />
              <span className="mx-1">View Orders</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewTransaction"
                id="viewTransaction"
                value="/home/transaction/payin"
                onChange={handleChange}
              />
              <span className="mx-1">View Transaction</span>
            </div>

            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewPaymentLink"
                id="viewPaymentLink"
                value="/home/payment-links"
                onChange={handleChange}
              />
              <span className="mx-1">View Payment Link</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addPaymentLink"
                id="addPaymentLink"
                value={{ page: "addPaymentLink", link: "" }}
                onChange={handleChange}
              />
              <span className="mx-1">Add Payment Link</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="authSettlement"
                id="authSettlement"
                value="/home/settlements/auth-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">Auth Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="saleSettlement"
                id="saleSettlement"
                value="/home/settlements/sale-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">Sale Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="allSettlement"
                id="allSettlement"
                value="/home/settlements/auth-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">All Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="refund"
                id="refund"
                value="/home/refund"
                onChange={handleChange}
              />
              <span className="mx-1">Refund</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewChargeBack"
                id="viewChargeBack"
                value="/home/charge-back"
                onChange={handleChange}
              />
              <span className="mx-1">Charge Back</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewRemittance"
                id="viewRemittance"
                value="/home/remittance"
                onChange={handleChange}
              />
              <span className="mx-1">Remittance</span>
            </div>

            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="fraudPrevention"
                id="fraudPrevention"
                value="/home/fraud-prevention"
                onChange={handleChange}
              />
              <span className="mx-1">Fraud Prevention</span>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
          <button type="button" className="back" onClick={() => router.back()}>
            Back
          </button>
          <span className="d-flex gap-2">
            <button
              type={loading ? "button" : "submit"}
              className="submit"
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
            <button
              type="reset"
              className="reset"
              onClick={() => {
                setErrors({});
                setFormData(addCountry);
              }}
            >
              Clear
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
