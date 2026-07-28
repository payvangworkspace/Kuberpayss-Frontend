export const addReseller = {
  userId: "",
  contactNumber: "",
  fullName: "",
  password: "",
  permissions: {},
};
export const addMapMerchant = (merchantId, resellerId) => {
  return {
    merchantId: merchantId.id,
    resellerId: resellerId,
    vendorCharge: "",
    fixCharge: "",
  };
};
