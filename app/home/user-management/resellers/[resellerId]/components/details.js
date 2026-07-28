"use client";
import { addMapMerchant } from "@/app/formBuilder/reseller";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import MapMerchantList from "./mapMerchantList";
import useMerchant from "@/app/hooks/useMerchant";
import { decryptParams } from "@/app/utils/decryptions";
import { successMsg } from "@/app/services/notify";
import ResellerDetails from "./ResellerDetails";

export default function Details({
  merchantRole,
  adminRole,
  resellerRole,
  userEmail,
}) {
  console.log("🚀 ~ Details ~ userEmail:", userEmail);
  const param = useParams();
  const router = useRouter();
  const formRef = useRef(null);
  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();

  const { loading, error, response, postData } = usePostRequest(
    endPoints.settings.mapMerchant
  );
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedMerchant.id)
      setFormData(() =>
        addMapMerchant(selectedMerchant, decryptParams(param.resellerId))
      );
  }, [selectedMerchant.id]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "radio") {
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    } else if (name === "vendorCharge") {
      const validValue = /^[0-9]*\.?[0-9]*$/;
      setFormData({
        ...formData,
        [name]: validValue.test(value) ? value : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = await validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    await postData(formData);
  };

  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response?.data.message || "Map merchant added successfully");
        router.refresh();
        setFormData(addMapMerchant);
        formRef.current.reset();
      }
    }
  }, [response, error]);

  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Error loading data"}
      </p>
    );
  return (
    <>
      {adminRole && formData && (
        <>
          <div className={styles.mainCard}>
            <h5>Map Merchant</h5>
            <form onSubmit={handleSubmit} ref={formRef}>
              <div className="row">
                <div className="col-md-6 col-sm-12 mb-3">
                  <Label htmlFor="merchant" label="Merchant" required={true} />
                  <Dropdown
                    initialLabel="Select Merchant"
                    selectedValue={selectedMerchant}
                    options={merchantList?.data?.data}
                    onChange={handleMerchantChange}
                    id="userId"
                    value="fullName"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <Label
                    htmlFor="fixedCharge"
                    label="Fixed Vender charge"
                    required={true}
                  />

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        name="fixCharge"
                        id="fixCharge"
                        className="form-check-input"
                        onChange={handleChange}
                        value={true}
                      />
                      <Label
                        htmlFor="fixedChargeYes"
                        label="Yes"
                        className="form-check-label"
                      />
                    </div>
                    <span className="mx-3"></span>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="fixCharge"
                        id="fixCharge"
                        className="form-check-input"
                        onChange={handleChange}
                        value={false}
                      />
                      <Label
                        htmlFor="fixedChargeNo"
                        label="No"
                        className="form-check-label"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <Label
                    htmlFor="vendorCharge"
                    label={`Enter Vender Charge ${
                      formData?.fixCharge ? "Amount" : "Percentage"
                    }`}
                    required={true}
                  />
                  <input
                    type="text"
                    name="vendorCharge"
                    id="vendorCharge"
                    placeholder="Enter vendor charge"
                    className="forminput"
                    onChange={handleChange}
                    maxLength={256}
                    value={formData?.vendorCharge}
                  />
                  {errors.vendorCharge && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {errors.vendorCharge}
                    </small>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
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
                      setFormData(() =>
                        addMapMerchant({ id: "", name: "" }, "")
                      );
                    }}
                  >
                    Clear
                  </button>
                </span>
                <button
                  type="button"
                  className="back"
                  onClick={() => router.back()}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
          <MapMerchantList userId={decryptParams(param.resellerId)} />
        </>
      )}
      {resellerRole && <ResellerDetails userEmail={userEmail} />}
    </>
  );
}
