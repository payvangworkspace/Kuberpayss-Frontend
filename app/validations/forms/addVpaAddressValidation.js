import { validateEmail, validateVPA } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const VpaError = validateVPA(data.value);
    if (VpaError) errors.value = VpaError;
  }
  return errors;
};
