import CryptoJS from "crypto-js";

export const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(
    token,
    process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY
  ).toString();
};
