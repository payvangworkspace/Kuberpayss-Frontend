import { validateName } from "../InputType";

export const validate = (data) => {
  const errors = {};
  if (data) {
    const transferModeNameError = validateName(data.transferModeName);
    if (transferModeNameError) errors.transferModeName = transferModeNameError;
    const transferModeCodeError = validateName(data.transferModeCode);
    if (transferModeCodeError) errors.transferModeCode = transferModeCodeError;
  }

  return errors;
};
