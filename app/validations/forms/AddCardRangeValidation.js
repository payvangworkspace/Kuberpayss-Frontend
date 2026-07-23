import { validateCardRange, validateEmpty } from "../InputType";

export const validate = (data) => {
    const errors = {};
  
    const countryError = validateEmpty(data.value);
    if (countryError) {
      errors.value = countryError;
    } else {
      const cardRangeError = validateCardRange(data.value);
      if (cardRangeError) errors.value = cardRangeError;
    }
  
    return errors;
  };