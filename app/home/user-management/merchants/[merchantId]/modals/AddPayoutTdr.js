import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { payoutTdrMapping, priority } from "@/app/formBuilder/mapping";
import { successMsg } from "@/app/services/notify";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import { queryStringWithKeyword } from "@/app/services/queryString";
import useGetRequest from "@/app/hooks/useFetch";
import { validate } from "@/app/validations/forms/TdrSetupFormValidationPayout";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ merchant, id, onClick, onSuccess, acquirerId }) => {
  const formRef = useRef(null);
  const pgChargeRef = useRef(null);
  const bankChargeRef = useRef(null);
  const vendorChargeRef = useRef(null);
  const merchantChargeRef = useRef(null);

  // form json state data
  const [formData, setFormData] = useState(() => payoutTdrMapping(id));

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(0);

  // handling search keyword
  const [keyword, setKeyword] = useState({ acquirerId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  // Get acquirer list
  const {
    loading: acquirerLoading,
    error: acquirerError,
    response: acquirers = [],
    postData: getAllAcquirer,
  } = usePostRequest(endPoints.users.acquirerList);

  useEffect(() => {
    getAllAcquirer(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE
      )
    );
  }, [currentPage, keyword]);

  const [acquirer, setAcquirer] = useState({ id: "", name: "Select Acquirer" });

  // Get transfer modes
  const { response: transferModes = [], getData: getTransferModes } =
    useGetRequest();
  const [transferMode, setTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });

  // Get priority value
  const { getData: getPriority, response: priorityResponse } = useGetRequest();

  const handleAcquirerSelection = async (acquirerId, name) => {
    setAcquirer({ id: acquirerId, name });
    setFormData({ ...formData, ["acquirer"]: acquirerId });
    await getPriority(endPoints.payout.priority + "/" + id + "/" + acquirerId);
    getTransferModes(
      endPoints.payout.getTransferModeByAcquirer + "/" + acquirerId
    );
    setTransferMode({
      id: "",
      name: "Select Transfer Mode",
    });
  };

  // Set priority value when response is received
  useEffect(() => {
    if (priorityResponse?.data) {
      setFormData({
        ...formData,
        priority: priorityResponse.data.priority,
        amountLimit: priorityResponse.data.amountLimit,
      });
    }
  }, [priorityResponse, formData.acquirerId]);

  const handleTransferModeSelection = (transferModeId, name) => {
    setTransferMode({ id: transferModeId, name });
    setFormData({ ...formData, ["transferMode"]: transferModeId });
  };

  // Form submission API
  const { postData, error, response } = usePostRequest(
    endPoints.payout.merchantTdr
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value === "true" : value,
    });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };

  // Handle submission response
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        setFormData(() => payoutTdrMapping(id));
        setAcquirer({ id: "", name: "Select Acquirer" });
        setTransferMode({ id: "", name: "Select Transfer Mode" });
        successMsg(response.data.message);
        onSuccess();
        onClick();
      }
    }
  }, [response, error]);

  // get minimum amount limit

  const {
    postData: getMinimumAmountLimit,
    error: minimumAmountLimitError,
    response: minimumAmountLimitResponse,
    loading: minimumAmountLimitLoading,
  } = usePostRequest(endPoints.payout.getMinimumAmountLimit);

  useEffect(() => {
    if (formData.transferMode) {
      const data = {
        merchant: id,
        acquirer: formData.acquirer,
        transferMode: formData.transferMode,
        priority: formData.priority,
      };
      getMinimumAmountLimit(data);
    }
  }, [formData.transferMode]);

  useEffect(() => {
    if (minimumAmountLimitResponse?.data) {
      setFormData({
        ...formData,
        minimumAmountLimit: minimumAmountLimitResponse.data.data,
      });
    }
  }, [minimumAmountLimitResponse]);

  useEffect(() => {

    setFormData({
      ...formData,
      pgCharge:
        (formData.merchantCharge ?? 0) -
        (formData.bankCharge ?? 0) -
        (formData.vendorCharge ?? 0),
    });
  }, [formData.merchantCharge, formData.bankCharge, formData.vendorCharge]);

  return (
    <div className="overlay w-30">
      <h6>Add Payout TDR Setting</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="acquirerId" label="Acquirer" required={true} />
            <Dropdown
              initialLabel="Select Acquirer"
              selectedValue={acquirer}
              options={acquirers?.data?.data}
              onChange={handleAcquirerSelection}
              id="acquirerId"
              search={true}
              onSearch={handleKeyword}
              value="fullName"
            />
            {errors.acquirerId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.acquirerId}
              </small>
            )}
          </div>

          {formData.acquirer !== "" && (
            <>
              <div className="col-12 mb-2">
                <Label htmlFor="priority" label="Priority" required={true} />
                <input
                  type="text"
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  className="forminput"
                  readOnly
                  disabled
                  autoComplete="on"
                />
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="amountLimit"
                  label="Amount Limit (Daily)"
                  required={true}
                />
                <input
                  type="text"
                  name="amountLimit"
                  id="amountLimit"
                  value={formData.amountLimit}
                  onChange={handleChange}
                  className="forminput"
                  autoComplete="on"
                  placeholder="Enter Amount Limit"
                  readOnly
                  disabled
                />
                {errors.amountLimit && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.amountLimit}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="transferMode"
                  label="Transfer Mode"
                  required={true}
                />

                <Dropdown
                  initialLabel="Select Transfer Mode"
                  selectedValue={transferMode}
                  options={transferModes?.data?.map(
                    (item) => item?.transferMode
                  )}
                  onChange={handleTransferModeSelection}
                  id="transferModeCode"
                  value="transferModeName"
                />
                {errors.transferMode && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.transferMode}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="gstvat"
                  label="GST/VAT in percentage"
                  required={true}
                />
                <input
                  type="number"
                  name="gstVat"
                  id="gstvat"
                  placeholder="Enter GST/VAT in percentage"
                  className="forminput"
                  required
                  autoComplete="on"
                  onChange={handleChange}
                />
                {errors.gstVat && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.gstVat}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="isfixedcharge"
                  label="Fixed Charge"
                  required={true}
                />
                <br />
                <div className="d-flex gap-5">
                  <span className="d-flex align-items-center gap-2">
                    <Label htmlFor="isfixedcharge" label="Yes" />
                    <input
                      type="radio"
                      name="isFixCharge"
                      id="fixedcharges"
                      value={true}
                      onChange={handleChange}
                    />
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <Label htmlFor="isfixedcharge" label="No" />
                    <input
                      type="radio"
                      name="isFixCharge"
                      id="percentagecharges"
                      value={false}
                      onChange={handleChange}
                    />
                  </span>
                </div>
                {errors.isFixCharge && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.isFixCharge}
                  </small>
                )}
              </div>
            </>
          )}

          {formData.isFixCharge !== "" && (
            <>
              <div className="col-12 mb-2">
                <Label
                  htmlFor="merchantCharge"
                  label="Merchant Charges"
                  required={true}
                />
                <input
                  type="text"
                  name="merchantCharge"
                  id="merchantCharge"
                  placeholder="Enter Merchant charge"
                  className="forminput"
                  required
                  ref={merchantChargeRef}
                  value={formData.merchantCharge}
                  onChange={handleChange}
                />
                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter merchant charge amount"
                      : "Enter merchant charge percentage"
                  }
                />
                {errors.merchantCharge && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.merchantCharge}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="vendorCharge"
                  label="Vendor Charges (if any)"
                  required={false}
                />
                <input
                  type="text"
                  name="vendorCharge"
                  id="vendorCharge"
                  placeholder="Enter Vendor charge"
                  className="forminput"
                  ref={vendorChargeRef}
                  onChange={handleChange}
                />
                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter vendor charge amount"
                      : "Enter vendor charge percentage"
                  }
                />
                {errors.vendorCharge && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.vendorCharge}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="bankcharge"
                  label="Bank Charges"
                  required={true}
                />
                <input
                  type="text"
                  name="bankCharge"
                  id="bankcharge"
                  placeholder="Enter bank charge"
                  className="forminput"
                  required
                  ref={bankChargeRef}
                  onChange={handleChange}
                />
                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter bank charge amount"
                      : "Enter bank charge percentage"
                  }
                />
                {errors.bankCharge && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.bankCharge}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label htmlFor="pgCharge" label="PG Charges" required={true} />
                <input
                  type="text"
                  name="pgCharge"
                  id="pgCharge"
                  placeholder="Enter PG charge"
                  className="forminput"
                  required
                  ref={pgChargeRef}
                  onChange={handleChange}
                  value={formData.pgCharge}
                  readOnly
                  disabled
                />
                <InfoLabel
                  content={
                    formData.isFixCharge
                      ? "Enter PG charge amount"
                      : "Enter PG charge percentage"
                  }
                />
                {errors.pgCharge && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.pgCharge}
                  </small>
                )}
              </div>

              <div className="col-12 mb-2">
                <Label
                  htmlFor="minimumAmountLimit"
                  label="Minimum Amount Limit"
                  required={true}
                />
                <input
                  type="text"
                  name="minimumAmountLimit"
                  id="minimumAmountLimit"
                  placeholder="Enter min. amount limit"
                  className="forminput"
                  required
                  autoComplete="on"
                  onChange={handleChange}
                  value={formData.minimumAmountLimit}
                  readOnly={minimumAmountLimitResponse?.data?.data}
                  disabled={minimumAmountLimitResponse?.data?.data}
                />
                {errors.minimumAmountLimit && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.minimumAmountLimit}
                  </small>
                )}
              </div>

              <div className="col-12 mb-4">
                <Label
                  htmlFor="maximumAmountLimit"
                  label="Max Amount Limit"
                  required={true}
                />
                <input
                  type="text"
                  name="maximumAmountLimit"
                  id="maximumAmountLimit"
                  placeholder="Enter max. amount limit"
                  className="forminput"
                  required
                  autoComplete="on"
                  onChange={handleChange}
                />
                {errors.maximumAmountLimit && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.maximumAmountLimit}
                  </small>
                )}
              </div>
            </>
          )}
        </div>
        <div className="d-flex mt-2">
          <button type="submit" form="add">
            Add
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};

const AddPayoutTdr = ({ name, id, onClose, onSuccess, acquirerId }) => {
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
          acquirerId={acquirerId}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddPayoutTdr;
