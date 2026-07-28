import { validateIntegerNumber, validateName } from "../InputType";

export const validate = (data) => {
  const errors = {};

  //  validation
  if (data) {
    const bankNameError = validateName(data.bankName);
    if (bankNameError) errors.bankName = bankNameError;
    const branchNameError = validateName(data.branchName);
    if (branchNameError) errors.branchName = branchNameError;
    const accountNumberError = validateIntegerNumber(data.bankAccountNumber);
    if (accountNumberError) errors.accountNumber = accountNumberError;
  }

  return errors;
};
