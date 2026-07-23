export const mapPaymentTypeAndMop = async (
  userId,
  paymentTypeId,
  mopTypeId
) => {
  const acquirer = { acquirerId: userId };
  const paymentType = { paymentTypeId };
  const mopType = { mopTypeId };
  return { acquirer, paymentType, mopType };
};

export const transferModeMapping = async (acquirerId, transferModeCode) => {
  return {
    acquirer: { acquirerId },
    transferMode: { transferModeCode },
  };
};

export const merchantTdrMapping = (merchantId) => {
  return {
    merchantId: merchantId,
    acquirerId: "",
    paymentTypeId: "",
    mopTypeId: "",
    priority: "",
    amountLimit: "",
    gstVat: "",
    isFixCharge: "",
    merchantCharge: "",
    bankCharge: "",
    minimumAmountLimit: "",
    maximumAmountLimit: "",
  };
};

export const priority = (merchantId, acquirerId) => {
  return { merchantId, acquirerId };
};


export const payoutTdrMapping = (merchantId) => {
  return {
    merchant: merchantId,
    acquirer: "",
    transferMode: "",
    priority: "",
    amountLimit: "",
    gstVat: "",
    isFixCharge: "",
    merchantCharge: "",
    pgCharge: "",
    bankCharge: "",
    vendorCharge: "",
    minimumAmountLimit: "",
    maximumAmountLimit: "",
  };
};



export const minimumAccount = (
  merchantId,
  acquirerId,
  paymentTypeId,
  mopTypeId,
  priority
) => {
  return { merchantId, acquirerId, paymentTypeId, mopTypeId, priority };
};

export const merchantAmountLimit = (merchantId) => {
  return {
    merchant: { userId: merchantId },
    paymentType: { paymentTypeId: "" },
    mopType: { mopTypeId: "" },
    dailyCountLimitActive: "",
    dailyCountLimit: "",
    weeklyCountLimitActive: "",
    weeklyCountLimit: "",
    monthlyCountLimitActive: "",
    monthlyCountLimit: "",
    yearlyCountLimitActive: "",
    yearlyCountLimit: "",
    dailyAmountLimitActive: "",
    dailyAmountLimit: "",
    weeklyAmountLimitActive: "",
    weeklyAmountLimit: "",
    monthlyAmountLimitActive: "",
    monthlyAmountLimit: "",
    yearlyAmountLimitActive: "",
    yearlyAmountLimit: "",
  };
};

export const currencyMapping = async (merchantId, currency) => {
  return { userId: merchantId, currencies: [currency.id] };
};

export const countryMapping = async (merchantId, country) => {
  return { userId: merchantId, countries: [country.id] };
};

export const webhookMapping = async (merchantId, url, type) => {
  if (type === "payin")
    return {
      userId: merchantId,
      payinWebhookUrl: url,
    };
  else {
    return {
      userId: merchantId,
      payoutWebhookUrl: url,
    };
  }
};
