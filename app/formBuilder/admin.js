export const addSubAdmin = {
  userId: "",
  contactNumber: "",
  fullName: "",
  password: "",
  permissions: {},
};

export const updatePermission = (id, currentPermission) => {
  return {
    userId: id,
    permissions: currentPermission,
  };
};
