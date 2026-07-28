"use client";
import { addMopType } from "@/app/formBuilder/settings";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddMopTypeFormValidations";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.settings.mop
  );
  const [formData, setFormData] = useState(addMopType);
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
        successMsg(response?.data.message || "MOP Type added successfully");
        setFormData(addMopType);
        formRef.current.reset();
      }
    }
  }, [response, error]);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="mopTypeName" label="MOP Name" required={true} />
            <input
              type="text"
              name="mopTypeName"
              id="mopTypeName"
              placeholder="Enter mop name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.mopTypeName}
            />
            {errors.mopTypeName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.mopTypeName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <Label htmlFor="mopTypeCode" label="MOP Code" required={true} />
            <input
              type="text"
              name="mopTypeCode"
              id="mopTypeCode"
              placeholder="Enter MOP code"
              className="forminput"
              onChange={handleChange}
              maxLength={10}
              value={formData.mopTypeCode}
            />
            {errors.mopTypeCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.mopTypeCode}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between  gap-2 mt-2 mb-2">
          <button type="button" className="back" onClick={() => router.back()}>
            Back
          </button>
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
                setFormData(addMopType);
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
