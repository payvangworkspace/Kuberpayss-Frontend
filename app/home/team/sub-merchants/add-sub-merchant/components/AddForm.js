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
import styles from "./AddForm.module.css";

const PERMISSION_ITEMS = [
  {
    name: "viewOrders",
    label: "View Orders",
    value: "/home/transaction/orders",
  },
  {
    name: "viewTransaction",
    label: "View Transaction",
    value: "/home/transaction/payin",
  },
  {
    name: "viewPaymentLink",
    label: "View Payment Link",
    value: "/home/payment-links",
  },
  {
    name: "addPaymentLink",
    label: "Add Payment Link",
    value: { page: "addPaymentLink", link: "" },
  },
  {
    name: "authSettlement",
    label: "Auth Settlement",
    value: "/home/settlements/auth-settlement",
  },
  {
    name: "saleSettlement",
    label: "Sale Settlement",
    value: "/home/settlements/sale-settlement",
  },
  {
    name: "allSettlement",
    label: "All Settlement",
    value: "/home/settlements/auth-settlement",
  },
  {
    name: "refund",
    label: "Refund",
    value: "/home/refund",
  },
  {
    name: "viewChargeBack",
    label: "Charge Back",
    value: "/home/charge-back",
  },
  {
    name: "viewRemittance",
    label: "Remittance",
    value: "/home/remittance",
  },
  {
    name: "fraudPrevention",
    label: "Fraud Prevention",
    value: "/home/fraud-prevention",
  },
];

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { loading, error, response, postData } = usePostRequest(
    endPoints.settings.addSubMerchant,
  );

  const [formData, setFormData] = useState(addSubAdmin);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
      formRef.current?.reset();
    }
  }, [response, error]);

  const handleClear = () => {
    setErrors({});
    setFormData(addSubAdmin);
    setShowPassword(false);
    formRef.current?.reset();
  };

  const renderError = (key) =>
    errors[key] ? (
      <small className={styles.errorText}>
        <span className={styles.errorMarker}> *</span>
        {errors[key]}
      </small>
    ) : null;

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Manage Teams</p>
          <h2 className={styles.title}>Add Sub Merchant</h2>
          <p className={styles.subtitle}>
            Create a sub merchant account and assign access permissions.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.row}>
            <div className={styles.field}>
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
              {renderError("fullName")}
            </div>

            <div className={styles.field}>
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
              {renderError("userId")}
            </div>

            <div className={styles.field}>
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
              {renderError("contactNumber")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="password" label="Password" required={true} />
              <div className={styles.passwordWrap}>
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
                />
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } ${styles.eyeIcon}`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.hintList}>
                <InfoLabel content={password} />
                <InfoLabel content="Password must contain at least one uppercase letter" />
                <InfoLabel content="Password must contain at least one special character" />
              </div>
              {renderError("password")}
            </div>
          </div>

          <div className={styles.section}>
            <h6 className={styles.sectionTitle}>Account Permissions</h6>
            <div className={styles.permGrid}>
              {PERMISSION_ITEMS.map((item) => (
                <label
                  key={item.name}
                  className={styles.permItem}
                  htmlFor={item.name}
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    id={item.name}
                    value={
                      typeof item.value === "string"
                        ? item.value
                        : JSON.stringify(item.value)
                    }
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      setFormData((prev) => {
                        const permissions = { ...prev.permissions };
                        if (checked) {
                          permissions[name] = item.value;
                        } else {
                          delete permissions[name];
                        }
                        return { ...prev, permissions };
                      });
                      setErrors({});
                    }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
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
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
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
