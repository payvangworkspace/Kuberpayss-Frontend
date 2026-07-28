import { validateEmpty, validateWebsiteUrl } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const countryError = validateEmpty(data.url);
  if (countryError) errors.url= countryError;
  const websiteError = validateWebsiteUrl(data.url);
  if (websiteError) errors.url = websiteError;
  return errors;
};