import { validateName } from "../InputType";


export const validate = async (data) => {
  const errors = {};
  if (data) {
    const nameError = validateName(data.value);
    if (nameError) errors.value = nameError;

    
  }

  return errors;
};
