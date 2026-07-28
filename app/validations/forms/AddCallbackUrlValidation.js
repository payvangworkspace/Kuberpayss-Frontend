import { validateEmpty, validateWebsiteUrl } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const countryError = validateEmpty(data.value);
  if (countryError) errors.value = countryError;
  const websiteError = validateWebsiteUrl(data.value);
  if (websiteError) errors.value = websiteError;
  return errors;
};