"use client";

import { countryCodes } from "@/app/utils/countryCodes";
import { addMerchant } from "@/app/formBuilder/merchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./SignupForm.module.css";
import { validate } from "@/app/validations/forms/AddMerchantFormValidation";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Button from "@/app/ui/button/Button";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { industryData } from "@/app/home/user-management/merchants/components/Columns";

const SignupForm = () => {
  const { postData, loading, error, response } = usePostRequest(
    endPoints.auth.signup
  );
  const router = useRouter();
  const [formData, setFormData] = useState(addMerchant);
  const [errors, setErrors] = useState({});
  const [selectedIndustry, setSelectedIndustry] = useState({
    id: "",
    name: "Select Industry",
  });
  const [subIndusry, setSubIndustry] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubIndustry, setSelectedSubIndustry] = useState({
    id: "",
    name: "Select Sub Industry",
  });

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

  const [showOtherBusinessType, setShowOtherBusinessType] = useState(false);
  const [showOtherSubBusinessType, setShowOtherSubBusinessType] =
    useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const finalFormData = {
      ...formData,
      contactNumber: `${selectedCountryCode.dial_code}${formData.contactNumber}`,
    };
    await postData(finalFormData);
  }

  useEffect(() => {
    if (response && !error) {
      setFormData(addMerchant);
      router.push("/login");
    }
  }, [response, error, router]);

  return (
    <div className={styles.formPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create Merchant Account</h2>
        <p className={styles.subtitle}>
          Register your business to start accepting payments.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <Label
              htmlFor="name"
              label="Name"
              required={true}
              className="login"
            />
            <Input
              type="text"
              name="fullName"
              id="name"
              placeholder="Enter name"
              className="forminput"
              onChange={handleChange}
              value={formData.fullName}
              autoComplete="off"
            />
            {errors.fullName && (
              <small className={styles.errorText}>*{errors.fullName}</small>
            )}
          </div>
          <div className={styles.field}>
            <Label
              htmlFor="username"
              label="Username/Email Id"
              required={true}
              className="login"
            />
            <Input
              type="text"
              name="userId"
              id="username"
              placeholder="Enter username/Email Id"
              className="forminput"
              value={formData.userId}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.userId && (
              <small className={styles.errorText}>*{errors.userId}</small>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Label
              htmlFor="businessname"
              label="Business Name"
              required={true}
              className="login"
            />
            <Input
              type="text"
              name="businessName"
              id="businessname"
              placeholder="Enter Business name"
              className="forminput"
              onChange={handleChange}
              value={formData.businessName}
              autoComplete="off"
            />
            {errors.businessName && (
              <small className={styles.errorText}>*{errors.businessName}</small>
            )}
          </div>
          <div className={styles.field}>
            <Label
              htmlFor="phonenumber"
              label="Phone Number"
              className="login"
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
              <Input
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
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Label
              htmlFor="industry"
              label="Industry Type"
              required={true}
              className="login"
            />
            <Dropdown
              initialLabel="Select Industry"
              selectedValue={selectedIndustry}
              options={industryData}
              onChange={handleIndustryChange}
              id="id"
              value="name"
            />
          </div>
          <div className={styles.field}>
            <Label
              htmlFor="subindustry"
              label="Sub Industry"
              className="login"
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
          </div>
        </div>

        {(showOtherBusinessType || showOtherSubBusinessType) && (
          <div className={styles.row}>
            {showOtherBusinessType && (
              <div className={styles.field}>
                <Label
                  htmlFor="businessType"
                  label="Business Type"
                  required={true}
                  className="login"
                />
                <Input
                  type="text"
                  name="businessType"
                  id="businessType"
                  placeholder="Enter Business Type"
                  className="forminput"
                  value={formData.businessType}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            )}
            {showOtherSubBusinessType && (
              <div className={styles.field}>
                <Label
                  htmlFor="businessSubType"
                  label="Business Sub Type"
                  required={true}
                  className="login"
                />
                <Input
                  type="text"
                  name="businessSubType"
                  id="businessSubType"
                  placeholder="Enter Business Sub Type"
                  className="forminput"
                  value={formData.businessSubType}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.row}>
          <div className={styles.field}>
            <Label htmlFor="website" label="Website" className="login" />
            <Input
              type="text"
              name="website"
              id="website"
              placeholder="www.example.com"
              className="forminput"
              value={formData.website}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.website && (
              <small className={styles.errorText}>*{errors.website}</small>
            )}
          </div>
          <div className={styles.field}>
            <Label
              htmlFor="password"
              label="Password"
              required={true}
              className="login"
            />
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
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} ${styles.eyeIcon}`}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-hidden="true"
              />
            </div>
            {errors.password && (
              <small className={styles.errorText}>*{errors.password}</small>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <Label
              htmlFor="reference"
              label="Reference (Optional)"
              className="login"
            />
            <Input
              type="text"
              name="reference"
              id="reference"
              placeholder="Enter Reference"
              className="forminput"
              value={formData.reference}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            label={loading ? "Loading..." : "Create Account"}
            type="submit"
            className="login"
            disabled={loading}
          />
          <p className={styles.signupPrompt}>
            Already have an account?{" "}
            <Link href="/login" className={styles.signupLink}>
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
