export const headers = (role, isSubMerchant) => {
  if (role || isSubMerchant) {
    return [
      "UTR",
      "PAYABLE AMOUNT",
      "REMITTANCE DATE",
      "MERCHANT",
      "CURRENCY CODE",
      "ACQUIRER CODE",
      "ACTION",
    ];
  } else {
    return [
      "UTR",
      "PAYABLE AMOUNT",
      "REMITTANCE DATE",
      "MERCHANT",
      "CURRENCY CODE",
      "ACTION",
    ];
  }
};
