import {
  validateContact,
} from "../InputType";
export const validate = async (data) => {
  const errors = {};
  if (data) {
    const contactNumberError = validateContact(data.value);
    if (contactNumberError) errors.value = contactNumberError; 
  }

  return errors;
};
