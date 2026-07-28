export const addAcquirerPayin = async (form, id) => {
  const userId = form.username.value;
  const contactNumber = form.username.value;
  const fullName = form.name.value;
  const password = form.password.value;
  const secretkey = form.secretkey.value;
  const acquirer = { userId: id };
  return {
    userId,
    contactNumber,
    fullName,
    password,
    secretkey,
    acquirer,
  };
};

export const addAcquirer = () => {
  return {
    fullName: "",
    acquirerCode: "",
    payin: true,
    acquirerPgId: "",
    acquirerPgKey: "",
    acquirerPgPassword: "",
    payout: false,
    acquirerPayoutPgId: "",
    acquirerPayoutPgKey: "",
    acquirerPayoutPgPassword: "",
  };
};

export const updatePayinAcquirer = (
  id,
  pgId = "",
  pgKey = "",
  pgPassword = ""
) => {
  return {
    acquirerId: id,
    acquirerPgId: pgId,
    acquirerPgKey: pgKey,
    acquirerPgPassword: pgPassword,
  };
};
export const updatePayoutAcquirer = (
  id,
  pgId = "",
  pgKey = "",
  pgPassword = ""
) => {
  return {
    acquirerId: id,
    acquirerPayoutPgId: pgId,
    acquirerPayoutPgKey: pgKey,
    acquirerPayoutPgPassword: pgPassword,
    payout: true,
  };
};

export const addPayinAcquirer = (
  id,
  fullName,
  acqCode,
  pgId,
  pgKey,
  pgPassword
) => {
  return {
    acquirerId: id,
    fullName: fullName,
    acquirerCode: acqCode,
    payin: true,
    acquirerPgId: "",
    acquirerPgKey: "",
    acquirerPgPassword: "",
    payout: true,
    acquirerPayoutPgId: pgId,
    acquirerPayoutPgKey: pgKey,
    acquirerPayoutPgPassword: pgPassword,
  };
};
export const addPayoutAcquirer = (
  id,
  fullName,
  acqCode,
  pgId,
  pgKey,
  pgPassword
) => {
  return {
    acquirerId: id,
    fullName: fullName,
    acquirerCode: acqCode,
    payin: true,
    acquirerPgId: pgId,
    acquirerPgKey: pgKey,
    acquirerPgPassword: pgPassword,
    payout: true,
    acquirerPayoutPgId: "",
    acquirerPayoutPgKey: "",
    acquirerPayoutPgPassword: "",
  };
};
