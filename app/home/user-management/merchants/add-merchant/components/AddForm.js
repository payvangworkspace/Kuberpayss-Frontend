"use client";
import Label from "@/app/ui/label/Label";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import { password } from "@/app/utils/message";
import usePostRequest from "@/app/hooks/usePost";
import { addMerchant } from "@/app/formBuilder/merchant";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { validate } from "@/app/validations/forms/AddMerchantFormValidation";
import { useRouter } from "next/navigation";
import { industryData } from "../../components/Columns";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { countryCodes } from "@/app/utils/countryCodes";
import styles from "./AddForm.module.css";

const AddForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    name: "India (+91)",
    dial_code: "+91",
    label: "+91",
  });
  const [filteredCountryCodes, setFilteredCountryCodes] = useState([]);

  useEffect(() => {
    const formattedCodes = countryCodes.map((c) => ({
      ...c,
      label: c.dial_code,
      name: `${c.name} (${c.dial_code})`,
    }));
    setCountryCodeList(formattedCodes);
    setFilteredCountryCodes(formattedCodes);
  }, []);
  const router = useRouter();

  const { postData, error, response, loading } = usePostRequest(
    endPoints.users.merchant
  );

  const [showOtherBusinessType, setShowOtherBusinessType] = useState(false);
  const [showOtherSubBusinessType, setShowOtherSubBusinessType] =
    useState(false);

  const [formData, setFormData] = useState(addMerchant);
  const [selectedIndustry, setSelectedIndustry] = useState({
    id: "",
    name: "Select Industry",
  });
  const [subIndusry, setSubIndustry] = useState();
  const [selectedSubIndustry, setSelectedSubIndustry] = useState({
    id: "",
    name: "Select Sub Industry",
  });
  const [errors, setErrors] = useState({});

  const handleIndustryChange = (id, name, index) => {
    setSelectedIndustry({ id, name });

    if (name === "Other") {
      setShowOtherBusinessType(true);
      setFormData((prev) => ({ ...prev, businessType: "" }));
    } else {
      setShowOtherBusinessType(false);
      setFormData((prev) => ({ ...prev, businessType: name }));
    }
    setSubIndustry(industryData[index].sub);
  };

  const handleCountryCodeChange = (id, name) => {
    const country = countryCodeList.find((c) => c.name === name);
    if (country) {
      setSelectedCountryCode({
        name: country.name,
        dial_code: country.dial_code,
        label: country.dial_code,
      });
    }
  };

  const handleSubIndustryChange = (id, name) => {
    setSelectedSubIndustry({ id, name });

    if (name === "Other") {
      setShowOtherSubBusinessType(true);
      setFormData((prev) => ({ ...prev, businessSubType: "" }));
    } else {
      setShowOtherSubBusinessType(false);
      setFormData((prev) => ({ ...prev, businessSubType: name }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const combinedContact = `${selectedCountryCode?.dial_code || ""}${
      formData.contactNumber || ""
    }`;
    const payload = { ...formData, contactNumber: combinedContact };
    const validationErrors = await validate(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(payload);
  }

  useEffect(() => {
    if (response && !error) {
      successMsg(response.message);
      setFormData(addMerchant);
    }
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
          <p className={styles.eyebrow}>Merchant Management</p>
          <h2 className={styles.title}>Add Merchant</h2>
          <p className={styles.subtitle}>
            Register a new merchant with business and account details.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <Label htmlFor="name" label="Name" required={true} />
              <input
                type="text"
                name="fullName"
                id="name"
                placeholder="Enter name"
                className="forminput"
                onChange={handleChange}
                value={formData.fullName}
                autoComplete="off"
              />
              {renderError("fullName")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="username"
                label="Username/Email Id"
                required={true}
              />
              <input
                type="text"
                name="userId"
                id="username"
                placeholder="Enter username/Email Id"
                className="forminput"
                value={formData.userId}
                onChange={handleChange}
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
                htmlFor="businessname"
                label="Business Name"
                required={true}
              />
              <input
                type="text"
                name="businessName"
                id="businessname"
                placeholder="Enter Business name"
                className="forminput"
                onChange={handleChange}
                value={formData.businessName}
                autoComplete="off"
              />
              {renderError("businessName")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="phonenumber"
                label="Phone Number"
                required={true}
              />
              <div className={styles.phoneRow}>
                <div className={styles.countryCode}>
                  <Dropdown
                    initialLabel="Country Code"
                    selectedValue={selectedCountryCode}
                    options={filteredCountryCodes}
                    onChange={handleCountryCodeChange}
                    id="code"
                    value="name"
                    search={true}
                    onSearch={(id, value) => {
                      const filtered = countryCodeList.filter((c) =>
                        c.name.toLowerCase().includes(value.toLowerCase())
                      );
                      setFilteredCountryCodes(filtered);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="contactNumber"
                  id="phonenumber"
                  placeholder="Enter Phone number"
                  className="forminput"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {renderError("contactNumber")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="businessType"
                label="Business Type"
                required={true}
              />
              <Dropdown
                initialLabel="Select Business Type"
                selectedValue={selectedIndustry}
                options={industryData}
                onChange={handleIndustryChange}
                id="id"
                value="name"
              />
              {renderError("businessType")}
            </div>

            <div className={styles.field}>
              <Label
                htmlFor="subBusinessType"
                label="Sub Industry"
                required={true}
              />
              <Dropdown
                initialLabel="Select Sub Industry"
                selectedValue={selectedSubIndustry}
                options={subIndusry}
                onChange={handleSubIndustryChange}
                id="id"
                value="name"
              />
              {renderError("businessSubType")}
            </div>

            {showOtherBusinessType && (
              <div className={styles.field}>
                <Label
                  htmlFor="otherBusinessType"
                  label="Other Business Type"
                />
                <input
                  type="text"
                  name="businessType"
                  id="otherBusinessType"
                  placeholder="Enter Other Business Type"
                  className="forminput"
                  value={formData.businessType}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {renderError("businessType")}
              </div>
            )}

            {showOtherSubBusinessType && (
              <div className={styles.field}>
                <Label
                  htmlFor="otherSubBusinessType"
                  label="Other Sub Business Type"
                />
                <input
                  type="text"
                  name="businessSubType"
                  id="otherSubBusinessType"
                  placeholder="Enter Other Sub Business Type"
                  className="forminput"
                  value={formData.businessSubType}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {renderError("businessSubType")}
              </div>
            )}

            <div className={styles.field}>
              <Label htmlFor="pan" label="PAN/SSN" />
              <input
                type="text"
                name="panSsn"
                id="pan"
                placeholder="Enter PAN Number"
                className="forminput"
                value={formData.panSsn}
                onChange={handleChange}
                autoComplete="off"
              />
              <InfoLabel content="All letters must be uppercase" />
              {renderError("panSsn")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="gst" label="GST/VAT" />
              <input
                type="text"
                name="gstVat"
                id="gst"
                placeholder="Enter GST Number"
                className="forminput"
                value={formData.gstVat}
                onChange={handleChange}
                autoComplete="off"
              />
              <InfoLabel content="All letters must be uppercase" />
              {renderError("gstVat")}
            </div>

            <div className={styles.field}>
              <Label htmlFor="website" label="Website" />
              <input
                type="text"
                name="website"
                id="website"
                placeholder="Enter website url(www.example.com)"
                className="forminput"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
              />
              {renderError("website")}
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
                  setFormData(addMerchant);
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
