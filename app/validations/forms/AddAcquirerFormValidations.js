import { validateEmpty, validateName, validatePassword } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const nameError = validateName(data.fullName);
    if (nameError) {
      errors.fullName = nameError;
    }
    const codeError = validateEmpty(data.acquirerCode);
    if (codeError) {
      errors.acquirerCode = codeError;
    }
    if (!data.payin && !data.payout) {
      errors.payinOrPayout = "Please select either payin or payout";
    }
    if (data.payin) {
      const pgIdError = validateEmpty(data.acquirerPgId);
      if (pgIdError) {
        errors.acquirerPgId = pgIdError;
      }
      const pgKeyError = validateEmpty(data.acquirerPgKey);
      if (pgKeyError) {
        errors.acquirerPgKey = pgKeyError;
      }
      const pgPasswordError = validateEmpty(data.acquirerPgPassword);
      if (pgPasswordError) {
        errors.acquirerPgPassword = pgPasswordError;
      }
    }
    if (data.payout) {
      const payoutPgIdError = validateEmpty(data.acquirerPayoutPgId);
      if (payoutPgIdError) {
        errors.acquirerPayoutPgId = payoutPgIdError;
        return errors;
      }
      const payoutPgKeyError = validateEmpty(data.acquirerPayoutPgKey);
      if (payoutPgKeyError) {
        errors.acquirerPayoutPgKey = payoutPgKeyError;
        return errors;
      }
      const payoutPgPasswordError = validatePassword(
        data.acquirerPayoutPgPassword
      );
      if (payoutPgPasswordError) {
        errors.acquirerPayoutPgPassword = payoutPgPasswordError;
        return errors;
      }
    }
  }
  return errors;
};
