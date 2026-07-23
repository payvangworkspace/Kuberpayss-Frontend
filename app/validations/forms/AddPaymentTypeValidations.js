import { validateEmpty, validateName } from "../InputType";
export const validate = (data) => {
  const errors = {};
  if (data) {
    const typeError = validateEmpty(data.paymentTypeCode);
    if (typeError) {
      errors.paymentTypeCode = typeError;
    }
    const typeName = validateName(data.paymentTypeName);
    if (typeName) {
      errors.paymentTypeName = typeName;
    }
    const countryError = validateEmpty(data.country["countryId"]);
    if (countryError) errors.country = countryError;
    const currencyError = validateEmpty(data.currency["currencyId"]);
    if (currencyError) errors.currency = currencyError;
  }
  return errors;
};
