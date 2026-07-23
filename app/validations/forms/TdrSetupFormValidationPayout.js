import { validateEmpty } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const {
    merchant,
    acquirer,
    transferMode,
    priority,
    amountLimit,
    gstVat,
    isFixCharge,
    merchantCharge,
    pgCharge,
    bankCharge,
    vendorCharge,
    minimumAmountLimit,
    maximumAmountLimit,
  } = data;

  // Validate empty fields
  errors.merchant = validateEmpty(merchant);
  errors.acquirer = validateEmpty(acquirer);
  errors.transferMode = validateEmpty(transferMode);
  errors.priority = validateEmpty(priority);
  errors.amountLimit = validateEmpty(amountLimit);
  errors.gstVat = validateEmpty(gstVat);
  errors.isFixCharge = validateEmpty(isFixCharge);
  errors.merchantCharge = validateEmpty(merchantCharge);
  errors.pgCharge = validateEmpty(pgCharge);
  errors.bankCharge = validateEmpty(bankCharge);
  errors.vendorCharge = validateEmpty(vendorCharge);
  errors.minimumAmountLimit = validateEmpty(minimumAmountLimit);
  errors.maximumAmountLimit = validateEmpty(maximumAmountLimit);
  // Validate number fields
  if (amountLimit && isNaN(amountLimit)) {
    errors.amountLimit = "Amount limit must be a number";
  }
  if (gstVat && isNaN(gstVat)) {
    errors.gstVat = "GST/VAT must be a number";
  }
  if (isFixCharge && isNaN(isFixCharge)) {
    errors.isFixCharge = "Is fix charge must be a number";
  }
  if (merchantCharge && isNaN(merchantCharge)) {
    errors.merchantCharge = "Merchant charge must be a number";
  }
  if (pgCharge && isNaN(pgCharge)) {
    errors.pgCharge = "PG charge must be a number";
  }
  if (bankCharge && isNaN(bankCharge)) {
    errors.bankCharge = "Bank charge must be a number";
  }
  if (vendorCharge && isNaN(vendorCharge)) {
    errors.vendorCharge = "Vendor charge must be a number";
  }
  if (minimumAmountLimit && isNaN(minimumAmountLimit)) {
    errors.minimumAmountLimit = "Minimum amount limit must be a number";
  }
  if (maximumAmountLimit && isNaN(maximumAmountLimit)) {
    errors.maximumAmountLimit = "Maximum amount limit must be a number";
  }
  // Validate positive numbers
  if (amountLimit && amountLimit < 0) {
    errors.amountLimit = "Amount limit must be a positive number";
  }
  if (gstVat && gstVat < 0) {
    errors.gstVat = "GST/VAT must be a positive number";
  }
  if (isFixCharge && isFixCharge < 0) {
    errors.isFixCharge = "Is fix charge must be a positive number";
  }
  if (merchantCharge && merchantCharge < 0) {
    errors.merchantCharge = "Merchant charge must be a positive number";
  }
  if (pgCharge && pgCharge < 0) {
    errors.pgCharge = "PG charge must be a positive number";
  }
  if (bankCharge && bankCharge < 0) {
    errors.bankCharge = "Bank charge must be a positive number";
  }
  if (vendorCharge && vendorCharge < 0) {
    errors.vendorCharge = "Vendor charge must be a positive number";
  }
  if (minimumAmountLimit && minimumAmountLimit < 0) {
    errors.minimumAmountLimit = "Minimum amount limit must be a positive number";
  }
  if (maximumAmountLimit && maximumAmountLimit < 0) {
    errors.maximumAmountLimit = "Maximum amount limit must be a positive number";
  }
  // Validate that minimum amount limit is less than maximum amount limit
  if (minimumAmountLimit && maximumAmountLimit) {
    if (parseFloat(minimumAmountLimit) >= parseFloat(maximumAmountLimit)) {
      errors.minimumAmountLimit =
        "Minimum amount limit must be less than maximum amount limit";
    }
  }
  

  // remove nulls 

  Object.keys(errors).forEach((key) => {
    if (errors[key] === null) {
      delete errors[key];
    }
  }
  );


  return errors
};


