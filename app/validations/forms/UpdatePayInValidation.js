import { validateCharges } from "../InputType";

export const validate = async (data) => {
  const errors = {};

  if (data) {
    const chargeError = validateCharges(data);
    if (chargeError) {
      errors.merchantCharge = chargeError;
      errors.bankCharge = chargeError;
    }
  }

  return errors;
};
