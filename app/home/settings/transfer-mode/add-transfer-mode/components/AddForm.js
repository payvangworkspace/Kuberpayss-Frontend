"use client";
import { addTransferMode } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddTransferModeValidation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.settings.transferMode
  );
  const [formData, setFormData] = useState(addTransferMode);
  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    console.log("formData", formData);
    
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
        successMsg(
          response.data.message || "Transfer mode added successfully"
        );
        setFormData(addTransferMode);
        formRef.current.reset();
      }
    }
  }, [response, error]);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="transferModeName"
              label="Transfer mode Name"
              required={true}
            />
            <input
              type="text"
              name="transferModeName"
              id="transferModeName"
              placeholder="Enter transfer mode name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.transferModeName}
            />
            {errors.transferModeName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.transferModeName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="transferModeCode"
              label="transfer Mode Code"
              required={true}
            />
            <input
              type="text"
              name="transferModeCode"
              id="transferModeCode"
              placeholder="Enter transfer mode code"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              defaultValue={formData.transferModeCode}
            />
            {errors.transferModeCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.transferModeCode}
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
