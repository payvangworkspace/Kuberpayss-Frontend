"use client";
import { resetPassword } from "@/app/formBuilder/auth";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/ResetPasswordValidation";
import Link from "next/link";
import { useEffect, useState } from "react";

const AddForm = () => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.users.resetPassword
  );
  const [showCurretPass, setShowCurrentPass] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState(resetPassword);
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = {
      currentPassword: formData.currentPassword,
      password: formData.password
    };
    await postData(data);
  }
  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message);
      setFormData(resetPassword);
    }
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="password" label="Current Password" required={true} />
            <input
              type={showCurretPass ? "text" : "password"}
              name="currentPassword"
              id="currentPassword"
              placeholder="Enter current password"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.currentPassword}
              autoComplete="off"
            />
            <Link
              href="#"
              onClick={() =>
                setShowCurrentPass(!showCurretPass)
              }
            >
              <InfoLabel
                content={
                  showPassword.password ? "Hide password" : "Show password"
                }
              />
            </Link>
            {errors.password && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="password" label="New Password" required={true} />
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter new password"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.password}
              autoComplete="off"
            />
            <Link
              href="#"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  password: !showPassword.password,
                })
              }
            >
              <InfoLabel
                content={
                  showPassword.password ? "Hide password" : "Show password"
                }
              />
            </Link>
            {errors.password && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <Label
              htmlFor="confirmPassword"
              label="Confirm Password"
              required={true}
            />
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm password"
              className="forminput"
              onChange={handleChange}
              value={formData.confirmPassword}
              autoComplete="off"
            />
            <Link
              href="#"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirmPassword: !showPassword.confirmPassword,
                })
              }
            >
              <InfoLabel
                content={
                  showPassword.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              />
            </Link>
            {errors.confirmPassword && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.confirmPassword}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between  gap-2 mt-2 mb-2">
          <span className="d-flex gap-2 align-items-center">
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
                setFormData(resetPassword);
              }}
            >
              Clear
            </button>
          </span>
        </div>
      </form >
    </div >
  );
};

export default AddForm;
