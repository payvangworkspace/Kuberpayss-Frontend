import { validateCardNumber, validateEmpty } from "../InputType";


export const validate = (data) => {
  const errors = {};

  const countryError = validateEmpty(data.value);
  if (countryError) {
    errors.value = countryError;
  } else {
    const cardNumberError = validateCardNumber(data.value);
    if (cardNumberError) errors.value = cardNumberError;
  }

  return errors;
};
