export const validate = async (data, isAdmin) => {
  let validationErrors = {};

  if (!data.userId && isAdmin) {
    validationErrors.merchantId = "Merchant is required";
  }

  if (!data.currencyId) {
    validationErrors.currencyCode = "Currency is required";
  }

  if (!data.amount) {
    validationErrors.amount = "Amount is required";
  } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
    validationErrors.amount = "Please enter a valid amount";
  }

  if (!data.receiptId) {
    validationErrors.receiptId = "Receipt ID is required";
  }

  return validationErrors;
};