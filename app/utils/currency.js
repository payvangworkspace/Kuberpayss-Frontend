export const SUPPORTED_CURRENCIES = [
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
];

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
};

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];

export const getCurrencySymbol = (currencyCode) =>
  CURRENCY_SYMBOLS[currencyCode] || CURRENCY_SYMBOLS.USD;

export const formatAmount = (amount, currencyCode) => {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${getCurrencySymbol(currencyCode)} ${safeValue}`;
};
