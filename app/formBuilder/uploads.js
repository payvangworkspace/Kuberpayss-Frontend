export const documentFormData = async (merchantId, name, file) => {
  const formData = new FormData();
  formData.append("documentType", name);
  formData.append("userId", merchantId);
  formData.append("file", file);
  return formData;
};
