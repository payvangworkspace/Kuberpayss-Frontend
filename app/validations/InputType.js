export const validateEmail = (email) => {
  // Regular Expression for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") return "Email is required";
  else if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};
export const validateVPA = (vpa) => {
  const vpaRegex = /^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z]{2,20}$/;

  if (!vpaRegex.test(vpa))
    return "Invalid Virtual Payment Address. Format: example@bankname";

  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.trim() === "") return "Invalid Password character";
  if (password.length < 8) return "Password must no be less than 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain at least one special character";

  return null;
};
export const validateCardNumber = (number) => {
  const cardRegex = /^[0-9]{4,6}$/; // Ensures only numbers, between 4 to 6 digits

  if (!cardRegex.test(number))
    return "Invalid Card Number, Please Provide only Last 4-6 digits";

  return null;
};
export const validateCardRange = (number) => {
  const cardRegex = /^[0-9]{4}$/; // Ensures exactly 4 digits

  if (!cardRegex.test(number))
    return "Invalid Card Number, Please Provide exactly 4 digits";

  return null;
};

export const validateName = (name) => {
  console.log("nameee", name);
  
  if (!name || name?.trim() === "") return "Name is required";
  // Trim leading and trailing whitespace
  name = name.trim();
  // Regular expression for valid names
  const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
  // Check length
  if (name.length < 2 || name.length > 100) {
    return "Name is too short/long should be from 2 to 100"; // Invalid length
  }
  // Validate against the regex
  if (!nameRegex.test(name))
    return "Invalid characters in name. Name should only contain alphabets";

  return null;
};
export const validateCharges = (data) => {
  const merchant = data.merchantCharge || 0;
  const bank = data.bankCharge || 0;

  if (merchant < bank)
    return "Merchant charge must be greater than or equal to bank charge";

  return null;
};
export const validateImage = (image) => {
  if (!image) return null;

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(image.type)) {
    return "Only PNG, JPG, and JPEG files are allowed";
  }

  return null;
};
export const validateGSTVAT = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/; // GST (India)
  const vatRegex = /^[A-Z]{2}[0-9]{8,12}$/; // VAT (EU Format: CountryCode + 8-12 digits)
  if (!gst || gst.trim() === "") return "GST/VAT Number is required";
  if (gstRegex.test(gst) || vatRegex.test(gst)) return null;
  return "Inavlid GST/VAT Number";
};

export const validatePANSSN = (pan) => {
  if (!pan || pan.trim() === "") return "PAN/SSN Number is required";
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  if (panRegex.test(pan) || ssnRegex.test(pan)) return null;
  return "Invalid PAN/SSN Number";
};

export const validateContact = (number) => {
  if (!number || number.trim() === "") return "Phone number is required";
  // Regular expression for validating contact numbers
  // const phoneRegex =
  //   /^\+?[1-9]\d{0,2}[ -]?\(?\d{1,4}\)?[ -]?\d{1,4}[ -]?\d{1,4}[ -]?\d{1,9}$/;
  const phoneRegex =
    /^\+?[1-9]\d{0,2}[ -]?\(?\d{2,4}\)?[ -]?\d{3,4}[ -]?\d{4,9}$/;

  if (!phoneRegex.test(number)) return "Invalid Phone number";
  return null;
};

export const validateIntegerNumber = (number) => {
  const integerRegex = /^[0-9]+$/; // Only digits
  if (!integerRegex.test(number)) return "Number should only be integer";
  return null;
};

export const validateDecimalNumber = (input) => {
  const decimalRegex = /^-?\d+(\.\d+)?$/; // Digits with optional decimal and negative sign
  if (!decimalRegex.test(input)) return "Invalid Decimal Format";
  return null;
};

export const validateWebsiteUrl = (url) => {
  if (!url || url.trim() === "") return null;
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  if (!urlRegex.test(url)) return "Invalid Website URL";
  return null;
};
export const validateEmpty = (data) => {
  if (data === null || data === undefined || data.length === 0)
    return "Field Should not Empty";
  return null;
};
export const validateZipCode = (data) => {
  if (data === null || data === undefined || data.length === 0)
    return "Field Should not Empty";
  const urlRegex = /^[A-Za-z0-9\s-]{3,10}$/;
  if (!urlRegex.test(data)) return "Invalid ZipCode";
  return null;
};
export const validateDOB = (data) => {
  if (!data || data.trim().length === 0) return "Field should not be empty";
  // const dobRegex = /^(19[0-9]{2}|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const dobRegex =
    /^(0[1-9]|[12][0-9]|3[01]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (19[0-9]{2}|20[0-2][0-9])$/;
  if (!dobRegex.test(data)) return "Invalid Date";
  return null;
};
export const validateIPAddress = (ip) => {
  if (!ip || ip.trim().length === 0) return "Field should not be empty";

  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;

  if (!ipRegex.test(ip)) return "Invalid IP address";

  return null;
};

export const validateFile = (file, type) => {
  if (
    file === null ||
    file === undefined ||
    file.length === 0 ||
    file.type === "application/pdf"
  ) {
    return "Field Should not be Empty and Should be in .jpg/.png/.jpeg";
  }
  // console.log("file", file);
  // const extentionRegex =
  //   /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)?$/;
  // if (extentionRegex) return "File extension not allowed";
  // console.log("extension", file);
  // if (
  //   file.type === "application/pdf" ||
  //   "application/html" ||
  //   "application/wps" ||
  //   "application/doc" ||
  //   "application/docx" ||
  //   "application/odt" ||
  //   "application/tex" ||
  //   "application/txt" ||
  //   "application/rtf" ||
  //   "application/wks" ||
  //   "application/wpd"
  // ) {
  //   return "File type not supported";
  // }

  return null;
};
