export const settlementCycle = (id) => {
  return {
    settlementType: "D",
    day: "",
    settlementTime: "",
    hours: "",
    amount: "",
    userId: id,
    settlementActive: true,
  };
};
