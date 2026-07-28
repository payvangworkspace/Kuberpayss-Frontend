import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { updateBusinessDetails } from "@/app/formBuilder/account";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { useParams } from "next/navigation";
import usePutRequest from "@/app/hooks/usePut";
import { validate } from "@/app/validations/forms/UpdateBusinessDetailsFormValidation";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({
  merchant,
  id,
  businessId,
  onClick,
  onSuccess,
  responseBusiness,
  role,
}) => {
  // console.log("buine");
  const formRef = useRef(null);
  const param = useParams();
  const { putData, error, response } = usePutRequest(endPoints.users.business);
  // form json state data
  const [formData, setFormData] = useState(
    updateBusinessDetails(responseBusiness, param)
  );

  useEffect(() => {
    if (responseBusiness?.length) {
      // pick first item OR match by id
      const business =
        responseBusiness.find((item) => item?.merchantId === id) ||
        responseBusiness[0];

      setFormData(updateBusinessDetails(business, param));
    }
  }, [responseBusiness, id, param]);
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const validationErrors = validate(formData);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   // console.log("formdata", formData);
  //   await putData(formData);
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...responseBusiness,
      ...formData,
    };

    await putData(payload);
  };
  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message);
      onSuccess();
      onClick();
    }
  }, [response, error]);

  return (
    <div className="overlay">
      <h6>Update Business Details</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label
              htmlFor="businessName"
              label="Business Name"
              required={true}
            />
            <input
              type="text"
              name="businessName"
              id="businessName"
              placeholder="Enter Business Name"
              className="forminput"
              value={formData.businessName}
              onChange={handleChange}
            />
            {errors.businessName && (
              <small>
                <span className="text-danger"> *</span>
                {errors.businessName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="companyRegistrationNo" label="Registration No" />
            <input
              type="text"
              name="companyRegistrationNo"
              id="companyRegistrationNo"
              placeholder="Enter Company Registration"
              className="forminput"
              value={formData.companyRegistrationNo}
              onChange={handleChange}
            />
            {errors.companyRegistrationNo && (
              <small>
                <span className="text-danger"> *</span>
                {errors.companyRegistrationNo}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="businessEmail" label="Email ID" required={true} />
            <input
              type="text"
              name="businessEmail"
              id="businessEmail"
              placeholder="Enter Company Email ID"
              className="forminput"
              value={formData.businessEmail}
              onChange={handleChange}
            />
            {errors.businessEmail && (
              <small>
                <span className="text-danger"> *</span>
                {errors.businessEmail}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="phone"
              label="Company Contact Number"
              required={true}
            />
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter Company Contact Number"
              className="forminput"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <small>
                <span className="text-danger"> *</span>
                {errors.phone}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="websiteUrl" label="Website URL" required={true} />
            <input
              type="text"
              name="websiteUrl"
              id="websiteUrl"
              placeholder="Enter Website URL"
              className="forminput"
              value={formData.websiteUrl}
              onChange={handleChange}
            />
            {errors.websiteUrl && (
              <small>
                <span className="text-danger"> *</span>
                {errors.websiteUrl}
              </small>
            )}
          </div>
          <div className="col-md-12 col-sm-12 mb-2">
            <Label
              htmlFor="businessAddress"
              label="Address Detail"
              required={true}
            />
            <textarea
              rows={5}
              name="businessAddress"
              id="businessAddress"
              placeholder="Enter full Address"
              className="forminput"
              value={formData.businessAddress}
              onChange={handleChange}
            />
            {errors.businessAddress && (
              <small>
                <span className="text-danger"> *</span>
                {errors.businessAddress}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="panSsn" label="PAN/SSN" />
            <input
              type="text"
              name="panSsn"
              id="panSsn"
              placeholder="Enter PAN/SSN"
              className="forminput"
              value={formData.panSsn}
              onChange={handleChange}
            />
            {errors.panSsn && (
              <small>
                <span className="text-danger"> *</span>
                {errors.panSsn}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="gstVat" label="GST/VAT" />
            <input
              type="text"
              name="gstVat"
              id="gstVat"
              placeholder="Enter GST/VAT"
              className="forminput"
              value={formData.gstVat}
              onChange={handleChange}
            />
            {errors.gstVat && (
              <small>
                <span className="text-danger"> *</span>
                {errors.gstVat}
              </small>
            )}
          </div>
          <>
            {role && (
              <>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label
                    htmlFor="setupIntegrationFees"
                    label="Integration Fee"
                  />
                  <input
                    type="text"
                    name="setupIntegrationFees"
                    id="setupIntegrationFees"
                    placeholder="Enter Integration Fee"
                    className="forminput"
                    value={formData.setupIntegrationFees}
                    onChange={handleChange}
                  />
                  {errors.setupIntegrationFees && (
                    <small>
                      <span className="text-danger"> *</span>
                      {errors.setupIntegrationFees}
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="wireTransferFees" label="Web Transfer Fee" />
                  <input
                    type="text"
                    name="wireTransferFees"
                    id="wireTransferFees"
                    placeholder="Enter Web Transfer Fee"
                    className="forminput"
                    value={formData.wireTransferFees}
                    onChange={handleChange}
                  />
                  {errors.wireTransferFees && (
                    <small>
                      <span className="text-danger"> *</span>
                      {errors.wireTransferFees}
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="settlementFees" label="Settlement Fee" />
                  <input
                    type="text"
                    name="settlementFees"
                    id="settlementFees"
                    placeholder="Enter Settlement Fee"
                    className="forminput"
                    value={formData.settlementFees}
                    onChange={handleChange}
                  />
                  {errors.settlementFees && (
                    <small>
                      <span className="text-danger"> *</span>
                      {errors.settlementFees}
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label
                    htmlFor="minimumSettlementAmount"
                    label="Min Settlement Fee"
                  />
                  <input
                    type="text"
                    name="minimumSettlementAmount"
                    id="minimumSettlementAmount"
                    placeholder="Enter Min Settlement Fee"
                    className="forminput"
                    value={formData.minimumSettlementAmount}
                    onChange={handleChange}
                  />
                  {errors.minimumSettlementAmount && (
                    <small>
                      <span className="text-danger"> *</span>
                      {errors.minimumSettlementAmount}
                    </small>
                  )}
                </div>
              </>
            )}
          </>
        </div>

        <div className="d-flex mt-4">
          <button type="submit" form="add">
            Update
          </button>
          <span className="mx-2"></span>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const UpdateBusiness = ({
  name,
  id,
  onClose,
  onSuccess,
  responseBusiness,
  role,
  businessId,
}) => {
  console.log("first", businessId);
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
          responseBusiness={responseBusiness}
          role={role}
          businessId={businessId}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UpdateBusiness;
