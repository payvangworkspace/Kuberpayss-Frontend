import { validateIntegerNumber } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const chargeError = validateIntegerNumber(data.vendorCharge);
    if (chargeError) {
      errors.fullName = chargeError;
      return errors;
    }
  }
  return errors;
};
