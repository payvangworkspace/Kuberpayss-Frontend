import moment from "moment";

const DISPLAY_FORMAT = "DD MMM YYYY";
const INPUT_FORMAT = "YYYY-MM-DD";

function parseFlexibleDate(inputDate) {
  if (!inputDate) return moment.invalid();

  if (moment.isMoment(inputDate) || inputDate instanceof Date) {
    return moment(inputDate);
  }

  const value = String(inputDate).trim();
  if (!value) return moment.invalid();

  // Prefer explicit formats used in this app to avoid Moment's JS Date fallback warning
  const parsed = moment(
    value,
    [DISPLAY_FORMAT, INPUT_FORMAT, moment.ISO_8601],
    true
  );
  if (parsed.isValid()) return parsed;

  return moment(value);
}

export function dateFormatter(inputDate) {
  const parsed = parseFlexibleDate(inputDate);
  return parsed.isValid() ? parsed.format(DISPLAY_FORMAT) : "";
}

export function dateTimeFormatter(inputDate) {
  const parsed = parseFlexibleDate(inputDate);
  return parsed.isValid()
    ? parsed.format("DD MMM YYYY  hh:mm:ss a")
    : "";
}

export function dateTimeFormatterCaps(inputDate) {
  const parsed = parseFlexibleDate(inputDate);
  return parsed.isValid()
    ? parsed.format("DD MMM YYYY  hh:mm:ss A")
    : "";
}

export function inputFieldDateFormatter(date) {
  const parsed = parseFlexibleDate(date);
  return parsed.isValid() ? parsed.format(INPUT_FORMAT) : "";
}
