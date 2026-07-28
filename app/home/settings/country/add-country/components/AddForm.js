"use client";
import Label from "@/app/ui/label/Label";
import { useEffect, useRef, useState } from "react";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import Link from "next/link";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { addCountry } from "@/app/formBuilder/settings";
import { validate } from "@/app/validations/forms/AddCountryValidation";
import { useRouter } from "next/navigation";
import { successMsg } from "@/app/services/notify";
const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.settings.country,
  );
  const [formData, setFormData] = useState(addCountry);
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
    await postData(formData);
  }
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        setFormData(addCountry);
        formRef.current.reset();
      }
    }
  }, [response, error]);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="countryName" label="Country Name" required={true} />
            <input
              type="text"
              name="countryName"
              id="countryName"
              placeholder="Enter country name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.countryName}
            />
            {errors.countryName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.countryName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="countryCapital"
              label="Country capital"
              required={true}
            />
            <input
              type="text"
              name="countryCapital"
              id="countryCapital"
              placeholder="Enter capital"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={formData.countryCapital}
            />
            {errors.countryCapital && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.countryCapital}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="countryCode" label="Country Code" required={true} />
            <input
              type="text"
              name="countryCode"
              id="countryCode"
              placeholder="Enter country code"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={formData.countryCode}
            />
            {errors.countryCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.countryCode}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="countryNumericCode"
              label="Numeric Code"
              required={true}
            />
            <input
              type="text"
              name="countryNumericCode"
              id="countryNumericCode"
              placeholder="Enter numeric code(example=91)"
              className="forminput"
              onChange={handleChange}
              value={formData.countryNumericCode}
            />
            <Link href="https://www.att.com/support_media/images/pdf/Country_Code_List.pdf">
              <InfoLabel content="Refer pdf  for country code" />
            </Link>
            {errors.countryNumericCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.countryNumericCode}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="countryPhoneCode"
              label="Phone Code"
              required={true}
            />
            <input
              type="text"
              name="countryPhoneCode"
              id="countryPhoneCode"
              placeholder="Enter phone code(example=+91)"
              className="forminput"
              onChange={handleChange}
              value={formData.countryPhoneCode}
            />
            <Link href="https://en.wikipedia.org/wiki/List_of_country_calling_codes">
              <InfoLabel content="Refer this for region,subregion and calling code" />
            </Link>
            {errors.countryPhoneCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.countryPhoneCode}
              </small>
            )}
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
