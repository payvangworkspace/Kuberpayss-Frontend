export const headers = (role) => {
  return [
    "TRANSACTION AMOUNT",
    "TDR DEDUCTION",
    "SETTLEMENT AMOUNT",
    "RESERVE PERCENTAGE",
    "RESERVED AMOUNT",
    "NET SETTLEMENT AMOUNT",
    "RESERVED AT",
    "RELEASE DATE",
    "RELEASED AT",
    "STATUS",
    "CANCELLATION REASON",
    "CURRENCY",
    "HOLD DAYS",
    ...(role ? ["ACTION"] : []),
  ];
};
