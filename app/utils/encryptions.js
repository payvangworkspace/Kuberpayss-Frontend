import CryptoJS from "crypto-js";

export const encryptParams = (param) => {
  const encrypted = CryptoJS.AES.encrypt(
    param,
    process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY
  ).toString();
  const base64Encoded = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encrypted)
  );
  const safeEncoded = base64Encoded
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=+$/, ""); // Optional replacements
  // console.log("safe encoded", safeEncoded);
  return safeEncoded;
};
