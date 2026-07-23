export const MultiSelectOption = (json, valueKey, labelKey) => {
  const options = json.map((element) => ({
    label: element[labelKey],
    value: element[valueKey],
  }));
  return options;
};
