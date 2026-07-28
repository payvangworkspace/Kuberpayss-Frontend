import { validateEmpty } from "../InputType";

export const validate = (data) => {
  const errors = {};

  const nameError = validateEmpty(data.currencyName);
  if (nameError) errors.currencyName = nameError;

  const codeError = validateEmpty(data.currencyCode);
  if (codeError) errors.currencyCode = codeError;

  const symbolError = validateEmpty(data.symbol);
  if (symbolError) errors.symbol = symbolError;

  return errors;
};
