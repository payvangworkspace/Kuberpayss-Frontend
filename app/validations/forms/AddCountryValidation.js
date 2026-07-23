import { validateEmpty, validateName } from "../InputType";

export const validate = (data) => {
  const errors = {};
  const nameError = validateName(data.countryName);
  if (nameError) errors.countryName = nameError;
  const capitalNameError = validateName(data.countryCapital);
  if (capitalNameError) errors.countryCapital = capitalNameError;
  const codeError = validateEmpty(data.countryNumericCode);
  if (codeError) errors.countryNumericCode = codeError;
  // const countryError = validateEmpty(data.countryId);
  // if (countryError) errors.countryId = countryError;
  return errors;
};
