import { validateEmpty } from "../InputType";

export const validate = (data) => {
  const errors = {};
  
  const countryError = validateEmpty(data.value);
  if (countryError) errors.value = countryError;
  
  return errors;
};
