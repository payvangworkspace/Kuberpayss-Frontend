import { validateEmpty, validateName } from "../InputType";

export const validate = (data) => {
  const errors = {};
  const nameError = validateName(data.mopTypeName);
  if (nameError) errors.mopTypeName = nameError;
  const codeError = validateEmpty(data.mopTypeCode);
  if (codeError) errors.mopTypeCode = codeError;
  return errors;
};
