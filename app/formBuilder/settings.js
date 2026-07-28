export const addCurrency = () => {
  return {
    currencyName: "",
    currencyCode: "",
    currencyDecimalPlace: "",
    symbol: "",
  };
};

export const addCountry = () => {
  return {
    countryCode: "",
    countryName: "",
    countryNumericCode: "",
    countryPhoneCode: "",
    countryCapital: "",
  };
};

export const addPaymentType = () => {
  return {
    paymentTypeCode: "",
    paymentTypeName: "",
    country: { countryId: "" },
    currency: { currencyId: "" },
  };
};

export const addMopType = () => {
  return {
    mopTypeName: "",
    mopTypeCode: "",
  };
};

export const addTransferMode = () => {
  return {
    transferModeName: "",
    transferModeCode: "",
  };
};

export const addSurcharge = () => {
  return {
    userName: "",
    paymentType: { paymentTypeId: "" },
    serviceTax: "",
    fixCharge: "",
    surchargeValue: "",
    onOffUs: "",
    mopType: { mopTypeId: "" },
    bankChargeValue: "",
  };
};
export const updateSurcharge = (merchantId, paymentTypeId, currentValue) => {
  return {
    merchantId,
    paymentTypeId,
    serviceTax: currentValue.serviceTax,
    surchargeValue: currentValue.surchargeValue,
  };
};

export const updateSurchargeValue = (
  merchantId,
  paymentTypeId,
  currentValue,
) => {
  return {
    merchantId,
    paymentTypeId,
    mopTypeId: currentValue.mopTypeId,
    bankCharge: currentValue.bankCharge,
    onOffUs: currentValue.isOnOffUs === "true",
  };
};
