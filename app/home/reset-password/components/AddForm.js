"use client";
import { resetPassword } from "@/app/formBuilder/auth";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/ResetPasswordValidation";
import { useEffect, useState } from "react";
import styles from "./AddForm.module.css";

const AddForm = () => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.users.resetPassword,
  );
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState(resetPassword);
  const [errors, setErrors] = useState({});

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
      password: formData.password,
    };
    await postData(data);
  }

  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message);
      setFormData(resetPassword);
      setShowCurrentPass(false);
      setShowPassword({ password: false, confirmPassword: false });
    }
  }, [response, error]);

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  const handleClear = () => {
    setErrors({});
    setFormData(resetPassword);
    setShowCurrentPass(false);
    setShowPassword({ password: false, confirmPassword: false });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Account</p>
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>
            Update your account password securely
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <Label
                htmlFor="currentPassword"
                label="Current Password"
                required={true}
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showCurrentPass ? "text" : "password"}
                  name="currentPassword"
                  id="currentPassword"
                  placeholder="Enter current password"
                  className="forminput"
                  onChange={handleChange}
                  maxLength={256}
                  value={formData.currentPassword}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  aria-label={
                    showCurrentPass ? "Hide password" : "Show password"
                  }
                  title={showCurrentPass ? "Hide password" : "Show password"}
                >
                  <i
                    className={`bi ${
                      showCurrentPass ? "bi-eye-slash" : "bi-eye"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {renderError("currentPassword")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="password" label="New Password" required={true} />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter new password"
                  className="forminput"
                  onChange={handleChange}
                  maxLength={256}
                  value={formData.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                  aria-label={
                    showPassword.password ? "Hide password" : "Show password"
                  }
                  title={
                    showPassword.password ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`bi ${
                      showPassword.password ? "bi-eye-slash" : "bi-eye"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {renderError("password")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="confirmPassword"
                label="Confirm Password"
                required={true}
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className="forminput"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                  aria-label={
                    showPassword.confirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword.confirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <i
                    className={`bi ${
                      showPassword.confirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {renderError("confirmPassword")}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type={loading ? "button" : "submit"}
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
            <button
              type="reset"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
