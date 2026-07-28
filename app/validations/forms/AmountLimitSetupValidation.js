import { validateEmpty } from "../InputType";
export const validate = (data) => {
  const errors = {};
  const amountlimitError = validateEmpty(data.value);
  if (amountlimitError) errors.value = amountlimitError;
  return errors;
};
