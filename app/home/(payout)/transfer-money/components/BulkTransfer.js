"use client";
import { useState } from "react";
import Label from "@/app/ui/label/Label";

const BulkTransfer = ({ beneficiaries, onBeneficiariesChange, errors }) => {
  // State for new beneficiary form
  const [newBeneficiary, setNewBeneficiary] = useState({
    beneficiaryName: "",
    contactNumber: "",
    email: "",
    paymentMode: "bank",
    beneficiaryAccount: "",
    beneficiaryIFSCCode: "",
    vpaAddress: "",
    amount: "",
    remark: "",
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  // Handle input change for new beneficiary form
  const handleChange = (e) => {
    setNewBeneficiary({
      ...newBeneficiary,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  // Handle payment mode change
  const handlePaymentModeChange = (mode) => {
    setNewBeneficiary({
      ...newBeneficiary,
      paymentMode: mode,
      beneficiaryAccount:
        mode === "vpa" ? "" : newBeneficiary.beneficiaryAccount,
      beneficiaryIFSCCode:
        mode === "vpa" ? "" : newBeneficiary.beneficiaryIFSCCode,
      vpaAddress: mode === "bank" ? "" : newBeneficiary.vpaAddress,
    });
  };

  // Validate beneficiary form
  const validateBeneficiary = (data) => {
    const errors = {};

    if (!data.beneficiaryName) {
      errors.beneficiaryName = "Beneficiary name is required";
    }

    if (!data.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }

    if (data.paymentMode === "bank") {
      if (!data.beneficiaryAccount) {
        errors.beneficiaryAccount = "Account number is required";
      }
      if (!data.beneficiaryIFSCCode) {
        errors.beneficiaryIFSCCode = "Bank code is required";
      }
    } else {
      if (!data.vpaAddress) {
        errors.vpaAddress = "Virtual Payment Address is required";
      }
    }

    return errors;
  };

  // Add new beneficiary to the list
  const addBeneficiary = () => {
    // Validate new beneficiary
    const validationErrors = validateBeneficiary(newBeneficiary);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    // Add beneficiary to the list
    const updatedBeneficiaries = [
      ...beneficiaries,
      {
        ...newBeneficiary,
        id: Date.now().toString(), // Generate unique ID for the beneficiary
      },
    ];
    onBeneficiariesChange(updatedBeneficiaries);

    // Reset form
    setNewBeneficiary({
      beneficiaryName: "",
      contactNumber: "",
      email: "",
      paymentMode: "bank",
      beneficiaryAccount: "",
      beneficiaryIFSCCode: "",
      vpaAddress: "",
      amount: "",
      remark: "",
    });
    setFormErrors({});
  };

  // Remove beneficiary from the list
  const removeBeneficiary = (id) => {
    const updatedBeneficiaries = beneficiaries.filter(
      (beneficiary) => beneficiary.id !== id,
    );
    onBeneficiariesChange(updatedBeneficiaries);
  };

  return (
    <div className="bulk-transfer-container">
      {/* Beneficiary Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Add Beneficiary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label
                    htmlFor="beneficiaryName"
                    label="Beneficiary Name"
                    required={true}
                  />
                  <input
                    type="text"
                    name="beneficiaryName"
                    id="beneficiaryName"
                    placeholder="Enter Beneficiary Name"
                    className="forminput"
                    value={newBeneficiary.beneficiaryName}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {formErrors.beneficiaryName && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {formErrors.beneficiaryName}
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="amount" label="Amount" required={true} />
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="Enter Amount"
                    className="forminput"
                    value={newBeneficiary.amount}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {formErrors.amount && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {formErrors.amount}
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="contactNumber" label="Contact Number" />
                  <input
                    type="text"
                    name="contactNumber"
                    id="contactNumber"
                    placeholder="Enter Contact Number"
                    className="forminput"
                    value={newBeneficiary.contactNumber}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="email" label="Email" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    className="forminput"
                    value={newBeneficiary.email}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label label="Payment Mode" required={true} />
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMode"
                        id="bankTransfer"
                        value="bank"
                        checked={newBeneficiary.paymentMode === "bank"}
                        onChange={() => handlePaymentModeChange("bank")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="bankTransfer"
                      >
                        Bank Transfer
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMode"
                        id="vpaTransfer"
                        value="vpa"
                        checked={newBeneficiary.paymentMode === "vpa"}
                        onChange={() => handlePaymentModeChange("vpa")}
                      />
                      <label className="form-check-label" htmlFor="vpaTransfer">
                        UPI/Virtual Payment Address
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Label htmlFor="remark" label="Remark" />
                  <input
                    type="text"
                    name="remark"
                    id="remark"
                    placeholder="Enter Remark"
                    className="forminput"
                    value={newBeneficiary.remark}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                {newBeneficiary.paymentMode === "bank" ? (
                  <>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Label
                        htmlFor="beneficiaryAccount"
                        label="Account Number"
                        required={true}
                      />
                      <input
                        type="text"
                        name="beneficiaryAccount"
                        id="beneficiaryAccount"
                        placeholder="Enter Account Number"
                        className="forminput"
                        value={newBeneficiary.beneficiaryAccount}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      {formErrors.beneficiaryAccount && (
                        <small className="text-danger">
                          <span className="text-danger"> *</span>
                          {formErrors.beneficiaryAccount}
                        </small>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Label
                        htmlFor="beneficiaryIFSCCode"
                        label="IFSC Code"
                        required={true}
                      />
                      <input
                        type="text"
                        name="beneficiaryIFSCCode"
                        id="beneficiaryIFSCCode"
                        placeholder="Enter IFSC Code"
                        className="forminput"
                        value={newBeneficiary.beneficiaryIFSCCode}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      {formErrors.beneficiaryIFSCCode && (
                        <small className="text-danger">
                          <span className="text-danger"> *</span>
                          {formErrors.beneficiaryIFSCCode}
                        </small>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Label
                      htmlFor="vpaAddress"
                      label="Virtual Payment Address (UPI ID)"
                      required={true}
                    />
                    <input
                      type="text"
                      name="vpaAddress"
                      id="vpaAddress"
                      placeholder="Enter Virtual Payment Address/UPI ID"
                      className="forminput"
                      value={newBeneficiary.vpaAddress}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    {formErrors.vpaAddress && (
                      <small className="text-danger">
                        <span className="text-danger"> *</span>
                        {formErrors.vpaAddress}
                      </small>
                    )}
                  </div>
                )}
              </div>
              <div className="row mt-3">
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addBeneficiary}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiary List */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Beneficiary List</h5>
            </div>
            <div className="card-body">
              {beneficiaries.length === 0 ? (
                <div className="text-center p-3">
                  <p className="mb-0 text-muted">No beneficiaries added yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Payment Type</th>
                        <th>Account/Virtual Payment Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiaries.map((beneficiary, index) => (
                        <tr key={beneficiary.id}>
                          <td>{index + 1}</td>
                          <td>{beneficiary.beneficiaryName}</td>
                          <td>₹ {parseFloat(beneficiary.amount).toFixed(2)}</td>
                          <td>
                            {beneficiary.paymentMode === "bank"
                              ? "Bank Transfer"
                              : "UPI/Virtual Payment Address"}
                          </td>
                          <td>
                            {beneficiary.paymentMode === "bank"
                              ? beneficiary.beneficiaryAccount
                              : beneficiary.vpaAddress}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeBeneficiary(beneficiary.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total Amount */}
              {beneficiaries.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                  <div className="p-2 border rounded">
                    <strong>Total Amount: </strong>₹{" "}
                    {beneficiaries
                      .reduce((sum, beneficiary) => {
                        return sum + parseFloat(beneficiary.amount || 0);
                      }, 0)
                      .toFixed(2)}
                  </div>
                </div>
              )}

              {errors.beneficiaries && (
                <small className="text-danger d-block mt-2">
                  <span className="text-danger"> *</span>
                  {errors.beneficiaries}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Options */}
      {beneficiaries.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Bulk Options</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onBeneficiariesChange([])}
                  >
                    Clear All Beneficiaries
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTransfer;
