export function queryString(start, size = 25) {
  return `?start=${start}&size=${size}`;
}
export function queryStringWithKeyword(start = 0, size = 25, keyword = "") {
  return {
    start,
    size,
    keyword,
  };
}
export function queryStringWithKeywordAndUserId(start = 0, size = 25, keyword = "",userName = "",) {
  return {
    start,
    size,
    keyword,
    userName,
  };
}
export function queryStringWithDate(
  start = 0,
  size = 25,
  keyword,
  status,
  dateFrom,
  dateTo,
  userName = "",
  currency,
  type
) {
  return {
    start,
    size,
    status, // Success, Pending, Failed
    dateFrom,
    dateTo,
    userName, // if admin
    keyword,
    currencyCode: currency,
    type,
  };
}
