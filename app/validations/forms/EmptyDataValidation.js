import { validateEmpty } from "../InputType";

export const validate = (data) => {
  const errors = {};
  if (data) {
    const emptyDataError = validateEmpty(data);
    if (emptyDataError) errors.empty = emptyDataError;
  }
  return errors;
};
