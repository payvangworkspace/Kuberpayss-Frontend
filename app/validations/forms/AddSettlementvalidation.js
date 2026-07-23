import { validateEmpty } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const countryError = validateEmpty(data.day);
  if (countryError) errors.day = countryError;
  return errors;
};
