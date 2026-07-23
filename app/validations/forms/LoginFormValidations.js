import { validateEmail, validatePassword } from "../InputType";

export const validate = (data) => {
  const errors = {};
  // Email validation
  if (data) {
    const error = validateEmail(data.userName);
    if (error) errors.email = error;
  }
  // Password validation
  if (data) {
    const error = validatePassword(data.password);
    if (error) errors.password = error;
  }
  return errors;
};
