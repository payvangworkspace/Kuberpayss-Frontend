export function FilterByKey(array, key) {
  const data = array.filter((element) => element.documentType === key);
  return data;
}
