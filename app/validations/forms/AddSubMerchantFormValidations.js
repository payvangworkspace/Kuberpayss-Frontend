import {
  validateContact,
  validateEmail,
  validateName,
  validatePassword,
} from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const nameError = validateName(data.fullName);
    if (nameError) {
      errors.fullName = nameError;
    }
    const emailError = validateEmail(data.userId);
    if (emailError) errors.userId = emailError;

    // const contactNumberError = validateContact(data.contactNumber);
    // if (contactNumberError) errors.contactNumber = contactNumberError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
  }
  return errors;
};
