// Form validation
export const validate = async (data, isAdmin) => {
  let validationErrors = {};

  if (!data.appKey && isAdmin) {
    validationErrors.merchantId = "Merchant is required";
  }

  if (!data.orderId) {
    validationErrors.orderId = "Order ID is required";
  }
  if (!data.transferMode) {
    validationErrors.transferMode = "Transfer Mode is required";
  }
  if (!data.currencyCode) {
    validationErrors.currencyCode = "Currency is required";
  }
  if (!data.countryCode) {
    validationErrors.countryCode = "Country is required";
  }
  // if (!data.account) {
  //   validationErrors.account = "Account number is required";
  // }

  if (!data.amount) {
    validationErrors.amount = "Amount is required";
  } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
    validationErrors.amount = "Please enter a valid amount";
  }
  if (!data.contactNumber) {
    validationErrors.contactNumber = "Contact number is required";
  } else if (!/^\d{10}$/.test(data.contactNumber)) {
    validationErrors.contactNumber = "Contact number must be 10 digits";
  }
  if (!data.email) {
    validationErrors.email = "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
  ) {
    validationErrors.email = "Email is not valid";
  }

  if (data.transferMode !== "MOM") {
    if (!data.beneficiaryAccount && !data.vpaAddress) {
      validationErrors.beneficiaryAccount =
        "Either account number or Virtual Payment Address is required";
    } else if (
      isNaN(data.beneficiaryAccount) ||
      parseFloat(data.beneficiaryAccount) <= 0
    ) {
      validationErrors.beneficiaryAccount =
        "Please enter a valid account number";
    }
  }

  // Single transfer specific validation is handled within the SingleTransfer component
  // Bulk transfer specific validation is handled within the BulkTransfer component

  return validationErrors;
};
