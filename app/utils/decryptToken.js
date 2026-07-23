import CryptoJS from "crypto-js";

export const decryptToken = (encryptedToken) => {
  if (encryptedToken) {
    // Decrypt the token using the SECRET_KEY
    const bytes = CryptoJS.AES.decrypt(
      encryptedToken,
      process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY
    );
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

    // If the decryption is successful, return the decrypted token
    return decryptedToken || null;
  }
  return null;
};
