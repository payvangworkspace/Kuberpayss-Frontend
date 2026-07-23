import { validateEmpty, validateIPAddress } from "../InputType";

export const validate = (data) => {
  const errors = {};
  if (data) {
    const ipError =validateIPAddress(data.value);
    if (ipError) errors.value = ipError;
  }
  return errors;
};
