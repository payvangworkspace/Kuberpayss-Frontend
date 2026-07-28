import { validateContact, validateDOB, validateEmpty } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const contactNumberError = validateContact(data.contactNumber);
    if (contactNumberError) errors.contactNumber = contactNumberError;
    const dobError = validateDOB(data.dateOfBirth);
    if (dobError) errors.dateOfBirth = dobError;

    const codeError = validateEmpty(data.address);
    if (codeError) {
      errors.address = codeError;
      return errors;
    }
  }
  return errors;
};
