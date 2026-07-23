import CryptoJS from "crypto-js";

export const decryptParams = (param = "") => {
  const base64Original =
    param.replace(/_/g, "/").replace(/-/g, "+") +
    "=".repeat((4 - (param.length % 4)) % 4);
  const decodedEncrypted = CryptoJS.enc.Base64.parse(base64Original).toString(
    CryptoJS.enc.Utf8
  );
  const bytes = CryptoJS.AES.decrypt(
    decodedEncrypted,
    process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY
  );
  const decryptParam = bytes.toString(CryptoJS.enc.Utf8);
  return decryptParam || null;
};

function decodeBase64(base64String) {
  return Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
}

function stringToArrayBuffer(string) {
  return new TextEncoder().encode(string);
}

function arrayBufferToString(arrayBuffer) {
  return new TextDecoder().decode(arrayBuffer);
}

function fromBase62(base62) {
  // Define the Base62 character set
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let number = BigInt(0);

  // Decode Base62 string into a BigInt
  for (const char of base62) {
    number = number * BigInt(62) + BigInt(base62Chars.indexOf(char));
  }

  // Convert BigInt to byte array
  let byteArray = [];
  while (number > 0) {
    byteArray.unshift(Number(number % BigInt(256))); // Get the least significant byte
    number = number / BigInt(256); // Shift right by one byte
  }

  // Return the byte array
  return Uint8Array.from(byteArray);
}

export async function decryptAES(encryptedBase64) {
  // Decode the Base64-encrypted string
  const encryptedBytes = fromBase62(encryptedBase64);
  // const encryptedBytes = decodeBase64(encryptedBase64);
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY2;
  const iv = process.env.NEXT_PUBLIC_ENCRYPTION_IV_KEY;
  // Convert key and IV to ArrayBuffer
  const keyBytes = stringToArrayBuffer(key);
  const ivBytes = stringToArrayBuffer(iv);

  // Import the key into Web Crypto
  const cryptoKey = await crypto.subtle.importKey(
    "raw", // Key format
    keyBytes, // Key bytes
    "AES-CBC", // Algorithm
    false, // Key cannot be exported
    ["decrypt"] // Key usage
  );

  // Perform decryption
  const decryptedBytes = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: ivBytes,
    },
    cryptoKey,
    encryptedBytes
  );

  // Convert decrypted bytes to string
  // Convert decrypted bytes to string
  return arrayBufferToString(decryptedBytes);
}

// Helper functions
// function decodeBase64(base64String) {
//   return Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
// }

// function stringToArrayBuffer(string) {
//   return new TextEncoder().encode(string);
// }

// function arrayBufferToString(arrayBuffer) {
//   return new TextDecoder().decode(arrayBuffer);
// }

// export async function decryptAES() {
//   const encryptedBase64 =
//     "NR1uU0GHydXbKEfzmeanyiatnhk2WUd+wJSE1xzWCSrTfWyUWcgyoJjmdW73vL5xAlErVTlvsFR59CCtqE3JMjk4fdEv4hvmoPxfW8eQgikC8SMzmeanyiatnhkP5E4c8=".replaceAll(
//       "zmeanyiatnhk",
//       "/"
//     ); // Replace with Java's output
//   console.log("encrypted url", encryptedBase64);
//   // Decode the Base64-encrypted string
//   const encryptedBytes = decodeBase64(encryptedBase64);
//   console.log("e", encryptedBytes);
//   // Convert key and IV to ArrayBuffer
//   const keyBytes = stringToArrayBuffer("mrmysYlXfR1q0fkWeGMLvQ==");
//   const ivBytes = stringToArrayBuffer("mzaeynaintkhpayj");

//   // Import the key into Web Crypto
//   const cryptoKey = await crypto.subtle.importKey(
//     "raw", // Key format
//     keyBytes, // Key bytes
//     "AES-CBC", // Algorithm
//     false, // Key cannot be exported
//     ["decrypt"] // Key usage
//   );

//   // Perform decryption
//   const decryptedBytes = await crypto.subtle.decrypt(
//     {
//       name: "AES-CBC",
//       iv: ivBytes,
//     },
//     cryptoKey,
//     encryptedBytes
//   );
//   console.log("desc", decryptedBytes);

//   // Convert decrypted bytes to string
//   return arrayBufferToString(decryptedBytes);
// }
