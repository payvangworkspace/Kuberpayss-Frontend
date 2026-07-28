"use client";
import Label from "@/app/ui/label/Label";
import { useEffect, useRef, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { addAcquirer } from "@/app/formBuilder/acquirer";
import { useRouter } from "next/navigation";
import { validate } from "@/app/validations/forms/AddAcquirerFormValidations";
import { password } from "@/app/utils/message";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.users.acquirer
  );
  const [formData, setFormData] = useState(addAcquirer);
  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "payin" && !checked) {
      setFormData({
        ...formData,
        payin: false,
        acquirerPgId: "",
        acquirerPgKey: "",
        acquirerPgPassword: "",
      });
    }

    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  }
  useEffect(() => {
    if (response && !error) setFormData(addAcquirer);
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="fullName" label="Full Name" required={true} />
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter acquirer name"
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
            <Label
              htmlFor="acquirerCode"
              label="Acquirer Code"
              required={true}
            />
            <input
              type="text"
              name="acquirerCode"
              id="acquirerCode"
              placeholder="Enter acquirer code"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.acquirerCode}
            />
            {errors.acquirerCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerCode}
              </small>
            )}
          </div>
          {errors.payinOrPayout && (
            <small className="text-danger">
              <span className="text-danger"> *</span>
              {errors.payinOrPayout}
            </small>
          )}

          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="acquirerPgId" label="Payin PG Id" required={true} />
            <input
              type="text"
              name="acquirerPgId"
              id="acquirerPgId"
              placeholder="Enter Payin PG Id"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.acquirerPgId}
              autoComplete="off"
              readOnly
              onFocus={(e) => {
                e.target.removeAttribute("readOnly");
                e.target.setAttribute("autocomplete", "off");
              }}
            />
            {errors.acquirerPgId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerPgId}
              </small>
            )}
          </div>

          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="acquirerPgKey"
              label="Payin PG Key"
              required={true}
            />
            <input
              type="text"
              name="acquirerPgKey"
              id="acquirerPgKey"
              placeholder="Enter Acquirer PG Key"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.acquirerPgKey}
              autoComplete="off"
            />
            {errors.acquirerPgKey && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerPgKey}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="acquirerPgPassword"
              label="Payin PG Password"
              required={true}
            />
            <input
              type="password"
              name="acquirerPgPassword"
              id="acquirerPgPassword"
              placeholder="Enter acquirer pg password"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.acquirerPgPassword}
              autoComplete="off"
              readOnly
              onFocus={(e) => {
                e.target.removeAttribute("readOnly");
                e.target.setAttribute("autocomplete", "off");
              }}
            />
            <InfoLabel content={password} />
            <InfoLabel content="Password must contain at least one uppercase letter" />
            <InfoLabel content="Password must contain at least one special character" />

            {errors.acquirerPgPassword && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerPgPassword}
              </small>
            )}
          </div>

          {/* <div className="col-md-6 col-sm-12 mb-2">
            <div className="d-flex align-items-center gap-2 mb-1">
              <input
                type="checkbox"
                id="payout"
                name="payout"
                onChange={handleChange}
                checked={formData.payout}
              />
              <Label htmlFor="payout" label="payout Account" />
            </div>
            <div className="col-12 mb-2">
              <Label
                htmlFor="acquirerPayoutPgId"
                label="Payin PG Id"
                required={true}
              />
              <input
                type="text"
                name="acquirerPayoutPgId"
                id="acquirerPayoutPgId"
                placeholder="Enter Payout PG Id"
                className="forminput"
                onChange={handleChange}
                maxLength={256}
                value={formData.acquirerPayoutPgId}
                disabled={!formData.payout}
                autoComplete="off"
              />
              {errors.acquirerPayoutPgId && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.acquirerPayoutPgId}
                </small>
              )}
            </div>
            <div className="col-12 mb-2">
              <Label
                htmlFor="acquirerPayoutPgKey"
                label="Payout PG Key"
                required={true}
              />
              <input
                type="text"
                name="acquirerPayoutPgKey"
                id="acquirerPayoutPgKey"
                placeholder="Enter Payout PG Key"
                className="forminput"
                onChange={handleChange}
                maxLength={256}
                value={formData.acquirerPayoutPgKey}
                disabled={!formData.payout}
                autoComplete="off"
              />
              {errors.acquirerPayoutPgKey && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.acquirerPayoutPgKey}
                </small>
              )}
            </div>
            <div className="col-12 mb-2">
              <Label
                htmlFor="acquirerPayoutPgPassword"
                label="Payout PG Password"
                required={true}
              />
              <input
                type="password"
                name="acquirerPayoutPgPassword"
                id="acquirerPayoutPgPassword"
                placeholder="Enter payout pg password"
                className="forminput"
                onChange={handleChange}
                maxLength={256}
                value={formData.acquirerPayoutPgPassword}
                disabled={!formData.payout}
                autoComplete="off"
              />
              {errors.acquirerPayoutPgPassword && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.acquirerPayoutPgPassword}
                </small>
              )}
              <InfoLabel content="Password should be 8 characters long" />
            </div>
          </div> */}
        </div>
        <div className="d-flex justify-content-between align-items-center gap-2 mt-2 mb-2">
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
                setFormData(addAcquirer);
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
