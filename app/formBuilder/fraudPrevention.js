export const addAmountLimit = (userId = "", type, value, value2) => {
  return {
    userId,
    type,
    value,
    value2,
  };
};

export const addWithValue = (userId = "", type, value) => {
  return {
    userId,
    type,
    value,
  };
};
