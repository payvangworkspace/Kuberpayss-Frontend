import {
  validateContact,
  validateEmail,
  validateEmpty,
  validateGSTVAT,
  validateName,
  validatePANSSN,
  validateWebsiteUrl,
} from "../InputType";

export const validate = (data) => {
  const errors = {};
  if (data) {
    const businessNameError = validateName(data.businessName);
    if (businessNameError) errors.businessName = businessNameError;
    const emailError = validateEmail(data.businessEmail);
    if (emailError) errors.businessEmail = emailError;

    const contactNumberError = validateContact(data.phone);
    if (contactNumberError) errors.phone = contactNumberError;

    // const panError = validatePANSSN(data.panSsn);
    // if (panError) errors.panSsn = panError;

    // const gstError = validateGSTVAT(data.gstVat);
    // if (gstError) errors.gstVat = gstError;
    const urlError = validateEmpty(data.websiteUrl);
    if (urlError) {
      errors.websiteUrl = urlError;
      return errors;
    }
    const websiteError = validateWebsiteUrl(data.websiteUrl);
    if (websiteError) errors.websiteUrl = websiteError;
    const descError = validateEmpty(data.businessAddress);
    if (descError) {
      errors.businessAddress = descError;
      return errors;
    }

    // Todo Fees validations remaining
  }
  return errors;
};
