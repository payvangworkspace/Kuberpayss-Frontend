import moment from "moment";

export function dateFormatter(inputDate) {
  return moment(inputDate).format("DD MMM YYYY");
}
export function dateTimeFormatter(inputDate) {
  return moment(inputDate).format("DD MMM YYYY  hh:mm:ss a");
}
export function dateTimeFormatterCaps(inputDate) {
  return moment(inputDate).format("DD MMM YYYY  hh:mm:ss A");
}
export function inputFieldDateFormatter(date) {
  return moment(date).format("YYYY-MM-DD");
}
