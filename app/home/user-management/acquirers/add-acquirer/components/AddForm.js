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
import styles from "./AddForm.module.css";

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.users.acquirer
  );
  const [formData, setFormData] = useState(addAcquirer);
  const [errors, setErrors] = useState({});

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

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payment Routing</p>
          <h2 className={styles.title}>Add Acquirer</h2>
          <p className={styles.subtitle}>
            Configure a new acquirer with payin gateway credentials.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.row}>
            <div className={styles.field}>
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
              {renderError("fullName")}
            </div>

            <div className={styles.field}>
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
              {renderError("acquirerCode")}
            </div>

            {errors.payinOrPayout && (
              <div className={styles.formError}>
                <small className={styles.errorText}>
                  <span className={styles.errorMarker}> *</span>
                  {errors.payinOrPayout}
                </small>
              </div>
            )}

            <div className={styles.field}>
              <Label
                htmlFor="acquirerPgId"
                label="Payin PG Id"
                required={true}
              />
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
              {renderError("acquirerPgId")}
            </div>

            <div className={styles.field}>
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
              {renderError("acquirerPgKey")}
            </div>

            <div className={styles.field}>
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
              <div className={styles.hintList}>
                <InfoLabel content={password} />
                <InfoLabel content="Password must contain at least one uppercase letter" />
                <InfoLabel content="Password must contain at least one special character" />
              </div>
              {renderError("acquirerPgPassword")}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => router.back()}
            >
              Back
            </button>
            <div className={styles.actionsRight}>
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
                onClick={() => {
                  setErrors({});
                  setFormData(addAcquirer);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
