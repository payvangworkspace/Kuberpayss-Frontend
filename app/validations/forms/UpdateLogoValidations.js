import { validateImage } from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const imageError = validateImage(data.get("image"));
    if (imageError) errors.image = imageError;
  }

  return errors;
};
