import { validateEmpty } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const countryError = validateEmpty(data.acquirerId);
  if (countryError) errors.acquirerId = countryError;
  const paymentTypeError = validateEmpty(data.paymentTypeId);
  if (paymentTypeError) errors.paymentTypeId= paymentTypeError;
  const MOPTypeError = validateEmpty(data.mopTypeId);
  if (MOPTypeError) errors.mopTypeId= MOPTypeError;
  return errors;
};


