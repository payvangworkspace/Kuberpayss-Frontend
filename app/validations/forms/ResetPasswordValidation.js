import { validatePassword } from "../InputType";

export const validate = (data) => {
  const errors = {};
  if (data) {
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
    const confirmPasswordError = validatePassword(data.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password do not match";
    }
  }
  return errors;
};
