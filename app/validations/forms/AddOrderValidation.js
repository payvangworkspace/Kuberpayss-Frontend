import {
  validateContact,
  validateDecimalNumber,
  validateEmail,
  validateEmpty,
  validateIntegerNumber,
  validateName,
  validateZipCode,
} from "../InputType";

export const validate = (data) => {
  const errors = {};
  const decimalError = validateDecimalNumber(data.payableAmount);
  if (decimalError) errors.payableAmount = decimalError;
  const txnTypeError = validateEmpty(data.TxnType);
  if (txnTypeError) errors.TxnType = txnTypeError;
  const nameError = validateName(data.customerName);
  if (nameError) errors.customerName = nameError;
  const emailError = validateEmail(data.customerEmailId);
  if (emailError) errors.customerEmailId = emailError;
  const phoneNumberError = validateContact(data.customerContactNumber);
  if (phoneNumberError) errors.customerContactNumber = phoneNumberError;
  const zipError = validateZipCode(data.customerZip);
  if (zipError) errors.customerZip = zipError;
  return errors;
};
