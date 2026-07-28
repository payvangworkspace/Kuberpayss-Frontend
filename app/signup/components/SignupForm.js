"use client";

import { countryCodes } from "@/app/utils/countryCodes";
import { addMerchant } from "@/app/formBuilder/merchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../login/components/login-form/LoginForm.module.css";
import Title from "@/app/ui/headings/Title";
import { validate } from "@/app/validations/forms/AddMerchantFormValidation";
import { successMsg } from "@/app/services/notify";
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
  // form json state data
  const [formData, setFormData] = useState(addMerchant);
  // State to handle errors on form submission
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

  // handle input change
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

  // handle input change
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
  }, [response, error]);
  return (
    <div className={styles.signup}>
      <Title label="Create Merchant Account" className="login" />

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.fullName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
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
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.userId}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.businessName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="phonenumber"
              label="Phone Number"
              className="login"
            />
            <div className="d-flex gap-2">
              <div style={{ width: "100px" }}>
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
            {/* {errors.contactNumber && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.contactNumber}
              </small>
            )} */}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
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
          <div className="col-md-6 col-sm-12 mb-2">
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

          {showOtherBusinessType && (
            <div className="col-md-6 col-sm-12 mb-2">
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
            <div className="col-md-6 col-sm-12 mb-2">
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
        {/* <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="pan"
              label="PAN/SSN"
              required={true}
              className="login"
            />
            <Input
              type="text"
              name="panSsn"
              id="pan"
              placeholder="Enter PAN Number"
              className="forminput"
              value={formData.panSsn}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.panSsn && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.panSsn}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="gst"
              label="GST/VAT"
              required={true}
              className="login"
            />
            <Input
              type="text"
              name="gstVat"
              id="gst"
              placeholder="Enter GST Number"
              className="forminput"
              value={formData.gstVat}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.gstVat && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.gstVat}
              </small>
            )}
          </div>
        </div> */}
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="website" label="Website" className="login" />
            <Input
              type="text"
              name="website"
              id="website"
              placeholder="Enter website url(www.example.com)"
              className="forminput"
              value={formData.website}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.website && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.website}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="password"
              label="Password"
              required={true}
              className="login"
            />

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
            {errors.password && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
        <div className="d-flex justify-content-between align-items-center gap-2 mt-3 mb-2">
          <span className="d-flex gap-2">
            <Button
              label={loading ? "Loading..." : "Create Account"}
              type="submit"
              className="login"
              disabled={loading}
            />
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
