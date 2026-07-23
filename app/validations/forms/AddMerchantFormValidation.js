import {
  validateContact,
  validateEmail,
  validateEmpty,
  validateGSTVAT,
  validateName,
  validatePANSSN,
  validatePassword,
  validateWebsiteUrl,
} from "../InputType";

export const validate = async (data) => {
  const errors = {};
  if (data) {
    const nameError = validateName(data.fullName);
    if (nameError) errors.fullName = nameError;

    const businessNameError = validateName(data.businessName);
    if (businessNameError) errors.businessName = "Business Name is required";

    const emailError = validateEmail(data.userId);
    if (emailError) errors.userId = emailError;

    // const contactNumberError = validateContact(data.contactNumber);
    // if (contactNumberError) errors.contactNumber = contactNumberError;

    const businessTypeError = validateEmpty(data.businessType);
    if (businessTypeError)
      errors.businessType = "Business Type should be selected";

    const subBusinessTypeError = validateEmpty(data.businessSubType);
    if (subBusinessTypeError)
      errors.businessSubType = "Business sub industry should be selected";

    // const panError = validatePANSSN(data.panSsn);
    // if (panError) errors.panSsn = panError;

    // const gstError = validateGSTVAT(data.gstVat);
    // if (gstError) errors.gstVat = gstError;

    const websiteError = validateWebsiteUrl(data.website);
    if (websiteError) errors.website = websiteError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
  }

  return errors;
};
