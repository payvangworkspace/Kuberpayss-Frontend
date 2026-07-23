import { inputFieldDateFormatter } from "../utils/dateFormatter";

export const addMerchant = {
  userId: "",
  contactNumber: "",
  fullName: "",
  password: "",
  businessName: "",
  panSsn: "",
  gstVat: "",
  website: "",
  businessType: "",
  businessSubType: "",
  reference: "",
};
export const updateMerchant = (data) => {
  return {
    userName: data.userId || "",
    contactNumber: data.contactNumber || "",
    dateOfBirth: inputFieldDateFormatter(data.dateOfBirth) || "",
    gender: data.gender || "",
    address: data.addressDetails || "",
  };
};
export const allUserAndTypeList = {
  type: "",
  userId: "",
};
