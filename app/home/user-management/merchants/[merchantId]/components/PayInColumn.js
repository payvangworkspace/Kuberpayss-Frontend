export const updatePayIn = (updateData) => {
  return {
    merchantChargeId: updateData.merchantChargeId,
    merchantCharge: updateData.merchantCharge,
    bankCharge: updateData.bankCharge,
  };
};
