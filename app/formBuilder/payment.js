export const checkoutRequestForm = (merchantId, appId, orderId) => {
  return { merchantId, appId, orderId };
};
export const checkoutForm = (merchantId, paymentTypeId, payableAmount) => {
  return {
    ...merchantId,
    paymentTypeId,
    payableAmount,
  };
};
