import { validateEmail } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const emailError = validateEmail(data.value);
    if (emailError) errors.value = emailError;
  }
  return errors;
};
