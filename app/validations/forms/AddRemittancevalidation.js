import { validateEmpty, validateName } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const bankNameError = validateEmpty(data.bankName);
    if (bankNameError) errors.bankName = bankNameError;
  }
  const codeError = validateEmpty(data.currency);
    if (codeError) {
      errors.currency = codeError;
      return errors;
    }

  return errors;
};
