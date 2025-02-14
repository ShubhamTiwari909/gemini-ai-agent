import crypto from "crypto";

// Encryption function
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // REPLACE THIS!
const SECONDARY_KEY = process.env.SECONDARY_KEY || ""; // New Layer Key

/**
 * AES Decryption function
 * @param {string} text - The text to decrypt
 * @returns {string} The decrypted text
 * @description
 * This function decrypts the given text using the ENCRYPTION_KEY.
 * It splits the text into the IV and the encrypted text, creates a
 * decipher object with the key and the IV, and then decrypts the
 * text using the decipher.update() and decipher.final() methods.
 */
function aesDecrypt(text: string) {
  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "hex"),
  );
  return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
}

/**
 * Secondary Decryption function
 * @param {string} text - The text to decrypt
 * @returns {string} The decrypted text
 * @description
 * This function decrypts the given text using the SECONDARY_KEY.
 * It splits the text into the IV, the encrypted text, and the authentication tag,
 * creates a decipher object with the key, the IV, and the authentication tag,
 * and then decrypts the text using the decipher.update() and decipher.final() methods.
 */
function secondaryDecrypt(text: string) {
  const [iv, encryptedText, authTag] = text.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(SECONDARY_KEY, "hex"),
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
}

/**
 * Hybrid decryption function
 * @param {string | undefined | null} text - The text to decrypt
 * @returns {string | null} The decrypted text
 * @description
 * This function decrypts the given text by first decrypting it with the secondary key,
 * and then decrypting the result with the encryption key.
 * If the given text is null or undefined, it returns null.
 */
export function decrypt(text: string | undefined | null) {
  if (!text) return;
  const firstLayer = secondaryDecrypt(text);
  return aesDecrypt(firstLayer);
}
