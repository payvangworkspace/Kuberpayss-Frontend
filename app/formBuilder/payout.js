export const addLoadMoney = {
  userId: "",
  currencyId: "",
  amount: "",
  remark: "",
  receiptImage: "",
  receiptId: "",
};

export const addLoadMoneyBuilder = (data) => {
  const formData = new FormData();
  formData.append("userId", data.userId);
  formData.append("currencyId", data.currencyId);
  formData.append("amount", data.amount);
  formData.append("remark", data.remark);
  formData.append("receiptImage", data.receiptImage);
  formData.append("receiptId", data.receiptId);
  return formData;
};

export const CARD_TXN_TYPE = "CARD";

export const CARD_PAYLOAD_FIELDS = [
  "cardNo",
  "cardHolderName",
  "cardExpMonth",
  "cardExpYear",
  "cardCVV",
];

const BASE_PAYMENT_LINK_FIELDS = [
  "appKey",
  "txnType",
  "countryCode",
  "currencyCode",
  "merchantId",
  "payableAmount",
  "ordRequestId",
  "customerName",
  "customerEmailId",
  "customerContactNumber",
  "return_url",
  "notifyEmail",
  "notifyPhone",
  "expDate",
];

export const addPaymentLink = (selectedMerchant, appKey) => {
  return {
    appKey: appKey,
    txnType: "",
    countryCode: "",
    currencyCode: "",
    merchantId: "",
    payableAmount: "",
    ordRequestId: "",
    customerName: "",
    customerEmailId: "",
    customerContactNumber: "",
    notifyEmail: "",
    notifyPhone: "",
    expDate: "",
    return_url: "https://merchant.example/payin-webhook",
  };
};

export const buildPaymentLinkPayload = (data, selectedTxnType) => {
  const txnType = String(selectedTxnType || data.txnType || "").trim();
  const isCardTxn = txnType === CARD_TXN_TYPE;
  const allowedFields = isCardTxn
    ? [...BASE_PAYMENT_LINK_FIELDS, ...CARD_PAYLOAD_FIELDS]
    : BASE_PAYMENT_LINK_FIELDS;

  const payload = { txnType };

  allowedFields.forEach((field) => {
    if (field === "txnType") return;

    const value = data?.[field];
    if (value !== undefined && value !== null && value !== "") {
      payload[field] = value;
    }
  });

  return payload;
};

export const addBankBeneficiary = () => {
  return {
    name: "",
    contactNumber: "",
    email: "",
    accountNumber: "",
    ifscCode: "",
  };
};
export const addVPABeneficiary = () => {
  return {
    name: "",
    contactNumber: "",
    email: "",
    vpaAddress: "",
  };
};

export const directTransferMoney = () => {
  return { transferId: "", benficiaryName: "" };
};

export const addBeneficiary = {
  user: { userId: "" },
  currency: { currencyId: "" },
  beneficiaryName: "",
  beneficiaryContactNumber: "",
  beneficiaryEmail: "",
  beneficiaryNickName: "",
  accountNumber: "",
  bankCode: "",
  beneficiaryBankName: "",
};
export const addSinglePayout = () => {
  return {
    appKey: "",
    amount: "",
    countryCode: "",
    currencyCode: "",
    transferType: "single",
    transferMode: "",
    orderId: "",
    contactNumber: "",
    email: "",
    remark: "",
    beneficiaryName: "",
    beneficiaryBankName: "",
    beneficiaryAccount: "",
    beneficiaryIFSCCode: "",
    vpaAddress: "",
    returnUrl: "https://pg.kuberpays.com",
  };
};

export const addUtilityPayment = () => {
  return {
    appKey: "",
    transactionRef: "",
    timeStamp: new Date().toISOString(),
    account: "",
    serviceProviderID: "",
  };
};
export const payUtilityPayment = () => {
  return {
    appKey: "",
    orderId: "",
    currencyCode: "",
    countryCode: "",
    transferMode: "",
    amount: 0,
    beneficiaryAccount: "",
    beneficiaryName: "",
    accountNumber: "",
    remark: "",
    returnUrl: "https://pg.kuberpays.com",
  };
};
export const payGovtTax = () => {
  return {
    appKey: "",
    transactionRef: "",
    account: "",
    serviceProviderID: "",
    timeStamp: new Date().toISOString(),
  };
};

export const payGovtTaxResponse = () => {
  return {
    appKey: "",
    transactionRef: "",
    ProccDate: new Date().toISOString(),
    account: "",
    serviceProviderID: "",
    DrAccount: "",
    RemitName: "",
    Amount: 0,
    Mssdin: "256761958928",
  };
};
export const payWaterPayment = () => {
  return {
    appKey: "",
    location: "",
    transactionRef: "",
    timeStamp: new Date().toISOString(),
    account: "",
    serviceProviderID: "",
  };
};
