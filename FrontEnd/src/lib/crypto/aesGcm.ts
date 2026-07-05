import { AES_GCM, AUTH_TAG_LENGTH, IV_LENGTH } from "./constants";
import { fromHex, toHex } from "./hex";
import { getAesKey } from "./key";

// Encripta un valor usando AES-GCM
export const encrypt = async (value: string): Promise<string> => {
  const key = await getAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    { name: AES_GCM, iv },
    key,
    new TextEncoder().encode(value),
  );
  const encryptedBytes = new Uint8Array(encrypted);
  const ciphertext = encryptedBytes.slice(0, -AUTH_TAG_LENGTH);
  const authTag = encryptedBytes.slice(-AUTH_TAG_LENGTH);

  return `${toHex(iv)}:${toHex(authTag)}:${toHex(ciphertext)}`;
};

// Desencripta un valor usando AES-GCM
export const decrypt = async (payload: string): Promise<string> => {  const [ivHex, authTagHex, encryptedHex] = payload.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Formato de dato encriptado inválido");
  }

  const iv = new Uint8Array(fromHex(ivHex));
  const authTag = new Uint8Array(fromHex(authTagHex));
  const ciphertext = new Uint8Array(fromHex(encryptedHex));
  const key = await getAesKey();
  const combined = new Uint8Array(ciphertext.length + authTag.length);

  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: AES_GCM, iv },
    key,
    combined,
  );

  return new TextDecoder().decode(decrypted);
};
