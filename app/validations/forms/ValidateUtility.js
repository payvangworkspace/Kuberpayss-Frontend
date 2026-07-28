// Form validation
export const validateUtility = async (data, isAdmin) => {
  let validationErrors = {};

  if (!data.appKey && isAdmin) {
    validationErrors.merchantId = "Merchant is required";
  }
  if (!data.transactionRef) {
    validationErrors.transactionRef = "Order ID is required";
  }
  if (!data.account) {
    validationErrors.account = "Account number is required";
  }
  return validationErrors;
};

export const validateWaterUtility = async (data, isAdmin) => {
  let validationErrors = {};

  if (!data.appKey && isAdmin) {
    validationErrors.merchantId = "Merchant is required";
  }
  if (!data.transactionRef) {
    validationErrors.transactionRef = "Order ID is required";
  }
  if (!data.account) {
    validationErrors.account = "Account number is required";
  }
  if (!data.location) {
    validationErrors.location = "Location is required";
  }
  return validationErrors;
};
